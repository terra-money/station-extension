import { useConnectedWallet } from "@terra-money/use-wallet"
import { bech32 } from "bech32"
import useAuth from "./useAuth"
import { useNetwork } from "./useNetwork"

const useAddress = () => {
  const { wallet } = useAuth()
  return wallet?.address
}

export const useInterchainAddresses = () => {
  const connected = useConnectedWallet()
  const { wallet } = useAuth()
  const network = useNetwork()

  const address = wallet?.address ?? connected?.terraAddress
  if (!address) return
  const { words } = bech32.decode(address)

  const addresses = Object.values(network).reduce(
    (acc, { prefix, chainID }) => {
      acc[chainID] = bech32.encode(prefix, words)
      return acc
    },
    {} as Record<string, string>
  )

  return addresses
}

export default useAddress
