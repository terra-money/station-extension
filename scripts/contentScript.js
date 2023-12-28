import PortStream from "extension-port-stream"
import PostMessageStream from "post-message-stream"

// contentScript
if (shouldInjectProvider()) {
  checkWebpage()
  injectScript()
  setupStationProvider()
  setupEvents()
  start()
}

/**
 * Check if the current webpage is a known scam
 *
 */
function checkWebpage() {
  browser.storage.local.get(["blacklist"]).then(async ({ blacklist }) => {
    const WARNING_PAGE = `https://scam-warning.pages.dev/`

    function checkAndRedirect(list) {
      // if user is visiting a blacklisted domain or subdomain
      if (
        list.some(
          (url) =>
            window.location.hostname === url ||
            window.location.hostname.endsWith(`.${url}`)
        )
      ) {
        // and is not coming from the warning page
        if (document.referrer.startsWith(WARNING_PAGE)) return
        // redirect to warning page
        window.location.href = WARNING_PAGE
      }
    }

    if (blacklist && blacklist.list) {
      checkAndRedirect(blacklist.list)
    }

    // update every 10min
    if (!blacklist || blacklist.updatedAt < Date.now() - 1000 * 60 * 10) {
      const BLACKLIST_URL = "https://assets.terra.dev/blacklist.json"
      const response = await fetch(BLACKLIST_URL)
      const list = await response.json()
      checkAndRedirect(list)

      browser.storage.local.set({
        blacklist: { list, updatedAt: Date.now() },
      })
    }
  })
}

/**
 * Injects a script tag into the current document
 *
 * @param {string} content - Code to be executed in the current document
 */
function injectScript() {
  try {
    const container = document.head || document.documentElement
    const scriptTag = document.createElement("script")
    scriptTag.setAttribute("src", browser.runtime.getURL("inpage.js"))
    container.insertBefore(scriptTag, container.children[0])
    container.removeChild(scriptTag)

    browser.storage.local.get(["replaceKeplr"]).then(({ replaceKeplr }) => {
      if (replaceKeplr) {
        const keplrScriptTag = document.createElement("script")
        keplrScriptTag.setAttribute("src", browser.runtime.getURL("keplr.js"))
        container.insertBefore(keplrScriptTag, container.children[0])
        container.removeChild(keplrScriptTag)
      }
    })
  } catch (e) {}
}

