import { useTranslation } from "react-i18next"
import ExtensionPage from "../components/ExtensionPage"
import ChangePasswordForm from "auth/modules/manage/ChangePasswordForm"

const ChangePasswordPage = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage title={t("Change password")} backButtonPath="/">
      <ChangePasswordForm />
    </ExtensionPage>
  )
}

export default ChangePasswordPage
