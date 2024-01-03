import Station from "@terra-money/station-connector"

function injectKeplr() {
  const station = new Station()

  try {
    Object.defineProperty(window, "getOfflineSigner", {
      value: station.getOfflineSigner,
      writable: false,
    })

    Object.defineProperty(window, "getOfflineSignerOnlyAmino", {
      value: station.getOfflineSigner,
      writable: false,
    })

    Object.defineProperty(window, "getOfflineSignerAuto", {
      value: async (chainID) => station.getOfflineSigner(chainID),
      writable: false,
    })

    Object.defineProperty(window, "keplr", {
      value: station.keplr,
      writable: false,
    })
  } catch (e) {
    // another wallet has already set one of the previous proprety as read-only
    console.error(
      "🛰️ STATION: Unable to set Station Extension as the default wallet."
    )
  }
}

injectKeplr()

if (!document.readyState === "complete") {
  document.addEventListener(
    "readystatechange",
    function documentStateChange(event) {
      if (event.target && event.target.readyState === "complete") {
        injectKeplr()
        document.removeEventListener("readystatechange", documentStateChange)
      }
    }
  )
}