async function setupStationProvider() {
  const origin = window.location.origin

  window.addEventListener("message", (event) => {
    if (!event.data || !event.data.uuid) return

    const sendResponse = (success, data) => {
      event.source.postMessage(
        {
          uuid: event.data.uuid,
          sender: "station",
          data,
          success,
        },
        event.origin
      )
    }

    // is the message coming from the connected webapp?
    if (event.origin !== origin) {
      sendResponse(false, "Not authorized: origin mismatch.")
      return
    }

    const { sender, type, data, uuid } = event.data
    if (sender !== "web") return

    const handleRequest = (key) => {
      const handleChange = (changes, namespace) => {
        // Detects changes in storage and returns responses if there are changes.
        // When the request is successful, it also closes the popup.
        if (namespace === "local") {
          const { oldValue, newValue } = changes[key] || {}

          if (oldValue && newValue) {
            const changed = newValue.find(
              (post, index) =>
                oldValue[index] &&
                typeof oldValue[index].success === "undefined" &&
                typeof post.success === "boolean"
            )

            changed && changed.origin === origin && sendResponse(true, changed)

            browser.storage.local
              .get(["sign", "post"])
              .then(({ sign = [], post = [] }) => {
                const getRequest = ({ success }) => typeof success !== "boolean"
                const nextRequest =
                  sign.some(getRequest) || post.some(getRequest)

                !nextRequest && closePopup()
              })
          }
        }
      }

      const handleGet = (storage) => {
        // Check the storage for any duplicate requests already, place them at the end of the storage, and then open a popup.
        // Then it detects changes in storage. (See code above)
        // TODO: Even if the popup is already open, reactivate the popup
        const list = storage[key] || []

        const alreadyRequested =
          list.findIndex(
            (req) => req.uuid === uuid && req.origin === origin
          ) !== -1

        !alreadyRequested &&
          browser.storage.local.set({
            [key]: data.purgeQueue
              ? [{ ...data, origin, uuid }]
              : [...list, { ...data, origin, uuid }],
          })

        openPopup()
        browser.storage.onChanged.addListener(handleChange)
      }

      browser.storage.local.get([key]).then(handleGet)
    }

    switch (type) {
      case "interchain-info":
        browser.storage.local.get(["networks"]).then(({ networks }) => {
          sendResponse(true, networks)
        })
        break

      case "theme":
        const handleGetTheme = ({ connect = { allowed: [] }, theme }) => {
          const isAllowed = (connect.allowed || []).includes(origin)

          if (isAllowed) {
            sendResponse(true, theme)
          } else {
            sendResponse(false, "Not authorized: extension not connected.")
          }
        }

        browser.storage.local.get(["connect", "theme"]).then(handleGetTheme)
        break

      case "connect":
        const handleChangeConnect = (changes, namespace) => {
          // It is recursive.
          // After referring to a specific value in the storage, perform the function listed below again.
          if (namespace === "local" && changes.connect) {
            const { newValue, oldValue } = changes.connect

            const denied =
              oldValue &&
              (oldValue.request || []).length - 1 ===
                (newValue.request || []).length &&
              (oldValue.allowed || []).length ===
                (newValue.allowed || []).length

            if (denied) {
              sendResponse(false, "User denied the connection request.")
              closePopup()
              browser.storage.onChanged.removeListener(handleChangeConnect)
            } else {
              browser.storage.local
                .get(["connect", "wallet"])
                .then(handleGetConnect)
            }
          }
        }

        const handleGetConnect = ({
          connect = { request: [], allowed: [] },
          wallet = {},
        }) => {
          // 1. If the address is authorized and the wallet exists
          //    - send back the response and close the popup.
          // 2. If not,
          //    - store the address on the storage and open the popup to request it (only if it is not the requested address).
          const allowed = connect.allowed || []
          const request = connect.request || []

          const isAllowed = allowed.includes(origin)
          const walletExists = wallet.address
          const alreadyRequested = [...request, ...allowed].includes(origin)

          if (isAllowed && walletExists) {
            sendResponse(true, wallet)
            closePopup()
            browser.storage.onChanged.removeListener(handleChangeConnect)
          } else {
            !alreadyRequested &&
              browser.storage.local.set({
                connect: { ...connect, request: [origin, ...request] },
              })

            openPopup()
            browser.storage.onChanged.addListener(handleChangeConnect)
          }
        }

        browser.storage.local.get(["connect", "wallet"]).then(handleGetConnect)
        break

      case "get-pubkey":
        const handleChangePubkey = (changes, namespace) => {
          // It is recursive.
          // After referring to a specific value in the storage, perform the function listed below again.
          if (namespace === "local" && (changes.wallet || changes.pubkey)) {
            const hasPubKey = changes.wallet && changes.wallet.newValue.pubkey

            if (hasPubKey) {
              browser.storage.local
                .get(["connect", "wallet"])
                .then(handleGetPubkey)
            } else {
              browser.storage.local.get(["pubkey"]).then(({ pubkey }) => {
                // pubkey terminated
                if (!pubkey) {
                  sendResponse(false, "User denied.")
                  closePopup()
                  browser.storage.onChanged.removeListener(handleChangePubkey)
                }
              })
            }
          }
        }

        const handleGetPubkey = ({
          connect = { request: [], allowed: [] },
          wallet = {},
        }) => {
          // 1. If the address is authorized and the wallet exists
          //    - send back the response and close the popup.
          // 2. If not,
          //    - store the address on the storage and open the popup to request it (only if it is not the requested address).
          const isAllowed = (connect.allowed || []).includes(origin)
          const hasPubKey = wallet.pubkey

          if (isAllowed && hasPubKey) {
            sendResponse(true, wallet)
            closePopup()
            browser.storage.onChanged.removeListener(handleChangePubkey)
          } else {
            browser.storage.local.set({
              pubkey: origin,
            })

            openPopup()
            browser.storage.onChanged.addListener(handleChangePubkey)
          }
        }

        browser.storage.local.get(["connect", "wallet"]).then(handleGetPubkey)

        break

      case "sign":
        data && handleRequest("sign")
        break

      case "post":
        data && handleRequest("post")
        break

      case "switch-network":
        data && handleRequest("switchNetwork")
        break
    }
  })
}

