import NetworkSetting from "./NetworkSetting"
import LanguageSetting from "./LanguageSetting"
import SecuritySetting from "./SecuritySetting"
import CurrencySetting from "./CurrencySetting"
import LCDSetting from "./LCDSetting"
import ContactsIcon from "@mui/icons-material/Contacts"
import { ReactComponent as ManageAssets } from "styles/images/icons/ManageAssets.svg"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ChangePasswordForm from "auth/modules/manage/ChangePasswordForm"
import ManageCustomTokens from "pages/custom/ManageCustomTokens"
import { ManageWalletList } from "auth/modules/manage/ManageWallets"
import { useNetworkName } from "data/wallet"
import { useCurrency } from "data/settings/Currency"
import { Languages } from "config/lang"
import { capitalize } from "@mui/material"
import AddressBookNew from "txs/AddressBook/AddressBookNew"
import { useTranslation } from "react-i18next"
import { SettingsPage } from "./Preferences"

export const useSettingsRoutes = () => {
  const { i18n, t } = useTranslation()
  const { id: currencyId } = useCurrency()
  const networkName = useNetworkName()
  const network = {
    network: {
      key: "network",
      tab: t("Network"),
      value: capitalize(networkName),
      component: <NetworkSetting />,
    },
  }

  const functions = {
    addressBook: {
      key: "addressBook",
      tab: t("Address Book"),
      component: <AddressBookNew />,
      icon: <ContactsIcon />,
    },
    manageTokens: {
      key: "manageTokens",
      tab: t("Manage Tokens"),
      component: <ManageCustomTokens />,
      icon: <ManageAssets />,
    },
    manageWallet: {
      key: "manageWallet",
      tab: t("Manage Wallet"),
      component: <ManageWalletList />,
      icon: <LockOutlinedIcon />,
    },
  }

  const settings = {
    lang: {
      key: "lang",
      tab: t("Language"),
      component: <LanguageSetting />,
      value: Object.values(Languages ?? {}).find(
        ({ value }) => value === i18n.language
      )?.label,
    },
    currency: {
      key: "currency",
      tab: t("Currency"),
      component: <CurrencySetting />,
      value: currencyId,
    },
    security: {
      key: "security",
      tab: t("Security"),
      component: <SecuritySetting />,
      icon: <LockOutlinedIcon />,
    },
  }

  const subPages = {
    changePassword: {
      key: "changePassword",
      tab: t("Change Password"),
      component: <ChangePasswordForm />,
      icon: <LockOutlinedIcon />,
      parent: "security",
    },
    lcd: {
      key: "lcd",
      component: <LCDSetting />,
      tab: t("Add LCD Endpoint"),
      parent: "network",
    },
  }

  const routes: Record<string, SettingsPage> = {
    ...network,
    ...functions,
    ...settings,
    ...subPages,
  }

  return { routes, functions, settings, subPages }
}
