import { Route, Routes } from "react-router-dom"

/* connect */
import AccessWithLedgerPage from "./AccessWithLedgerPage"

/* create */
import NewWalletPage from "./NewWalletPage"
import RecoverWalletPage from "./RecoverWalletPage"
import NewMultisigWalletPage from "./NewMultisigWalletPage"

/* manage */
import ExportWalletPage from "./ExportWalletPage"
import ChangePasswordPage from "./ChangePasswordPage"
import DeleteWalletPage from "./DeleteWalletPage"
import Disconnect from "./Disconnect"
import MigrationWizard from "./MigrationWizard"

const Auth = () => {
  return (
    <Routes>
      {/* migration */}
      <Route path="migration" element={<MigrationWizard />} />

      {/* connect */}
      <Route path="ledger" element={<AccessWithLedgerPage />} />

      {/* create */}
      <Route path="new" element={<NewWalletPage />} />
      <Route path="recover" element={<RecoverWalletPage />} />
      <Route path="multisig/new" element={<NewMultisigWalletPage />} />

      {/* manage */}
      <Route path="export/:walletName" element={<ExportWalletPage />} />
      <Route path="password" element={<ChangePasswordPage />} />
      <Route path="delete/:walletName" element={<DeleteWalletPage />} />
      <Route path="disconnect" element={<Disconnect />} />
    </Routes>
  )
}

export default Auth