function setupEvents() {
  const createEvent = (changes, namespace) => {
    if (namespace === "local") {
      if (
        changes.wallet &&
        (changes.wallet.oldValue.address !== changes.wallet.newValue.address ||
          changes.wallet.oldValue.name !== changes.wallet.newValue.name ||
          Object.values(changes.wallet.oldValue.pubkey || {}).join(",") !==
            Object.values(changes.wallet.newValue.pubkey || {}).join(","))
      ) {
        const event = new CustomEvent("station_wallet_change", {
          detail: changes.wallet.newValue,
        })
        window.dispatchEvent(event)

        browser.storage.local.get(["replaceKeplr"]).then(({ replaceKeplr }) => {
          replaceKeplr &&
            window.dispatchEvent(new CustomEvent("keplr_keystorechange"))
        })
      }
      if (changes.theme) {
        const event = new CustomEvent("station_theme_change", {
          detail: changes.theme.newValue,
        })
        window.dispatchEvent(event)
      }
      if (
        changes.networkName &&
        changes.networkName.oldValue !== changes.networkName.newValue
      ) {
        const event = new CustomEvent("station_network_change", {
          detail: changes.networks.newValue,
        })
        window.dispatchEvent(event)
      }
    }
  }

  browser.storage.local.get(["connect"]).then(({ connect }) => {
    const isAllowed = ((connect && connect.allowed) || []).includes(
      window.location.origin
    )

    // if replaceKeplr changed, refresh the page
    browser.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === "local") {
        // if replaceKeplr changed, refresh the page
        if (changes.replaceKeplr) {
          console.warn(
            "🛰️ STATION: Reloading window to set Station Extension as the default wallet."
          )
          window.location.reload()
        }
      }
    })

    if (isAllowed) {
      browser.storage.onChanged.addListener(createEvent)
    } else {
      browser.storage.onChanged.addListener(function reset(changes, namespace) {
        if (namespace === "local" && changes.connect) {
          browser.storage.onChanged.removeListener(reset)
          browser.storage.onChanged.removeListener(createEvent)
          setupEvents()
        }
      })
    }
  })
}

/**
 * Sets up the stream communication and submits site metadata
 *
 */
async function start() {
  await setupStreams()
  await domIsReady()
}

/**
 * Determines if the provider should be injected
 *
 * @returns {boolean} {@code true} - if the provider should be injected
 */
function shouldInjectProvider() {
  return doctypeCheck() && suffixCheck() && documentElementCheck()
}

/**
 * Checks the doctype of the current document if it exists
 *
 * @returns {boolean} {@code true} - if the doctype is html or if none exists
 */
function doctypeCheck() {
  const { doctype } = window.document
  if (doctype) {
    return doctype.name === "html"
  }
  return true
}

/**
 * Returns whether or not the extension (suffix) of the current document is prohibited
 *
 * This checks {@code window.location.pathname} against a set of file extensions
 * that we should not inject the provider into. This check is indifferent of
 * query parameters in the location.
 *
 * @returns {boolean} - whether or not the extension of the current document is prohibited
 */
function suffixCheck() {
  const prohibitedTypes = [/\.xml$/, /\.pdf$/]
  const currentUrl = window.location.pathname
  for (let i = 0; i < prohibitedTypes.length; i += 1) {
    if (prohibitedTypes[i].test(currentUrl)) {
      return false
    }
  }
  return true
}

/**
 * Checks the documentElement of the current document
 *
 * @returns {boolean} {@code true} - if the documentElement is an html node or if none exists
 */
function documentElementCheck() {
  const documentElement = document.documentElement.nodeName
  if (documentElement) {
    return documentElement.toLowerCase() === "html"
  }
  return true
}

/**
 * Sets up two-way communication streams between the
 * browser extension and local per-page browser context.
 */
async function setupStreams() {
  const pageStream = new PostMessageStream({
    name: "station:content",
    target: "station:inpage",
  })

  const extensionPort = browser.runtime.connect({
    name: "TerraStationExtension",
  })

  const extensionStream = new PortStream(extensionPort)

  extensionStream.pipe(pageStream)
  pageStream.pipe(extensionStream)
}

/**
 * Returns a promise that resolves when the DOM is loaded (does not wait for images to load)
 */
function domIsReady() {
  // already loaded
  if (["interactive", "complete"].includes(document.readyState)) {
    return Promise.resolve()
  }

  // wait for load
  return new Promise((resolve) =>
    window.addEventListener("DOMContentLoaded", resolve, { once: true })
  )
}

function openPopup() {
  browser.runtime.sendMessage("OPEN_POPUP")
}

function closePopup() {
  browser.runtime.sendMessage("CLOSE_POPUP")
}
