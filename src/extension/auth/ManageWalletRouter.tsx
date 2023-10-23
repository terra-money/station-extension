import { Route, Routes } from "react-router-dom"

import ManageWalletsPage from "./ManageWalletsPage"
import SelectWalletsPage from "./SelectWalletsPage"
import AddWalletPage from "./AddWalletPage"

export default function ManageWalletRouter() {
  return (
    <Routes>
      <Route path="select" element={<SelectWalletsPage />} />
      <Route path="manage/:wallet" element={<ManageWalletsPage />} />
      <Route path="add" element={<AddWalletPage />} />
    </Routes>
  )
}
