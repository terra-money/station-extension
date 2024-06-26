import { AccAddress } from "@terra-money/feather.js"
import { ChainID } from "types/network"

export const isTerraChain = (chainID: ChainID) => {
  return chainID?.startsWith("phoenix-") || chainID?.startsWith("pisco-")
}

export const isNativeToken = (denom: string) =>
  !denom.startsWith("ibc/") &&
  !denom.startsWith("factory/") &&
  !denom.startsWith("gamm/") &&
  !AccAddress.validate(denom)

// Sort tokens by Terra first, then by symbol alphabetically
export const sortTokens = (list: any[]) => {
  return list.sort((a, b) => {
    const isTerraA = isTerraChain(a.chainID)
    const isTerraB = isTerraChain(b.chainID)

    if (isTerraA && isTerraB) return a.symbol.localeCompare(b.symbol)
    if (isTerraA && !isTerraB) return -1
    if (!isTerraA && isTerraB) return 1

    // Neither are Terra assets, sort by chain first then asset name
    if (a.chainID !== b.chainID) {
      return a.chainID?.localeCompare(b.chainID)
    } else {
      return a.symbol?.localeCompare(b.symbol)
    }
  })
}
