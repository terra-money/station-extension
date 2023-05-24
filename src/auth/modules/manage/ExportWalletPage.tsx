import { useTranslation } from "react-i18next"
import { Card, Page } from "components/layout"
import ConnectedWallet from "./ConnectedWallet"
import ExportWalletForm from "./ExportWalletForm"

const ExportWalletPage = () => {
  const { t } = useTranslation()

  return (
    <Page title={t("Export wallet")} backButtonPath="/">
      <ConnectedWallet>
        <Card>
          <ExportWalletForm />
        </Card>
      </ConnectedWallet>
    </Page>
  )
}

export default ExportWalletPage
