import { useNetworks } from "app/InitNetworks"
import { addressFromWords } from "utils/bech32"
import useAuth from "./useAuth"
import { useNetworkName } from "./useNetwork"
import { useNetwork } from "data/wallet"
import { useAddressBook } from "data/settings/AddressBook"
import { AccAddress } from "@terra-money/feather.js"
import { convertAddress } from "utils/chain"
import { truncate } from "@terra-money/terra-utils"

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

export const useGetLocalWalletName = () => {
  const { wallets } = useAuth()
  return (address: AccAddress) => {
    const terraAddress = convertAddress(address, "terra")
    const wallet = wallets.find((w) =>
      "words" in w ? addressFromWords(w.words["330"]) === terraAddress : null
    )
    return wallet?.name
  }
}
export const useGetWalletName = () => {
  const { list } = useAddressBook()
  const getLocalWalletName = useGetLocalWalletName()

  return (address: AccAddress) => {
    const terraAddress = convertAddress(address, "terra")
    const localWalletName = getLocalWalletName(address)

    const entry = list.find(
      (l) => convertAddress(l.recipient, "terra") === terraAddress
    )
    const name = entry?.name ?? localWalletName ?? truncate(address, [11, 6])
    return name
  }
}

export default useAddress
