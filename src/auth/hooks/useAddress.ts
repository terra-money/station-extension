import { useConnectedWallet } from "@terra-money/use-wallet"
import { addressFromWords } from "utils/bech32"
import useAuth from "./useAuth"
import { useNetwork } from "./useNetwork"

const useAddress = () => {
  const { wallet } = useAuth()
  if (!wallet?.words?.["330"]) return
  return addressFromWords(wallet.words["330"])
}

export const useInterchainAddresses = () => {
  const connected = useConnectedWallet()
  const { wallet } = useAuth()
  const network = useNetwork()

  if (connected?.addresses) {
    //return connected.addresses
  }

  const words = wallet?.words
  if (!words) return

  const addresses = Object.values(network).reduce(
    (acc, { prefix, coinType, chainID }) => {
      acc[chainID] = addressFromWords(words[coinType] as string, prefix)
      return acc
    },
    {} as Record<string, string>
  )
  return addresses
}

export default useAddress
