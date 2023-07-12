import extension from "extensionizer"
import PortStream from "extension-port-stream"
import LocalMessageDuplexStream from "post-message-stream"

if (shouldInjectProvider()) {
  checkWebpage()
  injectScript()
  setupEvents()
  start()
}

/**
 * Check if the current webpage is a known scam
 *
 */
function checkWebpage() {
  extension.storage.local.get(["blacklist"], async ({ blacklist }) => {
    const WARNING_PAGE = `https://scam-warning.terra.money/`

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
      const BLACKLIST_URL = "https://assets.terra.money/blacklist.json"
      const response = await fetch(BLACKLIST_URL)
      const list = await response.json()
      checkAndRedirect(list)

      extension.storage.local.set({
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
    // FIXME (Ian Lee) <script async="false"> is useless. both async="false" and async="true" operate in async="true"
    //  by removing async attribute, the `inpage.js` will be complated before DOM loading.
    //scriptTag.setAttribute('async', 'false')
    scriptTag.setAttribute("src", extension.runtime.getURL("inpage.js"))
    container.insertBefore(scriptTag, container.children[0])
    container.removeChild(scriptTag)
  } catch (e) {
    console.error("MsgDemo provider injection failed.", e)
  }
}

function setupEvents() {
  const createEvent = (changes, namespace) => {
    if (namespace === "local") {
      if (
        changes.wallet &&
        (changes.wallet.oldValue.address !== changes.wallet.newValue.address ||
          changes.wallet.oldValue.name !== changes.wallet.newValue.name ||
          Object.values(changes.wallet.oldValue.pubkey).join(",") !==
            Object.values(changes.wallet.newValue.pubkey).join(","))
      ) {
        const event = new CustomEvent("station_wallet_change", {
          detail: changes.wallet.newValue,
        })
        window.dispatchEvent(event)
      }
      if (
        changes.wallet &&
        changes.wallet.oldValue.theme !== changes.wallet.newValue.theme
      ) {
        const event = new CustomEvent("station_theme_change", {
          detail: changes.wallet.newValue.theme,
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

  extension.storage.local.get(["connect"], ({ connect }) => {
    const isAllowed = ((connect && connect.allowed) || []).includes(
      window.location.origin
    )

    if (isAllowed) {
      extension.storage.onChanged.addListener(createEvent)
    } else {
      extension.storage.onChanged.addListener(function reset(
        changes,
        namespace
      ) {
        if (namespace === "local" && changes.connect) {
          extension.storage.onChanged.removeListener(reset)
          extension.storage.onChanged.removeListener(createEvent)
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
  const pageStream = new LocalMessageDuplexStream({
    name: "station:content",
    target: "station:inpage",
  })

  const extensionPort = extension.runtime.connect({
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
