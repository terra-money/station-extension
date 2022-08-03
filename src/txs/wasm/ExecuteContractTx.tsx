import { useTranslation } from "react-i18next"
import { Page, Card } from "components/layout"
import TxContext from "../TxContext"
import IBCHelperContext from "../IBCHelperContext"
import TaxParamsContext from "./TaxParams"
import ExecuteContractForm from "./ExecuteContractForm"

const ExecuteContractTx = () => {
  const { t } = useTranslation()

  return (
    <Page title={t("Execute")} small>
      <Card>
        <TxContext>
          <IBCHelperContext>
            <TaxParamsContext>
              <ExecuteContractForm />
            </TaxParamsContext>
          </IBCHelperContext>
        </TxContext>
      </Card>
    </Page>
  )
}

export default ExecuteContractTx
