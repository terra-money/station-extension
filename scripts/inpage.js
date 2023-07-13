// legacy terra webapps
window.isTerraExtensionAvailable = true
// new inetchain webapps
window.isStationExtensionAvailable = true

// ---------------------------------------------
// for multiple extension support
// ---------------------------------------------
const STATION_INFO = {
  name: "Station Wallet",
  identifier: "station",
  icon: "https://assets.terra.money/icon/station-extension/icon.png",
}

if (
  typeof window.terraWallets !== "undefined" &&
  Array.isArray(window.terraWallets)
) {
  window.terraWallets.push(STATION_INFO)
} else {
  window.terraWallets = [STATION_INFO]
}

if (
  typeof window.interchainWallets !== "undefined" &&
  Array.isArray(window.interchainWallets)
) {
  window.interchainWallets.push(STATION_INFO)
} else {
  window.interchainWallets = [STATION_INFO]
}

class Station {
  constructor() {
    this._pendingRequests = {}

    const origin = window.location.origin

    window.addEventListener("message", (event) => {
      if (event.origin !== origin) return

      const reqID = event.data && event.data.uuid
      if (!reqID || !this._pendingRequests[reqID]) return

      const { sender, success, data } = event.data
      if (sender !== "station") return

      success
        ? this._pendingRequests[reqID].resolve(data)
        : this._pendingRequests[reqID].reject(data)
      delete this._pendingRequests[reqID]
    })
  }

  _sendMessage(content, uuid) {
    window.postMessage(
      {
        ...content,
        sender: "web",
        uuid,
      },
      window.location.origin
    )
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage({ type: "connect" }, reqID)
      this._pendingRequests[reqID] = { resolve, reject }
    })
  }
}

window.station = new Station()
