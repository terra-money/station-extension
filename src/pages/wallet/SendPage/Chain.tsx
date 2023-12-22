import { useMemo } from "react"
import { useSend } from "./SendContext"
import { useNetwork } from "data/wallet"
import { getChainNamefromID } from "data/queries/chains"
import { SearchChains } from "../ReceivePage"
import { addressFromWords } from "utils/bech32"
import { AccAddress } from "@terra-money/feather.js"
import { getWallet } from "auth/scripts/keystore"

const Chain = () => {
  const { form, goToStep } = useSend()
  const { setValue } = form
  const networks = useNetwork()
  const { recipient } = form.watch()
  const { words } = getWallet(recipient)

  const chains = useMemo(() => {
    return Object.values(networks).map(({ chainID }) => {
      const address = addressFromWords(
        words[networks[chainID]?.coinType ?? "330"],
        networks[chainID]?.prefix
      )
      return {
        name: getChainNamefromID(chainID, networks) ?? chainID,
        onClick: () => {
          setValue("destination", chainID)
          setValue("recipient", address)
          goToStep(3)
        },
        id: chainID,
        address,
      }
    })
  }, [networks, words, setValue, goToStep])
  return (
    <SearchChains
      data={chains.filter((item) => AccAddress.validate(item.address))}
    />
  )
}
export default Chain
