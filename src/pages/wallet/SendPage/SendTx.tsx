import { Routes, Route, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Address from "./Address"
import Chain from "./Chain"
import Token from "./Token"
import Submit from "./Submit"
import Confirm from "./Confirm"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"
import { useSend } from "./SendContext"
import ConfirmLeaveModal from "components/form/ConfirmLeaveModal"
import useConfirmLeave from "components/form/useConfirmLeave"
import AddressBook from "./AddressBook"

const SendTx = () => {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const { form } = useSend()
  const { confirmModal, setConfirmModal, onClose, handleConfirmLeave } =
    useConfirmLeave(form.formState.isDirty)

  const getBackPath = (pathname: string) => {
    if (pathname === "/send/address-book") return "/send/1"
  }

  const routes = [
    { path: "/1", element: <Address />, title: "Send" },
    { path: "/2", element: <Chain />, title: "Select Chain" },
    { path: "/3", element: <Token />, title: "Send" },
    { path: "/4", element: <Submit />, title: "Send" },
    { path: "/5", element: <Confirm />, title: "Confirm Send" },
    { path: "/address-book", element: <AddressBook />, title: "Address Book" },
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
                backButtonPath={getBackPath(pathname)}
                title={t(r.title)}
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

export default SendTx
