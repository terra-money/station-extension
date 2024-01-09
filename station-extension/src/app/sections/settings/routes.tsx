import NetworkSetting from "./NetworkSetting"
import LanguageSetting from "./LanguageSetting"
import SecuritySetting from "./SecuritySetting"
import CurrencySetting from "./CurrencySetting"
import LCDSetting from "./LCDSetting"
import ContactsIcon from "@mui/icons-material/Contacts"
import { ReactComponent as ManageAssets } from "styles/images/icons/ManageAssets.svg"
import { ReactComponent as WalletIcon } from "styles/images/icons/Wallet.svg"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ChangePasswordForm from "auth/modules/manage/ChangePasswordForm"
import ManageCustomTokens from "pages/custom/ManageCustomTokens"
import { useNetworkName } from "data/wallet"
import { useCurrency } from "data/settings/Currency"
import { Languages } from "config/lang"
import { capitalize } from "@mui/material"
import AddressBook from "txs/AddressBook/AddressBook"
import { useTranslation } from "react-i18next"
import AddAddressBookForm from "txs/AddressBook/AddressBookForm"
import PreferencesPage, { SettingsPage } from "./PreferencesPage"
import { getStoredLegacyWallets, lockWallet } from "auth/scripts/keystore"
import { openURL } from "extension/storage"
import WalletAddresses from "txs/AddressBook/WalletAddresses"
import { useNavigate } from "react-router"

export const useSettingsRoutes = () => {
  const { i18n, t } = useTranslation()
  const { id: currencyId } = useCurrency()
  const networkName = useNetworkName()
  const navigate = useNavigate()
  const existsLegacyWallets = getStoredLegacyWallets().length > 0

  const network = {
    network: {
      route: "network",
      title: t("Network"),
      value: capitalize(networkName),
      element: <NetworkSetting />,
    },
  }

  const functions = {
    addressBook: {
      route: "address-book",
      title: t("Address Book"),
      element: <AddressBook />,
      icon: <ContactsIcon />,
    },
    manageTokens: {
      route: "manage-tokens",
      title: t("Manage Tokens"),
      element: <ManageCustomTokens />,
      icon: <ManageAssets />,
    },
    lockWallet: {
      onClick: () => {
        lockWallet()
        navigate("/")
        window.location.reload()
      },
      title: t("Lock Wallet"),
      icon: <LockOutlinedIcon />,
    },
    migration: {
      onClick: () => {
        openURL("/auth/migration")
      },
      title: t("Migrate Wallets"),
      icon: <WalletIcon />,
      disabled: !existsLegacyWallets,
    },
  }

  const settings = {
    lang: {
      route: "lang",
      title: t("Language"),
      element: <LanguageSetting />,
      value: Object.values(Languages ?? {}).find(
        ({ value }) => value === i18n.language
      )?.label,
    },
    currency: {
      route: "currency",
      title: t("Currency"),
      element: <CurrencySetting />,
      value: currencyId,
    },
    security: {
      route: "security",
      title: t("Security"),
      element: <SecuritySetting />,
      icon: <LockOutlinedIcon />,
    },
  }

  const subPages = {
    changePassword: {
      route: "security/change-password",
      title: t("Change Password"),
      element: <ChangePasswordForm />,
      icon: <LockOutlinedIcon />,
    },
    lcd: {
      route: "network/lcd",
      element: <LCDSetting />,
      title: t("Add LCD Endpoint"),
    },
    addressBookNew: {
      route: "address-book/new",
      element: <AddAddressBookForm />,
      title: t("New Address Entry"),
    },
    myWallet: {
      route: "address-book/my-addresses",
      element: <WalletAddresses />,
      title: t("My Addresses"),
    },
  }
  const home = {
    route: "/",
    title: t("Settings"),
    element: <PreferencesPage />,
  }

  const routes: Record<string, SettingsPage> = {
    ...network,
    ...functions,
    ...settings,
    ...subPages,
    home,
  }

  return { routes, functions, settings, subPages }
}
