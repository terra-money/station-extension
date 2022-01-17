import { Route, Routes } from "react-router-dom"

/* connect */
import AccessWithLedgerPage from "./AccessWithLedgerPage"
import UnlockPage from "./UnlockPage"

/* create */
import NewWalletPage from "./NewWalletPage"
import RecoverWalletPage from "./RecoverWalletPage"
import ImportWalletPage from "./ImportWalletPage"
import NewMultisigWalletPage from "./NewMultisigWalletPage"

/* manage */
import ExportWalletPage from "./ExportWalletPage"
import ChangePasswordPage from "./ChangePasswordPage"
import DeleteWalletPage from "./DeleteWalletPage"
import Disconnect from "./Disconnect"

const Auth = () => {
  return (
    <Routes>
      {/* connect */}
      <Route path="ledger" element={<AccessWithLedgerPage />} />
      <Route path="unlock/:name" element={<UnlockPage />} />

      {/* create */}
      <Route path="new" element={<NewWalletPage />} />
      <Route path="recover" element={<RecoverWalletPage />} />
      <Route path="import" element={<ImportWalletPage />} />
      <Route path="multisig/new" element={<NewMultisigWalletPage />} />

      {/* manage */}
      <Route path="export" element={<ExportWalletPage />} />
      <Route path="password" element={<ChangePasswordPage />} />
      <Route path="delete" element={<DeleteWalletPage />} />
      <Route path="disconnect" element={<Disconnect />} />
    </Routes>
  )
}

export default Auth
