import { useTranslation } from "react-i18next"
import { useAddressBook } from "data/settings/AddressBook"
import { truncate } from "@terra-money/terra-utils"
import { useState } from "react"
import {
  Grid,
  SectionHeader,
  Tabs,
  AddressSelectableListItem,
} from "station-ui"

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
  if (!items.length) return null
  return (
    <Grid gap={10}>
      <SectionHeader withLine title={title} />
      {items.map((w) => (
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

const OtherWallets = ({ tab, onClick }: Props) => {
  const { list: addressList } = useAddressBook()
  const { t } = useTranslation()

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
        <WalletList title={t("Other Wallets")} items={[]} />
      )}
    </>
  )
}

export default OtherWallets
