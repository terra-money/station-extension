import { useTranslation } from "react-i18next"
import AddNetworkForm from "auth/networks/AddNetworkForm"
import ExtensionPage from "../components/ExtensionPage"

const AddNetworkPage = () => {
  const { t } = useTranslation()
  return (
    <ExtensionPage title={t("Add a network")}>
      <AddNetworkForm />
    </ExtensionPage>
  )
}

export default AddNetworkPage
