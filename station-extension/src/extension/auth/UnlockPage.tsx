import { useTranslation } from "react-i18next"
import UnlockForm from "auth/modules/select/UnlockForm"
import ExtensionPage from "../components/ExtensionPage"

const UnlockPage = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage title={t("Unlock wallet")} backButtonPath="/">
      <UnlockForm />
    </ExtensionPage>
  )
}

export default UnlockPage
