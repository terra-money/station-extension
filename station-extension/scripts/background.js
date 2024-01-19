import PortStream from "extension-port-stream"
import browser from "webextension-polyfill"

const connectRemote = (remotePort) => {
  if (remotePort.name !== "TerraStationExtension") {
    return
  }

  const origin = remotePort.sender.origin || remotePort.sender.url

  console.log("Station(background): connectRemote", remotePort)
  const portStream = new PortStream(remotePort)

  const sendResponse = (name, payload) => {
    portStream.write({ name, payload })
  }

  portStream.on("data", (data) => {
    console.log("Station(background): portStream.on", data)
    const { type, ...payload } = data

    /* handle sign & post */
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

            changed &&
              changed.origin === origin &&
              sendResponse("on" + capitalize(key), changed)

            if (changed.uuid) {
              browser.storage.local.set(
                key,
                newValue.filter((tx) => tx.uuid !== changed.uuid)
              )
            } else {
              browser.storage.local.set(
                key,
                newValue.filter((tx) => tx.id !== changed.id)
              )
            }

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
            (req) => req.id === payload.id && req.origin === origin
          ) !== -1

        !alreadyRequested &&
          browser.storage.local.set({
            [key]: payload.purgeQueue
              ? [{ ...payload, origin }]
              : [...list, { ...payload, origin }],
          })

        openPopup()
        browser.storage.onChanged.addListener(handleChange)
      }

      browser.storage.local.get([key]).then(handleGet)
    }

    switch (type) {
      case "info":
        browser.storage.local.get(["network"]).then(({ network }) => {
          sendResponse("onInfo", network)
        })
        break

      case "interchain-info":
        browser.storage.local.get(["networks"]).then(({ networks }) => {
          sendResponse("onInterchainInfo", networks)
        })
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

            if (!denied)
              browser.storage.local
                .get(["connect", "wallet"])
                .then(handleGetConnect)
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
            sendResponse("onConnect", wallet)
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
                  sendResponse("onGetPubkey", null)
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
            sendResponse("onGetPubkey", wallet)
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

      case "suggestChain":
        handleRequest("suggestChain")
        break

      case "sign":
        handleRequest("sign")
        break

      case "post":
        handleRequest("post")
        break

      default:
        break
    }
  })
}

browser.runtime.onConnect.addListener(connectRemote)

// popup requests from contentScript
browser.runtime.onMessage.addListener(function (request, sender) {
  if (!sender.tab) return

  switch (request) {
    case "OPEN_POPUP":
      openPopup()
      break
    case "CLOSE_POPUP":
      closePopup()
      break
  }
})

/* popup */
let tabId = undefined
let isPopupOpen = false
browser.tabs.onRemoved.addListener(() => {
  tabId = undefined
  isPopupOpen = false
  // reject transaction and connect requests
  browser.storage.local
    .get(["sign", "post", "connect"])
    .then(({ sign = [], post = [], connect = { request: [] } }) => {
      browser.storage.local.set({
        sign: sign.map((s) =>
          typeof success !== "boolean"
            ? {
                ...s,
                success: false,
                error: "User denied, extension popup was closed.",
              }
            : s
        ),
        post: post.map((s) =>
          typeof success !== "boolean"
            ? {
                ...s,
                success: false,
                error: "User denied, extension popup was closed.",
              }
            : s
        ),
        connect: {
          ...connect,
          request: [],
        },
      })
    })
})

const POPUP_WIDTH = 400
const POPUP_HEIGHT = 632 // Chrome extension maximum height

const getCenter = (window) => {
  return {
    top: Math.floor(window.height / 2 - POPUP_HEIGHT / 2),
    left: Math.floor(window.width / 2 - POPUP_WIDTH / 2),
  }
}

const openPopup = () => {
  const popup = {
    type: "popup",
    focused: true,
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
  }
  if (!isPopupOpen && !tabId) {
    isPopupOpen = true

    browser.tabs
      .create({ url: browser.runtime.getURL("index.html"), active: false })
      .then((tab) => {
        tabId = tab.id
        browser.windows.getCurrent().then((window) => {
          const center = getCenter(window)
          const top = Math.max(center.top, 0) || 0
          const left = Math.max(center.left, 0) || 0

          const config = { ...popup, tabId: tab.id, top, left }

          // type error here, it might cause problems
          browser.windows.create(config)
        })
      })
  }
}

const closePopup = () => {
  if (tabId) {
    isPopupOpen = false
    tabId && browser.tabs.remove(tabId)
  }
}

/* utils */
const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

// Invoke alarm periodically to keep service worker persistent
browser.alarms.create("keep-alive-alarm", {
  periodInMinutes: 0.25,
  delayInMinutes: 0.25,
})

browser.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "keep-alive-alarm") {
  }
})
