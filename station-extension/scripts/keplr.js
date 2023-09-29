import Station from "@terra-money/station-connector"

function injectKeplr() {
  window.station = new Station()

  window.getOfflineSigner = window.station.getOfflineSigner

  window.getOfflineSignerOnlyAmino = window.station.getOfflineSigner

  window.getOfflineSignerAuto = async (chainID) =>
    window.station.getOfflineSigner(chainID)

  window.keplr = window.station.keplr
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
