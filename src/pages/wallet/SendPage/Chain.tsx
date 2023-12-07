import { useMemo } from "react"
import { useSend } from "./SendContext"
import { convertAddress } from "utils/chain"
import { useNetwork } from "data/wallet"
import { getChainNamefromID } from "data/queries/chains"
import { SearchChains } from "../ReceivePage"
import { addressFromWords } from "utils/bech32"
import { useAuth } from "auth"

const Chain = () => {
  const { form, goToStep, balances } = useSend()
  const { setValue } = form
  const networks = useNetwork()
  const { recipient } = form.watch()
  const { wallets } = useAuth()
  const wallet = wallets.find((w) => w.name === walletName)

  const availableChains = useMemo(() => {
    const chainsSet = new Set()
    balances.map((b) => chainsSet.add(b.chain))
    return Array.from(chainsSet) as string[]
  }, [balances])

  const chains = useMemo(
    () =>
      availableChains
        .map((chain) => {
          // only show chaisn where cointype available
          if (!("words" in wallet)) return null
          const address = addressFromWords(
            wallet.words[networks[chain]?.coinType],
            networks[chain]?.prefix
          )
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
        .filter(Boolean),
    [availableChains, networks, recipient, setValue, goToStep]
  )
  return <SearchChains data={chains} />
}
export default Chain
