import { useAddressBook } from "data/settings/AddressBook"
import { getChainIdFromAddress } from "data/queries/chains"
import { ReactNode } from "react"
import { Grid, SectionHeader, WalletButton } from "@terra-money/station-ui"
import { useNetwork } from "data/wallet"
import { truncate } from "@terra-money/terra-utils"
import { useAuth } from "auth"
import { getWallet } from "auth/scripts/keystore"
import { addressFromWords } from "utils/bech32"

interface Props {
  onClick?: (address: string) => void
  tab: string
}

export const WalletButtonList = ({
  items,
  title,
  icon,
  onClick,
}: {
  items: AddressBook[]
  title?: string
  icon?: ReactNode
  onClick?: (address: string) => void
}) => {
  const network = useNetwork()
  if (!items.length) return null
  return (
    <Grid gap={8}>
      {title && <SectionHeader icon={icon} title={title} />}
      {items.map((i) => (
        <WalletButton
          key={i.name + i.recipient}
          emoji={i.icon}
          walletName={i.name}
          walletAddress={truncate(i.recipient)}
          chainIcon={network[getChainIdFromAddress(i.recipient, network)]?.icon}
          onClick={() => onClick?.(i.recipient)}
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
  const myOtherWallets = wallets
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
            title="Favorites"
            icon={
              <div
                style={{
                  borderRadius: "50%",
                  backgroundColor: "yellow",
                  width: "8px",
                  height: "8px",
                }}
              />
            }
            items={addressList.filter((i) => i.favorite)}
          />
          <WalletButtonList
            title="All"
            onClick={onClick}
            items={addressList.filter((i) => !i.favorite)}
          />
        </>
      ) : (
        <>
          <WalletButtonList
            onClick={onClick}
            title="Active"
            icon={
              <div
                style={{
                  borderRadius: "50%",
                  backgroundColor: "var(--token-primary-500)",
                  width: "8px",
                  height: "8px",
                }}
              />
            }
            items={[activeWallet]}
          />
          <WalletButtonList
            items={myOtherWallets}
            onClick={onClick}
            title="Other Wallets"
          />
        </>
      )}
    </>
  )
}

export default MyWallets
