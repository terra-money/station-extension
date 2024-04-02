import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { AccAddress } from "@terra-money/feather.js"
import MyWallets from "pages/wallet/SendPage/Components/MyWallets"
import {
  Grid,
  Tabs,
  NavButton,
  WalletIcon,
  FavoriteIcon,
} from "@terra-money/station-ui"
import { AddressBookList } from "pages/wallet/SendPage/Components/AddressBookList"
import { useAddressBook } from "data/settings/AddressBook"

const AddressBook = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState("wallets")
  const navigate = useNavigate()
  const { list: addressList } = useAddressBook()

  const handleOpen = (index?: number) => {
    navigate(`new`, { state: { index } })
  }

  const tabs = [
    {
      key: "wallets",
      label: t("My Wallets"),
      onClick: () => setTab("wallets"),
    },
    {
      key: "address",
      label: t("Address Book"),
      onClick: () => setTab("address"),
    },
  ]

  const onClick = (address: AccAddress, index: number) => {
    if (tab === "wallets") {
      navigate("my-addresses", { state: address })
    } else if (index !== undefined) {
      handleOpen(index)
    }
  }

  return (
    <Grid gap={24}>
      <NavButton
        label={t("New Address")}
        onClick={() => handleOpen()}
        icon={<WalletIcon fill="var(--token-light-white)" />}
      />
      <Tabs activeTabKey={tab} tabs={tabs} />
      {tab === "address" ? (
        <>
          <AddressBookList
            onClick={onClick}
            title="Favorites"
            icon={<FavoriteIcon fill={"var(--token-warning-500)"} />}
            items={addressList.filter((i) => i.favorite)}
          />
          <AddressBookList
            title="All Addresses"
            onClick={onClick}
            items={addressList.filter((i) => !i.favorite)}
          />
        </>
      ) : (
        <MyWallets onClick={onClick} />
      )}
    </Grid>
  )
}

export default AddressBook
