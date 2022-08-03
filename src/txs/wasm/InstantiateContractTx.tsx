import { useTranslation } from "react-i18next"
import { Page, Card } from "components/layout"
import TxContext from "../TxContext"
import IBCHelperContext from "../IBCHelperContext"
import TaxParamsContext from "./TaxParams"
import InstantiateContractForm from "./InstantiateContractForm"

const InstantiateContractTx = () => {
  const { t } = useTranslation()

  return (
    <Page title={t("Instantiate a code")} small>
      <Card>
        <TxContext>
          <IBCHelperContext>
            <TaxParamsContext>
              <InstantiateContractForm />
            </TaxParamsContext>
          </IBCHelperContext>
        </TxContext>
      </Card>
    </Page>
  )
}

export default InstantiateContractTx
