/* query */
export const LAZY_LIMIT = 999

/* connection */
export const BRIDGE = "https://walletconnect.terra.dev"

/* api */
export const ASSETS = "https://assets.terra.dev"
export const STATION_ASSETS = "https://assets.station.money"
export const OBSERVER = "wss://observer.terra.dev"

/* website */
export const STATION = "https://station.money"
export const EXTENSION =
  "https://chrome.google.com/webstore/detail/aiifbnbfobpmeekipheeijimdpnlpgpp"
export const DOCUMENTATION =
  "https://docs-terra.pages.dev/learn/terra-station/Download/terra-station-desktop.html"
export const SETUP = "https://setup.station.money/"
export const CARBON_API = "https://api.carbon.network/"

/* website: fiat ramp */
export const FIAT_RAMP = "https://app.kado.money/"
export const KADO_API_KEY = "c22391a1-594f-4354-a742-187adb1b91bf"

/* website: stake */
export const TERRA_VALIDATORS =
  "https://github.com/terra-money/validator-profiles/tree/master/validators/"
export const STAKE_ID = "https://stake.id/#/validator/"

/* ledger */
export const LEDGER_TRANSPORT_TIMEOUT = 180000

/* tx */
export const DEFAULT_GAS_ADJUSTMENT = 1
export const OSMOSIS_GAS_ENDPOINT = "osmosis/txfees/v1beta1/cur_eip_base_fee"

/* swap */
export const TERRASWAP_COMMISSION_RATE = 0.003

/* placeholder */
// https://github.com/terra-money/localterra
export const SAMPLE_ADDRESS = "terra1x46rqay4d3cssq8gxxvqz8xt6nwlz4td20k38v"

export const CURRENCY_KEY = "e484bb7eb1a1cb1471fd5ee925e9b1bc"

export const VALIDATION_TIMEOUT = 3_000

export const SQUID_SWAP_API = {
  integrationID: "station-wallet-api",
  baseUrl: "https://v2.api.squidrouter.com/v2",
  routes: {
    chains: "/chains",
    tokens: "/tokens",
  },
}
export const SKIP_SWAP_API = {
  baseUrl: "https://api.skip.money/v1",
  routes: {
    route: "/fungible/route",
    tokens: "/fungible/assets",
    msgs: "/fungible/msgs",
  },
}
