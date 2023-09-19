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
} from "station-ui"

interface Props {
  onClick?: (item: AddressBook) => void
}

const AddressBookNew = ({ onClick }: Props) => {
  const { t } = useTranslation()
  const { list } = useAddressBook()
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState<number | undefined>()

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
    if (!items.length) return null

    return (
      <Grid gap={12}>
        <SectionHeader withLine title={title} />
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

  return open ? (
    <AddAddressBookItem index={index} close={handleClose} />
  ) : (
    <Grid gap={12}>
      <Button variant="dashed" onClick={handleOpen}>
        {t("Add New Address")}
      </Button>
      <WalletList title="Favorites" items={list.filter((i) => i.favorite)} />
      <WalletList title="All" items={list.filter((i) => !i.favorite)} />
    </Grid>
  )
}

export default AddressBookNew
