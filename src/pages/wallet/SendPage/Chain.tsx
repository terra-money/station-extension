import { useSend } from "./SendContext"
import { useAllNetworks } from "data/wallet"
import { SearchChains } from "../ReceivePage"
import { addressFromWords } from "utils/bech32"
import { AccAddress } from "@terra-money/feather.js"
import { getWallet } from "auth/scripts/keystore"

const Chain = () => {
  const { form, goToStep } = useSend()
  const { setValue, watch } = form
  const networks = useAllNetworks()
  const { recipientWalletName } = watch()
  const wallet = getWallet(recipientWalletName)

  const chains = Object.values(networks)
    .filter((n) =>
      wallet.words?.[n.coinType] && wallet.multisig
        ? n.prefix === "terra"
        : true
    )
    .map(({ chainID, prefix, coinType }) => {
      const address = addressFromWords(wallet.words?.[coinType] ?? "", prefix)
      return {
        onClick: () => {
          setValue("destination", chainID)
          setValue("recipient", address)
          goToStep(3)
        },
        chainID,
        address,
      }
    })
    .filter((item) => AccAddress.validate(item.address))

  return <SearchChains data={chains} />
}
export default Chain
