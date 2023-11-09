import ExtensionPage from "extension/components/ExtensionPage"
import { useTranslation } from "react-i18next"

interface Props {
  wallet: {
    name: string
    encryptedSeed?: string
  }
  onComplete: (result: any) => void
  onBack: () => void
}

const MigrateWalletPage = ({ wallet, onComplete }: Props) => {
  const { t } = useTranslation()

  return (
    <ExtensionPage
      title={t("Import wallet")}
      subtitle={t(
        "You will be required to migrate your account to Station V3. Please provide your password or seed phrase to proceed."
      )}
      fullHeight
    ></ExtensionPage>
  )
}

export default MigrateWalletPage
