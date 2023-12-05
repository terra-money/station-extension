import { useAddressBook } from "data/settings/AddressBook"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import {
  SubmitButton,
  ButtonInlineWrapper,
  Button,
  SummaryHeader,
  Grid,
} from "@terra-money/station-ui"
import AddressWalletList from "./AddressWalletList"
import style from "./AddressBook.module.scss"

const ConfirmDelete = () => {
  const { list, remove } = useAddressBook()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { t } = useTranslation()

  const goBack = () => navigate(`/preferences/address-book/new`, { state })

  const handleDelete = () => {
    remove(state.index)
    navigate(`/preferences/address-book`)
  }

  return (
    <div className={style.confirm__delete__container}>
      <Grid gap={34}>
        <SummaryHeader
          statusLabel={t("Delete Address")}
          status="alert"
          statusMessage={t(
            "Are you sure you want to remove this address from your address book?"
          )}
        />
        <AddressWalletList items={[list[state.index]]} onClick={handleDelete} />
      </Grid>
      <ButtonInlineWrapper>
        <Button label={t("Cancel")} onClick={goBack} variant="secondary" />
        <SubmitButton label={t("Submit")} onClick={handleDelete} />
      </ButtonInlineWrapper>
    </div>
  )
}

export default ConfirmDelete
