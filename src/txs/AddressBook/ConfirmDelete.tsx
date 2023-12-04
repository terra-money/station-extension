import { useAddressBook } from "data/settings/AddressBook"
import ExtensionPage from "extension/components/ExtensionPage"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
  SubmitButton,
  ButtonInlineWrapper,
  Button,
  useModal,
  SummaryHeader,
  Grid,
} from "@terra-money/station-ui"
import AddressWalletList from "./AddressWalletList"

const ConfirmDelete = ({ index }: { index: number }) => {
  const { list, remove } = useAddressBook()
  const { closeModal } = useModal()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleDelete = () => {
    remove(index)
    closeModal()
    navigate(`/preferences/address-book`)
  }

  return (
    <ExtensionPage fullHeight>
      <Grid gap={24}>
        <SummaryHeader
          statusLabel={t("Delete Address")}
          status="alert"
          statusMessage={t(
            "Are you sure you want to remove this address from your address book?"
          )}
        />
        <AddressWalletList items={[list[index]]} onClick={closeModal} />
        <ButtonInlineWrapper>
          <Button
            label={t("Cancel")}
            onClick={closeModal}
            variant="secondary"
          />
          <SubmitButton label={t("Submit")} onClick={handleDelete} />
        </ButtonInlineWrapper>
      </Grid>
    </ExtensionPage>
  )
}

export default ConfirmDelete
