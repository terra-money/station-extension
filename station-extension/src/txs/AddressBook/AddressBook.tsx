import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { AccAddress } from "@terra-money/feather.js"
import MyWallets from "pages/wallet/SendPage/Components/MyWallets"
import { Grid, Tabs, NavButton, WalletIcon } from "@terra-money/station-ui"

const AddressBook = () => {
  const { t } = useTranslation()
  const [tabKey, setTabKey] = useState("wallets")
  const navigate = useNavigate()

  const handleOpen = (index?: number) => {
    navigate(`new`, { state: { index } })
  }

  const tabs = [
    {
      key: "wallets",
      label: t("My Wallets"),
      onClick: () => setTabKey("wallets"),
    },
    {
      key: "address",
      label: t("Address Book"),
      onClick: () => setTabKey("address"),
    },
  ]

  const onClick = (address: AccAddress, index: number) => {
    if (tabKey === "wallets") {
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
      <Tabs activeTabKey={tabKey} tabs={tabs} />
      <MyWallets tab={tabKey} onClick={onClick} />
    </Grid>
  )
}

export default AddressBook
