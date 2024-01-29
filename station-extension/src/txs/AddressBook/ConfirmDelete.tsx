import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { useAddressBook } from "data/settings/AddressBook"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"
import AddressWalletList from "./AddressWalletList"
import {
  SubmitButton,
  ButtonInlineWrapper,
  Button,
  SummaryHeader,
  Grid,
} from "@terra-money/station-ui"
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
    <ExtensionPageV2>
      <div className={style.confirm__delete__container}>
        <Grid gap={24}>
          <SummaryHeader
            statusLabel={t("Delete Address")}
            status="warning"
            statusMessage={t(
              "Are you sure you want to remove this address from your address book?"
            )}
          />
          <AddressWalletList
            items={[list[state.index]]}
            onClick={handleDelete}
          />
        </Grid>
        <ButtonInlineWrapper>
          <Button label={t("Cancel")} onClick={goBack} variant="secondary" />
          <SubmitButton label={t("Confirm")} onClick={handleDelete} />
        </ButtonInlineWrapper>
      </div>
    </ExtensionPageV2>
  )
}

export default ConfirmDelete
