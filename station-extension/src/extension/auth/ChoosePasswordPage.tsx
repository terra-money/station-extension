import { useTranslation } from "react-i18next"
import ExtensionPage from "../components/ExtensionPage"
import ChoosePasswordForm from "auth/modules/password/ChoosePasswordForm"

const ChoosePasswordPage = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage
      title={t("Create your password")}
      backButtonPath="/"
      fullHeight
    >
      <ChoosePasswordForm />
    </ExtensionPage>
  )
}

export default ChoosePasswordPage
