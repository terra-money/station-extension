import { AccAddress } from "@terra-money/feather.js"
import { bech32 } from "bech32"

export const isTerraChain = (chainID: string) => {
  return chainID.startsWith("phoenix-") || chainID.startsWith("pisco-")
}

export const isNativeToken = (denom: string) =>
  !denom.startsWith("ibc/") &&
  !denom.startsWith("factory/") &&
  !denom.startsWith("gamm/") &&
  !AccAddress.validate(denom)

export const convertAddress = (address: AccAddress, newPrefix: string) => {
  let decodedAddress
  try {
    decodedAddress = bech32.decode(address)
  } catch (error) {
    throw new Error("Provided address is not a valid Bech32 address.")
  }
  return bech32.encode(newPrefix, decodedAddress.words)
}
