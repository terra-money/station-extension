import { useTranslation } from "react-i18next"
import { useAddressBook } from "data/settings/AddressBook"
import AddAddressBookItem from "./AddressBookForm"
import { truncate } from "@terra-money/terra-utils"
import { useState } from "react"
import {
  WalletSelectableListItem,
  Button,
  Grid,
  SectionHeader,
  Tabs,
} from "station-ui"
import { Empty } from "components/feedback"

interface Props {
  onClick?: (item: AddressBook) => void
}

const AddressBook = ({ onClick }: Props) => {
  const { t } = useTranslation()
  const { list: addressList } = useAddressBook()
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState<number | undefined>()
  const [tabKey, setTabKey] = useState("addressBook")

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setIndex(undefined)
  }

  const WalletList = ({
    items,
    title,
  }: {
    items: AddressBook[]
    title: string
  }) => {
    return (
      <Grid gap={12}>
        <SectionHeader withLine title={title} />
        {!items.length && <Empty />}
        {items.map((w, i) => (
          <WalletSelectableListItem
            copyValue={w.recipient}
            key={w.name}
            settingsOnClick={() => {
              setIndex(i)
              handleOpen()
            }}
            label={w.name}
            subLabel={truncate(w.recipient)}
          />
        ))}
      </Grid>
    )
  }

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

  return open ? (
    <AddAddressBookItem index={index} close={handleClose} />
  ) : (
    <Grid gap={12}>
      <Button variant="dashed" onClick={handleOpen}>
        {t("Add New Address")}
      </Button>
      <Tabs activeTabKey={tabKey} tabs={tabs} />
      {tabKey === "addressBook" ? (
        <>
          <WalletList
            title="Favorites"
            items={addressList.filter((i) => i.favorite)}
          />
          <WalletList
            title="All"
            items={addressList.filter((i) => !i.favorite)}
          />
        </>
      ) : (
        <p>Pending useAuth refactor</p>
      )}
    </Grid>
  )
}

export default AddressBook
