import { useTranslation } from "react-i18next"
import { ModalButton } from "@terra-money/station-ui"
import { Button } from "components/general"
import is from "auth/scripts/is"
import CoinTypePasswordForm from "./CoinTypePasswordForm"
import { useAuth } from "auth"
import CoinTypeMnemonicForm from "./CoinTypeMnemonicForm"

const EnableCoinType = () => {
  const { t } = useTranslation()
  const { wallet } = useAuth()
  // if wallet is ledger or multisig, return null
  if (!wallet || is.ledger(wallet) || is.multisig(wallet)) return null
  // if wallet already has injective address enabled, return null
  if (wallet.words?.["60"]) return null

  return (
    <ModalButton
      title={t("Update Wallet")}
      renderButton={(open) => (
        <Button size="small" color="primary" onClick={open}>
          {t("Update Wallet")}
        </Button>
      )}
    >
      {is.seed(wallet) ? <CoinTypePasswordForm /> : <CoinTypeMnemonicForm />}
    </ModalButton>
  )
}

export default EnableCoinType
