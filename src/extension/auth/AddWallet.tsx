import { useTranslation } from "react-i18next"
import UsbIcon from "@mui/icons-material/Usb"
import useAvailable from "auth/hooks/useAvailable"
import { getOpenURL } from "../storage"
import ExtensionList from "../components/ExtensionList"
import { isFirefox } from "react-device-detect"

const AddWallet = () => {
  const { t } = useTranslation()
  const available = useAvailable()

  !isFirefox &&
    available.push({
      icon: <UsbIcon />,
      to: "/auth/ledger",
      children: t("Access with ledger"),
    })

  return (
    <ExtensionList
      list={available.map(({ to, ...item }) => {
        const openURL = getOpenURL(to)
        if (!openURL) return { ...item, to }
        return { ...item, onClick: openURL }
      })}
    />
  )
}

export default AddWallet
