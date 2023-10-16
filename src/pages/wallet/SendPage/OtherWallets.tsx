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
import { useAuth } from "auth"
import { Empty } from "components/feedback"

interface Props {
  onClick?: (address: string) => void
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
  if (!items.length) return <Empty />
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

const OtherWallets = ({ onClick }: Props) => {
  const { list: addressList } = useAddressBook()
  const [tabKey, setTabKey] = useState("addressBook")
  // const { wallets } = useAuth()
  const { t } = useTranslation()

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
        <WalletList title={t("Other Wallets")} items={[]} />
      )}
    </>
  )
}

export default OtherWallets
