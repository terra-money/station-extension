import { Route, Routes } from "react-router-dom"

import ManageWalletsPage from "./ManageWalletsPage"
import SelectWalletsPage from "./SelectWalletsPage"
import AddWalletPage from "./AddWalletPage"
import UpgradeWalletPage from "app/sections/UpgradeWalletPage"

export default function ManageWalletRouter() {
  return (
    <Routes>
      <Route path="select" element={<SelectWalletsPage />} />
      <Route path="manage/:wallet" element={<ManageWalletsPage />} />
      <Route path="upgrade/:walletName" element={<UpgradeWalletPage />} />
      <Route path="add" element={<AddWalletPage />} />
    </Routes>
  )
}
