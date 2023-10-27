import { useTranslation } from "react-i18next"
import { useAddressBook } from "data/settings/AddressBook"
import { getChainIdFromAddress } from "data/queries/chains"
import { Grid, SectionHeader, WalletButton } from "station-ui"
import { useNetwork } from "data/wallet"
import { truncate } from "@terra-money/terra-utils"
import { useAuth } from "auth"
import { getWallet } from "auth/scripts/keystore"
import { addressFromWords } from "utils/bech32"

interface Props {
  onClick?: (address: string) => void
  tab: string
}

export const WalletList = ({
  items,
  title,
  onClick,
}: {
  items: AddressBook[]
  title: string
  onClick?: (address: string) => void
}) => {
  const network = useNetwork()
  if (!items.length) return null
  return (
    <Grid gap={10}>
      <SectionHeader withLine title={title} />
      {items.map((w) => (
        <WalletButton
          key={w.name}
          walletName={w.name}
          walletAddress={truncate(w.recipient)}
          chainIcon={network[getChainIdFromAddress(w.recipient, network)].icon}
          onClick={() => onClick?.(w.recipient)}
        />
      ))}
    </Grid>
  )
}

const OtherWallets = ({ tab, onClick }: Props) => {
  const { list: addressList } = useAddressBook()
  const { wallets } = useAuth()
  const myWallets = wallets.map((wallet) => {
    const { words } = getWallet(wallet.name)
    return {
      name: wallet.name,
      recipient: addressFromWords(words["330"]),
    }
  })

  return (
    <>
      {tab === "address" ? (
        <>
          <WalletList
            onClick={onClick}
            title="Favorites"
            items={addressList.filter((i) => i.favorite)}
          />
          <WalletList
            title="All"
            onClick={onClick}
            items={addressList.filter((i) => !i.favorite)}
          />
        </>
      ) : (
        <WalletList title="" onClick={onClick} items={myWallets} />
      )}
    </>
  )
}

export default OtherWallets
