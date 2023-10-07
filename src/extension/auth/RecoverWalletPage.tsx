import { useTranslation } from 'react-i18next'
import RecoverWalletForm from 'auth/modules/create/RecoverWalletForm'
import ExtensionPage from '../components/ExtensionPage'

const RecoverWallet = () => {
  const { t } = useTranslation()

  return (
    <ExtensionPage
      title={t('Import Wallet')}
      subtitle={t(
        "Enter your preferred wallet name and the wallet's seed phrase or private key.",
      )}
      fullHeight
    >
      <RecoverWalletForm />
    </ExtensionPage>
  )
}

export default RecoverWallet
