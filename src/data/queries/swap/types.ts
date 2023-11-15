import { ChainID } from "types/network"

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
  offerInput: string
  askAsset: SwapAssetExtra
  fromAddress: string // get this from wallet
  route: RouteInfo | undefined
  msgs: any[] // TODO: typing
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
  balance: string
  value: number
  price: number
  chain: {
    name: string
    icon: string
  }
}

export type SwapVenue = "osmosis-poolmanager"
export type SwapOperation = any // TODO: typing

export interface RouteInfo {
  amountIn: string
  amountOut: string
  txsRequired: number
  swapVenue: SwapVenue
  operations: SwapOperation[]
  source: SupportedSource
  chainIds: ChainID[]
}
