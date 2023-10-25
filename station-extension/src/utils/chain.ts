import { AccAddress } from "@terra-money/feather.js"

export const isTerraChain = (chainID: string) => {
  return chainID.startsWith("phoenix-") || chainID.startsWith("pisco-")
}

export const isNativeToken = (denom: string) =>
  !denom.startsWith("ibc/") &&
  !denom.startsWith("factory/") &&
  !denom.startsWith("gamm/") &&
  !AccAddress.validate(denom)
