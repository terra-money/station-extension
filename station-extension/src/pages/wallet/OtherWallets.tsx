import { useAddressBook } from "data/settings/AddressBook"
import { truncate } from "@terra-money/terra-utils"
import { getWallet } from "auth/scripts/keystore"
import { useState } from "react"
import {
  Grid,
  SectionHeader,
  Tabs,
  AddressSelectableListItem,
} from "station-ui"
import { useAuth } from "auth"
import { Empty } from "components/feedback"
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
  title?: string
  onClick?: (address: string) => void
}) => {
  return (
    <Grid gap={10}>
      {title && <SectionHeader withLine title={title} />}
      {!items.length && <Empty />}
      {items.map((w) => (
        // {w.icon}
        <AddressSelectableListItem
          key={w.name}
          onClick={() => onClick?.(w.recipient)}
          label={w.name}
          subLabel={truncate(w.recipient)}
        />
      ))}
    </Grid>
  )
}

const OtherWallets = ({ onClick, tab }: Props) => {
  const { list: addressList } = useAddressBook()
  const { wallets } = useAuth()

  const myWallets = wallets.map((w) => {
    const { words = {} } = getWallet(w.name)
    return {
      name: w.name,
      recipient: addressFromWords(words?.["330"]),
      icon: w?.icon,
    }
  })

  return (
    <>
      {tab === "address" ? (
        <>
          <WalletList
            title="Favorites"
            onClick={onClick}
            items={addressList.filter((i) => i.favorite)}
          />
          <WalletList
            title="All"
            onClick={onClick}
            items={addressList.filter((i) => !i.favorite)}
          />
        </>
      ) : (
        <WalletList onClick={onClick} items={myWallets} />
      )}
    </>
  )
}

export default OtherWallets
