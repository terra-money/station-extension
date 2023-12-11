import { useAddressBook } from "data/settings/AddressBook"
import { getChainIdFromAddress } from "data/queries/chains"
import { ReactNode } from "react"
import { Grid, SectionHeader, WalletButton } from "@terra-money/station-ui"
import { useNetwork } from "data/wallet"
import { truncate } from "@terra-money/terra-utils"
import { useAuth } from "auth"
import { getWallet } from "auth/scripts/keystore"
import { addressFromWords } from "utils/bech32"
import { ReactComponent as FavoriteIcon } from "styles/images/icons/Favorite.svg"
import { ReactComponent as ActiveWalletIcon } from "styles/images/icons/ActiveWallet.svg"
import { useTranslation } from "react-i18next"

interface Props {
  onClick?: (address: string, index: number) => void
  tab: string
}

export const WalletButtonList = ({
  items,
  title,
  icon,
  onClick,
  variant = "primary",
}: {
  items: AddressBook[]
  title?: string
  icon?: ReactNode
  variant?: "primary" | "secondary"
  onClick?: (address: string, index: number) => void
}) => {
  const network = useNetwork()
  const { t } = useTranslation()
  if (!items.length) return null
  return (
    <Grid gap={8}>
      {title && <SectionHeader icon={icon} indented title={t(title)} />}
      {items.map((i, index) => (
        <WalletButton
          variant={variant}
          key={i.name + i.recipient}
          emoji={i.icon}
          walletName={i.name}
          walletAddress={truncate(i.recipient)}
          chainIcon={network[getChainIdFromAddress(i.recipient, network)]?.icon}
          onClick={() => onClick?.(i.recipient, index)}
        />
      ))}
    </Grid>
  )
}

const MyWallets = ({ tab, onClick }: Props) => {
  const { list: addressList } = useAddressBook()
  const { wallets, connectedWallet } = useAuth()

  const activeWallet = {
    name: connectedWallet?.name ?? "",
    recipient: addressFromWords(connectedWallet?.words["330"] ?? ""),
  }
  const otherWallets = wallets
    .map((wallet) => {
      const { words } = getWallet(wallet.name)
      return {
        name: wallet.name,
        recipient: addressFromWords(words["330"]),
      }
    })
    .filter((w) => w.name !== connectedWallet?.name)

  return (
    <>
      {tab === "address" ? (
        <>
          <WalletButtonList
            onClick={onClick}
            variant="secondary"
            title="Favorites"
            icon={<FavoriteIcon />}
            items={addressList.filter((i) => i.favorite)}
          />
          <WalletButtonList
            variant="secondary"
            title="All Addresses"
            onClick={onClick}
            items={addressList.filter((i) => !i.favorite)}
          />
        </>
      ) : (
        <>
          <WalletButtonList
            onClick={onClick}
            title="Active"
            icon={<ActiveWalletIcon />}
            items={[activeWallet]}
          />
          <WalletButtonList
            items={otherWallets}
            onClick={onClick}
            title="Other Wallets"
          />
        </>
      )}
    </>
  )
}

export default MyWallets
