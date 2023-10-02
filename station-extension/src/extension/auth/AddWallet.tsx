import { useTranslation } from "react-i18next"
import UsbIcon from "@mui/icons-material/Usb"
import useAvailable from "auth/hooks/useAvailable"
import { getOpenURL } from "../storage"
import ExtensionList from "../components/ExtensionList"

const AddWallet = () => {
  const { t } = useTranslation()
  const available = useAvailable()

  return (
    <ExtensionList
      list={[
        ...available,
        {
          icon: <UsbIcon />,
          to: "/auth/ledger",
          children: t("Access with ledger"),
        },
      ].map(({ to, ...item }) => {
        const openURL = getOpenURL(to)
        if (!openURL) return { ...item, to }
        return { ...item, onClick: openURL }
      })}
    />
  )
}

export default AddWallet
