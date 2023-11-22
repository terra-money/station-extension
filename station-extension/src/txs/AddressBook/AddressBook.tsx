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
} from "station-ui"
import { useNavigate } from "react-router-dom"
import { useAuth } from "auth"
import { getWallet } from "auth/scripts/keystore"
import { addressFromWords } from "utils/bech32"

interface Props {
  onClick?: (item: AddressBook) => void
}

const AddressBook = ({ onClick }: Props) => {
  const { t } = useTranslation()
  const { list: addressList } = useAddressBook()
  const [tabKey, setTabKey] = useState("address")
  const navigate = useNavigate()
  const { wallets } = useAuth()

  const myWallets = wallets.map((w) => {
    const { words } = getWallet(w.name)

    return {
      name: w.name,
      recipient: addressFromWords(words["330"]),
    }
  })

  const handleOpen = (walletIndex?: number) => {
    navigate(`new`, walletIndex !== undefined ? { state: { walletIndex } } : {})
  }

  const indexedList = addressList.map((item, index) => ({
    ...item,
    index,
  }))

  const favorites = indexedList.filter((i) => i.favorite)
  const others = indexedList.filter((i) => !i.favorite)

  const WalletList = ({
    items,
    title,
  }: {
    items: AddressBook[]
    title: string
  }) => {
    return (
      <Grid gap={12}>
        {title && <SectionHeader withLine title={title} />}
        {items.map((item) => (
          <WalletSelectableListItem
            copyValue={item.recipient}
            walletName={item.name}
            emoji={item.icon}
            key={item.name}
            settingsOnClick={
              item.index !== undefined
                ? () => handleOpen(item.index)
                : undefined
            }
            label={item.name}
            subLabel={truncate(item.recipient)}
          />
        ))}
      </Grid>
    )
  }

  const tabs = [
    {
      key: "address",
      label: "Address Book",
      onClick: () => setTabKey("address"),
    },
    {
      key: "wallets",
      label: "My Wallets",
      onClick: () => setTabKey("wallets"),
    },
  ]

  return (
    <Grid gap={12}>
      <Button variant="dashed" onClick={() => handleOpen()}>
        {t("Add New Address")}
      </Button>
      <Tabs activeTabKey={tabKey} tabs={tabs} />
      {tabKey === "address" ? (
        <>
          <WalletList title="Favorites" items={favorites} />
          <WalletList title="All" items={others} />
        </>
      ) : (
        <WalletList title="" items={myWallets} />
      )}
    </Grid>
  )
}

export default AddressBook
