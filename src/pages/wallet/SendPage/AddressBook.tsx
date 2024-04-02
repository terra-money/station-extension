import { useAddressBook } from "data/settings/AddressBook"
import { AddressBookList } from "./Components/AddressBookList"
import { FavoriteIcon, Grid } from "@terra-money/station-ui"
import { useSend } from "./SendContext"

const AddressBook = () => {
  const { form, goToStep } = useSend()
  const { list } = useAddressBook()
  const favorites = list.filter((item) => item.favorite)

  const onClick = (address: string, _: number, memo?: string) => {
    form.setValue("recipient", address)
    form.setValue("memo", memo)
    goToStep(2)
  }

  return (
    <Grid gap={16}>
      <AddressBookList
        title="Favorites"
        onClick={onClick}
        icon={<FavoriteIcon fill={"var(--token-warning-500)"} />}
        items={favorites}
      />
      <AddressBookList title="All Addresses" items={list} onClick={onClick} />
    </Grid>
  )
}

export default AddressBook
