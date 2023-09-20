import { useTranslation } from "react-i18next"
import SettingsIcon from "@mui/icons-material/Settings"
import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"
import { FlexColumn } from "station-ui"
import { sandbox } from "auth/scripts/env"
import HeaderIconButton from "../../components/HeaderIconButton"
import NetworkSetting from "./NetworkSetting"
import LanguageSetting from "./LanguageSetting"
import SecuritySetting from "./SecuritySetting"
import CurrencySetting from "./CurrencySetting"
import { ModalButton, NavButton, SectionHeader } from "station-ui"
import { useNetworkName } from "data/wallet"
import { useCurrency } from "data/settings/Currency"
import { Languages } from "config/lang"
import { capitalize } from "@mui/material"
import { ReactElement, useState } from "react"
import AddressBookNew from "txs/AddressBook/AddressBookNew"
import styles from "./Preferences.module.scss"
import createContext from "utils/createContext"
import LCDSetting from "./LCDSetting"
import ContactsIcon from "@mui/icons-material/Contacts"
import { ReactComponent as ManageAssets } from "styles/images/icons/ManageAssets.svg"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import ChangePasswordForm from "auth/modules/manage/ChangePasswordForm"
import ManageCustomTokens from "pages/custom/ManageCustomTokens"
import { ManageWalletList } from "auth/modules/manage/ManageWallets"

interface SettingsPage {
  key: string
  tab: string
  component: ReactElement
  value?: string
  icon?: ReactElement
  header?: ReactElement
  parent?: string
}

export const [useSettingsPage, SettingsPageProvider] = createContext<{
  page: string | undefined
  setPage: (route: string, params?: any) => void
  setHeader?: (header: ReactElement) => void
}>("useSettingsPage")

const Preferences = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState<string | undefined>()
  const { i18n } = useTranslation()
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

  const SettingsGroup = ({
    settings,
  }: {
    settings: Record<string, SettingsPage>
  }) => (
    <FlexColumn gap={6}>
      {Object.values(settings).map(({ tab, key, icon, value }) => (
        <NavButton
          label={tab}
          key={key}
          value={value}
          icon={icon}
          onClick={() => setPage(key)}
        />
      ))}
    </FlexColumn>
  )

  const SettingsMenu = () => (
    <FlexColumn gap={16}>
      {sandbox && (
        <NavButton
          label={t(routes.network.tab)}
          {...routes.network}
          onClick={() => setPage("network")}
        />
      )}
      <SectionHeader withLine />
      <SettingsGroup settings={functions} />
      <SectionHeader withLine />
      <SettingsGroup settings={settings} />
    </FlexColumn>
  )

  const renderHeader = () =>
    page ? (
      <>
        <button
          className={styles.back}
          onClick={() => setPage(routes[page]?.parent ?? undefined)}
        >
          <BackIcon width={18} height={18} />
        </button>
        {routes[page].tab}
      </>
    ) : (
      t("Settings")
    )

  return (
    <ModalButton
      title={renderHeader()}
      renderButton={(open) => (
        <HeaderIconButton
          onClick={() => {
            open()
            setPage(undefined)
          }}
        >
          <SettingsIcon style={{ fontSize: 20 }} />
        </HeaderIconButton>
      )}
    >
      <SettingsPageProvider value={{ page, setPage }}>
        {page ? routes[page].component : <SettingsMenu />}
      </SettingsPageProvider>
    </ModalButton>
  )
}

export default Preferences
