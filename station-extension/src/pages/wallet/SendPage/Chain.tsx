import { useSend } from "./SendContext"
import { useAllNetworks } from "data/wallet"
import { getChainNamefromID } from "data/queries/chains"
import { SearchChains } from "../ReceivePage"
import { addressFromWords } from "utils/bech32"
import { AccAddress } from "@terra-money/feather.js"
import { getWallet } from "auth/scripts/keystore"

const Chain = () => {
  const { form, goToStep } = useSend()
  const { setValue } = form
  const networks = useAllNetworks()
  const { recipient } = form.watch()
  const { words } = getWallet(recipient)

  const chains = Object.values(networks)
    .filter(({ coinType }) => !!words[coinType])
    .map(({ chainID, prefix, coinType }) => {
      const address = addressFromWords(words[coinType], prefix)

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

  return (
    <SearchChains
      data={chains.filter((item) => AccAddress.validate(item.address))}
    />
  )
}
export default Chain
