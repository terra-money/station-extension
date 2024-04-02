import { useTranslation } from "react-i18next"
import { useAddress } from "data/wallet"
import { LinkButton } from "components/general"
import { ModalButton } from "components/feedback"
import { ExtraActions } from "components/layout"
import ContractQuery from "./ContractQuery"
import { useContract } from "./Contract"
import { Button } from "@terra-money/station-ui"

const ContractItemActions = () => {
  const { t } = useTranslation()
  const connectedAddress = useAddress()
  const { address, admin } = useContract()

  return (
    <ExtraActions>
      <ModalButton
        title={t("Query")}
        renderButton={(open) => (
          <Button onClick={open} small variant="outlined">
            {t("Query")}
          </Button>
        )}
      >
        <ContractQuery />
      </ModalButton>

      <LinkButton to={`/contract/execute/${address}`} size="small" outline>
        {t("Execute")}
      </LinkButton>

      <LinkButton
        to={`/contract/migrate/${address}`}
        disabled={!admin || connectedAddress !== admin}
        size="small"
        outline
      >
        {t("Migrate")}
      </LinkButton>

      <LinkButton
        to={`/contract/updateadmin/${address}`}
        disabled={!admin || connectedAddress !== admin}
        size="small"
        outline
      >
        {t("Update Admin")}
      </LinkButton>
    </ExtraActions>
  )
}

export default ContractItemActions
