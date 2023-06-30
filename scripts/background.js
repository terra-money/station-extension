import extension from "extensionizer"
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

            extension.storage.local.get(
              ["sign", "post"],
              ({ sign = [], post = [] }) => {
                const getRequest = ({ success }) => typeof success !== "boolean"
                const nextRequest =
                  sign.some(getRequest) || post.some(getRequest)

                !nextRequest && closePopup()
              }
            )
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
          extension.storage.local.set({
            [key]: payload.purgeQueue
              ? [{ ...payload, origin }]
              : [...list, { ...payload, origin }],
          })

        openPopup()
        extension.storage.onChanged.addListener(handleChange)
      }

      extension.storage.local.get([key], handleGet)
    }

    switch (type) {
      case "info":
        extension.storage.local.get(["network"], ({ network }) => {
          sendResponse("onInfo", network)
        })

        break

      case "interchain-info":
        extension.storage.local.get(["networks"], ({ networks }) => {
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
              oldValue.request.length - 1 === newValue.request.length &&
              oldValue.allowed.length === newValue.allowed.length

            if (!denied)
              extension.storage.local.get(
                ["connect", "wallet"],
                handleGetConnect
              )
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
          const isAllowed = connect.allowed.includes(origin)
          const walletExists = wallet.address
          const alreadyRequested = [
            ...connect.request,
            ...connect.allowed,
          ].includes(origin)

          if (isAllowed && walletExists) {
            sendResponse("onConnect", wallet)
            closePopup()
            extension.storage.onChanged.removeListener(handleChangeConnect)
          } else {
            !alreadyRequested &&
              extension.storage.local.set({
                connect: { ...connect, request: [origin, ...connect.request] },
              })

            openPopup()
            extension.storage.onChanged.addListener(handleChangeConnect)
          }
        }

        extension.storage.local.get(["connect", "wallet"], handleGetConnect)

        break

      case "get-pubkey":
        const handleChangePubkey = (changes, namespace) => {
          // It is recursive.
          // After referring to a specific value in the storage, perform the function listed below again.
          if (namespace === "local" && (changes.wallet || changes.pubkey)) {
            const hasPubKey = changes.wallet && changes.wallet.newValue.pubkey

            if (hasPubKey) {
              extension.storage.local.get(
                ["connect", "wallet"],
                handleGetPubkey
              )
            } else {
              extension.storage.local.get(["pubkey"], ({ pubkey }) => {
                // pubkey terminated
                if (!pubkey) {
                  sendResponse("onGetPubkey", null)
                  closePopup()
                  extension.storage.onChanged.removeListener(handleChangePubkey)
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
          const isAllowed = connect.allowed.includes(origin)
          const hasPubKey = wallet.pubkey

          if (isAllowed && hasPubKey) {
            sendResponse("onGetPubkey", wallet)
            closePopup()
            extension.storage.onChanged.removeListener(handleChangePubkey)
          } else {
            extension.storage.local.set({
              pubkey: origin,
            })

            openPopup()
            extension.storage.onChanged.addListener(handleChangePubkey)
          }
        }

        extension.storage.local.get(["connect", "wallet"], handleGetPubkey)

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

extension.runtime.onConnect.addListener(connectRemote)

/* popup */
// TODO: Actions such as transaction rejection if user closes a popup
let tabId = undefined
extension.tabs.onRemoved.addListener(() => (tabId = undefined))

const POPUP_WIDTH = 480
const POPUP_HEIGHT = 600 // Chrome extension maximum height

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
  !tabId &&
    extension.tabs.create(
      { url: extension.runtime.getURL("index.html"), active: false },
      (tab) => {
        tabId = tab.id
        extension.windows.getCurrent((window) => {
          const center = getCenter(window)
          const top = Math.max(center.top, 0) || 0
          const left = Math.max(center.left, 0) || 0

          const config = { ...popup, tabId: tab.id, top, left }
          extension.windows.create(config)
        })
      }
    )
}

const closePopup = () => {
  tabId && extension.tabs.remove(tabId)
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
