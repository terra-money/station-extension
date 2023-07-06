import { useConnectedWallet } from "@terra-money/use-wallet"
import { useNetworks } from "app/InitNetworks"
import { addressFromWords } from "utils/bech32"
import useAuth from "./useAuth"
import { useChainID, useNetworkName } from "./useNetwork"
import { useNetwork } from "data/wallet"

/* auth | walle-provider */
const useAddress = () => {
  const connected = useConnectedWallet()
  const { wallet } = useAuth()
  const chainID = useChainID()
  if (connected?.addresses[chainID]) {
    return connected?.addresses[chainID]
  }
  return wallet?.words?.["330"]
    ? addressFromWords(wallet.words["330"])
    : undefined
}

export const useAllInterchainAddresses = () => {
  const connected = useConnectedWallet()
  const { wallet } = useAuth()
  const { networks } = useNetworks()
  const networkName = useNetworkName()

  if (connected?.addresses) return connected.addresses

  const words = wallet?.words
  if (!words) return

  const addresses = Object.values(networks[networkName] ?? {})
    .filter(({ coinType }) => !!words[coinType])
    .reduce((acc, { prefix, coinType, chainID }) => {
      acc[chainID] = addressFromWords(words[coinType] as string, prefix)
      return acc
    }, {} as Record<string, string>)
  return addresses
}

export const useInterchainAddresses = () => {
  const connected = useConnectedWallet()
  const { filterEnabledNetworks } = useNetworks()
  const { wallet } = useAuth()
  const networks = useNetwork()

  if (connected?.addresses) {
    return filterEnabledNetworks(connected.addresses)
  }

  const words = wallet?.words
  if (!words) return

  const addresses = Object.values(networks ?? {}).reduce(
    (acc, { prefix, coinType, chainID }) => {
      acc[chainID] = addressFromWords(words[coinType] as string, prefix)
      return acc
    },
    {} as Record<string, string>
  )
  return addresses
}

export const usePubkey = () => {
  const { wallet } = useAuth()
  return wallet?.pubkey
}

export default useAddress
