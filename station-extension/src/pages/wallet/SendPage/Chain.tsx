import { useMemo } from "react"
import { useSend } from "./SendContext"
import { convertAddress } from "utils/chain"
import { useNetwork } from "data/wallet"
import { getChainNamefromID } from "data/queries/chains"
import { SearchChains } from "../ReceivePage"

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

  const chains = useMemo(
    () =>
      availableChains.map((chain) => {
        const address = convertAddress(recipient ?? "", networks[chain]?.prefix)
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
      }),
    [availableChains, networks, recipient, setValue, goToStep]
  )
  return <SearchChains data={chains} />
}
export default Chain
