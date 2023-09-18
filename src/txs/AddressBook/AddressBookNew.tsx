import { useTranslation } from "react-i18next"
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined"
import { useAddressBook } from "data/settings/AddressBook"
import AddAddressBookItem from "./AddressBookForm"
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"
import CustomItem from "./CustomItem"
import { useState } from "react"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { useNetwork } from "data/wallet"
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
  const [index, setIndex] = useState<number>()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
            truncateSubLabel
            settingsOnClick={() => {
              setIndex(i)
              handleOpen()
            }}
            label={w.name}
            subLabel={w.recipient}
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
