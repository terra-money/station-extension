import { useTranslation } from "react-i18next"
import { Routes, Route, useLocation } from "react-router-dom"
import Setup from "./SwapForm"
import Confirm from "./SwapConfirm"
import { useSwap } from "./SwapContext"
import SwapSettings from "./SwapSettingsPage"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"
import useConfirmLeave from "components/form/useConfirmLeave"
import ConfirmLeaveModal from "components/form/ConfirmLeaveModal"

const SwapTx = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { form } = useSwap()
  const { confirmModal, setConfirmModal, onClose, handleConfirmLeave } =
    useConfirmLeave(form.formState.isDirty)

  const backPath = location.pathname.split("/").slice(0, -1).join("/")
  const routes = [
    { path: "/", element: <Setup />, title: "Swap" },
    { path: "/confirm", element: <Confirm />, title: "Confirm Swap" },
    {
      path: "/slippage",
      element: <SwapSettings />,
      title: "Slippage Settings",
    },
  ]

  return (
    <>
      <ConfirmLeaveModal
        isOpen={confirmModal}
        onRequestClose={() => setConfirmModal(false)}
        onConfirm={handleConfirmLeave}
      />
      <Routes>
        {routes.map((r) => (
          <Route
            key={r.path}
            path={r.path}
            element={
              <ExtensionPageV2
                backButtonPath={backPath}
                title={t(r.title)}
                overNavbar={r.path !== "/"}
                fullHeight
                onClose={onClose}
              >
                {r.element}
              </ExtensionPageV2>
            }
          />
        ))}
      </Routes>
    </>
  )
}

export default SwapTx
