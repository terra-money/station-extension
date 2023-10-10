import { useTranslation } from "react-i18next"
import { useAddressBook } from "data/settings/AddressBook"
import { truncate } from "@terra-money/terra-utils"
import { useState } from "react"
import {
  WalletSelectableListItem,
  Button,
  Grid,
  SectionHeader,
  Tabs,
  AddressSelectableListItem,
} from "station-ui"

interface Props {
  onClick?: (item: AddressBook) => void
}

export const WalletList = ({
  items,
  title,
  onClick,
}: {
  items: AddressBook[]
  title: string
  onClick?: (item: AddressBook) => void
}) => {
  if (!items.length) return null
  return (
    <Grid gap={12}>
      <SectionHeader withLine title={title} />
      {items.map((w) => (
        <AddressSelectableListItem
          key={w.name}
          onClick={() => onClick?.(w)}
          label={w.name}
          subLabel={truncate(w.recipient)}
        />
      ))}
    </Grid>
  )
}

const OtherWallets = ({ onClick }: Props) => {
  const { list: addressList } = useAddressBook()
  const [tabKey, setTabKey] = useState("addressBook")

  const tabs = [
    {
      key: "addressBook",
      label: "Address Book",
      onClick: () => setTabKey("addressBook"),
    },
    {
      key: "myWallets",
      label: "My Wallets",
      onClick: () => setTabKey("myWallets"),
    },
  ]

  return (
    <>
      <Tabs activeTabKey={tabKey} tabs={tabs} />
      {tabKey === "addressBook" ? (
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
        <p>Pending useAuth refactor</p>
      )}
    </>
  )
}

export default OtherWallets
