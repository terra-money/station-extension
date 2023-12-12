import { useMemo } from "react"
import { useSend } from "./SendContext"
import { useNetwork } from "data/wallet"
import { getChainNamefromID } from "data/queries/chains"
import { SearchChains } from "../ReceivePage"
import { addressFromWords } from "utils/bech32"
import { AccAddress } from "@terra-money/feather.js"
import { getWallet } from "auth/scripts/keystore"

const Chain = () => {
  const { form, goToStep, balances } = useSend()
  const { setValue } = form
  const networks = useNetwork()
  const { recipient } = form.watch()

  const availableChains = useMemo(() => {
    const chainsSet = new Set()
    balances.map((b) => chainsSet.add(b.chain))
    return Array.from(chainsSet) as string[]
  }, [balances])

  const chains = useMemo(() => {
    const { words } = getWallet(recipient)
    return availableChains.map((chain) => {
      const { coinType, prefix } = networks[chain]
      const address = addressFromWords(words[coinType], prefix)
      const name = getChainNamefromID(chain, networks) ?? chain
      return {
        name,
        onClick: () => {
          setValue("destination", chain)
          setValue("recipient", address)
          goToStep(3)
        },
        id: chain,
        address,
      }
    })
  }, [availableChains, networks, recipient, setValue, goToStep])
  return (
    <SearchChains
      data={chains.filter((item) => AccAddress.validate(item.address))}
    />
  )
}
export default Chain
