// 1. build proto interface for swap and assets
// 2. create interface for swap state
//    2a. fed to route
//    2b. squid route input params
//    2c. skip route input params
// 3. create interface for assets
//  3a. what squid gives
//  3b. what skip gives
// 4. handle route selection
// 5. handle route/swap execution

export interface SkipTokenResponse {
  denom: string
  chain_id: string
  origin_denom: string
  origin_chain_id: string
  trace: string
  is_cw20: boolean
  is_evm: boolean
  symbol: string
  name: string
  logo_uri: string
  decimals: number
}

export enum SwapSource {
  SQUID = "squid",
  SKIP = "skip",
}

export type SupportedSource = SwapSource.SKIP | SwapSource.SQUID

export interface SwapState {
  offerAsset: SwapAssetExtra
  offerAmount: number
  askAsset: SwapAssetExtra
  fromAddress: string // get this from wallet
}

export interface RouteParams {
  slippage?: number
}

export interface SwapAssetBase {
  symbol: string // human readable name axlUSDC
  denom: string // denom axlusdc or IBC/asdfasdfadsfawe
  originDenom: string // denom on home chain
  decimals: number // exponent / etc
  icon?: string // url of icon
  chainId: string // chain id
}

export interface SwapAssetExtra extends SwapAssetBase {
  balance: number
  value: number
  price: number
  chain: {
    name: string
    icon: string
  }
}
