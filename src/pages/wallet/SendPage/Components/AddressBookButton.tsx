import { AddressBookIcon } from "@terra-money/station-ui"
import { useNavigate } from "react-router-dom"

export const AddressBookButton = () => {
  const navigate = useNavigate()

  return (
    <button onClick={() => navigate("/send/address-book")}>
      <AddressBookIcon fill={"var(--token-light-500)"} />
    </button>
  )
}

export default AddressBookButton
