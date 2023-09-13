import { useNetworks } from "app/InitNetworks"
import { addressFromWords } from "utils/bech32"
import useAuth from "./useAuth"
import { useNetworkName } from "./useNetwork"
import { useNetwork } from "data/wallet"

/* auth | walle-provider */
const useAddress = () => {
  const { wallet } = useAuth()

  return wallet?.words?.["330"]
    ? addressFromWords(wallet.words["330"])
    : undefined
}

export const useAllInterchainAddresses = () => {
  const { wallet } = useAuth()
  const { networks } = useNetworks()
  const networkName = useNetworkName()

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
  const { wallet } = useAuth()
  const networks = useNetwork()

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
