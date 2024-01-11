import { AlertIcon } from "@terra-money/station-ui"
import { useAuth } from "auth"
import is from "auth/scripts/is"
import { useNavigate } from "react-router-dom"

const UpgradeWalletButton = () => {
  const { wallet } = useAuth()
  const navigate = useNavigate()
  // if wallet is ledger or multisig, return null
  if (!wallet || is.ledger(wallet) || is.multisig(wallet)) return null
  // if wallet already has injective address enabled, return null
  if (wallet.words?.["60"]) return null

  return (
    <button onClick={() => navigate(`/manage-wallet/upgrade/${wallet.name}`)}>
      <AlertIcon fill="var(--token-primary-500)" width={18} height={18} />
    </button>
  )
}

export default UpgradeWalletButton
