import { useTranslation } from "react-i18next"
import { useAddressBook } from "data/settings/AddressBook"
import { useState } from "react"
import { Button, Grid, Tabs } from "@terra-money/station-ui"
import { useNavigate } from "react-router-dom"
import MyWallets from "pages/wallet/SendPage/Components/MyWallets"
import AddressWalletList from "./AddressWalletList"

interface Props {
  onClick?: (item: AddressBook) => void
}

const AddressBook = ({ onClick }: Props) => {
  const { t } = useTranslation()
  const { list: addressList } = useAddressBook()
  const [tabKey, setTabKey] = useState("address")
  const navigate = useNavigate()

  const handleOpen = (index?: number) => {
    navigate(`new`, index !== undefined ? { state: { index } } : {})
  }

  const indexedList = addressList.map((item, index) => ({
    ...item,
    index,
  }))

  const favorites = indexedList.filter((i) => i.favorite)
  const others = indexedList.filter((i) => !i.favorite)

  const tabs = [
    {
      key: "address",
      label: t("Address Book"),
      onClick: () => setTabKey("address"),
    },
    {
      key: "wallets",
      label: t("My Wallets"),
      onClick: () => setTabKey("wallets"),
    },
  ]

  const handleSettingsClick = (item: AddressBook) => {
    if (item.index !== undefined) {
      handleOpen(item.index)
    }
  }

  return (
    <Grid gap={12}>
      <Button variant="dashed" onClick={() => handleOpen()}>
        {t("Add New Address")}
      </Button>
      <Tabs activeTabKey={tabKey} tabs={tabs} />
      {tabKey === "address" ? (
        <>
          <AddressWalletList
            onClick={handleSettingsClick}
            title="Favorites"
            items={favorites}
          />
          <AddressWalletList
            onClick={handleSettingsClick}
            title="All"
            items={others}
          />
        </>
      ) : (
        <MyWallets
          tab={tabKey}
          onClick={(address) => navigate("my-addresses", { state: address })}
        />
      )}
    </Grid>
  )
}

export default AddressBook
