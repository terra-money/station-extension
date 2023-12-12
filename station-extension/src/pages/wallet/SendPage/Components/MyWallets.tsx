import { useAddressBook } from "data/settings/AddressBook"
import { getChainIdFromAddress } from "data/queries/chains"
import { ReactNode } from "react"
import { Grid, SectionHeader, WalletButton } from "@terra-money/station-ui"
import { useNetwork } from "data/wallet"
import { truncate } from "@terra-money/terra-utils"
import { useAuth } from "auth"
import { ReactComponent as FavoriteIcon } from "styles/images/icons/Favorite.svg"
import { ReactComponent as ActiveWalletIcon } from "styles/images/icons/ActiveWallet.svg"
import { useTranslation } from "react-i18next"

interface Props {
  onClick?: (address: string, index: number) => void
  tab: string
}
interface ButtonListItem {
  name: string
  icon?: string
  recipient?: string
}

export const WalletButtonList = ({
  items,
  title,
  icon,
  onClick,
  variant = "primary",
  isMultipleAddresses = false,
}: {
  items: ButtonListItem[]
  title?: string
  icon?: ReactNode
  variant?: "primary" | "secondary"
  isMultipleAddresses?: boolean
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
          key={i.name}
          emoji={i.icon}
          walletName={i.name}
          walletAddress={
            isMultipleAddresses
              ? t("Multiple Addresses")
              : truncate(i.recipient)
          }
          chainIcon={
            i.recipient
              ? network[getChainIdFromAddress(i.recipient, network)]?.icon
              : undefined
          }
          onClick={() => onClick?.(i.recipient ?? i.name, index)}
        />
      ))}
    </Grid>
  )
}

const MyWallets = ({ tab, onClick }: Props) => {
  const { list: addressList } = useAddressBook()
  const { wallets, connectedWallet } = useAuth()

  const localWallets: ButtonListItem[] = wallets.map((w) => ({
    name: w.name,
    icon: w.icon,
  }))

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
          {connectedWallet && (
            <WalletButtonList
              onClick={onClick}
              title="Active"
              icon={<ActiveWalletIcon />}
              items={[connectedWallet]}
              isMultipleAddresses={true}
            />
          )}
          <WalletButtonList
            items={localWallets.filter((w) => w.name !== connectedWallet?.name)}
            onClick={onClick}
            title="Other Wallets"
            isMultipleAddresses={true}
          />
        </>
      )}
    </>
  )
}

export default MyWallets
