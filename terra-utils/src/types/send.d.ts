import type { Coin } from "@terra-money/feather.js"

export interface AddressWithChain {
  address: string
  chainId: string
}

export interface SendTokensArgs {
  senderAddress: AddressWithChain
  recipientAddress: AddressWithChain
  amount: Coin
}
