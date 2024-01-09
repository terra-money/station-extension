import { TokenSingleChainListItemProps } from "@terra-money/station-ui"
import { AccAddress } from "@terra-money/feather.js"

export interface AssetType extends TokenSingleChainListItemProps {
  balVal: string
  balance: string
  decimals: number
  amount: string
  denom: string
  tokenChain: string
  price?: number
  channel?: string
  senderAddress: AccAddress
  id: string
}

export interface TxValues {
  asset?: string
  chain?: string
  destination?: string
  recipient?: string // AccAddress | TNS
  address?: AccAddress // hidden input
  input?: number
  memo?: string
  decimals?: number
  assetInfo?: AssetType
  currencyAmount?: number
  ibcWarning?: boolean
}
