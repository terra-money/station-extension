import { useTranslation } from "react-i18next"
import { Col, Page } from "components/layout"
import AuthList from "../../components/AuthList"
import { useManageWallet } from "./ManageWallets"

const ManageWallets = () => {
  const { t } = useTranslation()

  const list = useManageWallet()

  return (
    <Page title={t("Manage wallets")}>
      <Col>{list && <AuthList list={list} />}</Col>
    </Page>
  )
}
export default ManageWallets
