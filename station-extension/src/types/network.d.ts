import { AccAddress } from "@terra-money/feather.js"

type NetworkName = string
type ChainID = string
type WalletName = string
type InterchainNetworks = Record<
  NetworkName,
  Record<ChainID, InterchainNetwork>
>

type InterchainAddresses = Record<ChainID, AccAddress>

type IBCChannel = string

interface InterchainNetwork {
  chainID: ChainID
  lcd: string
  gasAdjustment: number
  gasPrices: Record<string, number>
  prefix: string
  baseAsset: string
  name: string
  icon: string
  coinType: "118" | "330"
  alliance?: boolean
  channels?: Record<ChainID, IBCChannel>
  icsChannels?: Record<
    ChainID,
    {
      contract: AccAddress
      channel: IBCChannel
      otherChannel: IBCChannel
    }
  >
  ics20Channels?: Record<
    ChainID,
    {
      contract: AccAddress
      channel: IBCChannel
      otherChannel: IBCChannel
      // contract adress of tokens that can be sent through this channel
      // if it does not exists, all tokens can be transfered
      tokens?: AccAddress[]
    }[]
  >
  version?: string
  isClassic?: boolean
  isCustom?: boolean
  explorer?: {
    address?: string
    tx?: string
    validator?: string
    block?: string
  }
}

interface TerraNetwork {
  name: NetworkName
  chainID: string
  lcd: string
  api?: string
}

type CustomNetworks = Record<NetworkName, CustomNetwork>

interface CustomNetwork extends TerraNetwork {
  preconfigure?: boolean
}
