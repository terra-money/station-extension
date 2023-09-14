import { useTranslation } from "react-i18next"
import SettingsIcon from "@mui/icons-material/Settings"
import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"
import { FlexColumn } from "station-ui"
import { sandbox } from "auth/scripts/env"
import HeaderIconButton from "../components/HeaderIconButton"
import NetworkSetting from "./NetworkSetting"
import LanguageSetting from "./LanguageSetting"
import CurrencySetting from "./CurrencySetting"
import { ModalButton, NavButton } from "station-ui"
import { useNetworkName } from "data/wallet"
import { useCurrency } from "data/settings/Currency"
import { Languages } from "config/lang"
import { capitalize } from "@mui/material"
import { ReactElement, useState } from "react"
import styles from "./Preferences.module.scss"
// import SelectTheme from "./SelectTheme"
import LCDSetting from "./LCDSetting"
// import { useTheme } from "data/settings/Theme"
// import AdvancedSettings from "./AdvancedSettings"
import ContactsIcon from "@mui/icons-material/Contacts"
import { ReactComponent as ManageAssets } from "styles/images/icons/ManageAssets.svg"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"

type Routes =
  | "network"
  | "lang"
  | "currency"
  | "lcd"
  | "addressBook"
  | "manageTokens"
  | "lockWallet"
  | "security"

interface SettingsPage {
  key: Routes
  tab: string
  value?: string
  hide?: boolean // hide from main menu if subpage
  icon?: ReactElement
  seperator?: boolean
}

const Preferences = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState<Routes | null>(null)

  const { i18n } = useTranslation()
  const { id: currencyId } = useCurrency()
  const networkName = useNetworkName()
  // const { name } = useTheme()

  const routes: Record<Routes, SettingsPage> = {
    network: {
      key: "network",
      tab: t("Network"),
      value: capitalize(networkName),
      hide: !sandbox,
      seperator: true,
    },
    addressBook: {
      key: "addressBook",
      tab: t("Address Book"),
      icon: <ContactsIcon />,
    },
    manageTokens: {
      key: "manageTokens",
      tab: t("Manage Tokens"),
      icon: <ManageAssets />,
    },
    lockWallet: {
      key: "lockWallet",
      tab: t("Lock Wallet"),
      icon: <LockOutlinedIcon />,
      seperator: true,
    },
    lang: {
      key: "lang",
      tab: t("Language"),
      value:
        Object.values(Languages ?? {}).find(
          ({ value }) => value === i18n.language
        )?.label ?? Languages.en.label,
    },
    currency: {
      key: "currency",
      tab: t("Currency"),
      value: currencyId,
    },
    security: {
      key: "security",
      tab: t("Security"),
      icon: <LockOutlinedIcon />,
      seperator: true,
    },
    // theme: {
    //   key: "theme",
    //   tab: t("Theme"),
    //   value: capitalize(name),
    // },
    // advanced: {
    //   key: "advanced",
    //   tab: t("Advanced"),
    // },
    lcd: {
      key: "lcd",
      tab: t("Add LCD Endpoint"),
      hide: true,
    },
  }

  const SettingsMenu = () => (
    <FlexColumn gap={8}>
      {Object.values(routes)
        .filter(({ hide }) => !hide)
        .map(({ tab, value, key, icon, seperator }) => (
          <>
            <NavButton
              label={tab}
              value={value}
              key={key}
              icon={icon}
              onClick={() => setPage(key)}
            />
            {seperator && <hr />}
          </>
        ))}
    </FlexColumn>
  )

  const renderSettings = () => {
    switch (page) {
      case "network":
        return <NetworkSetting subPageNav={() => setPage("lcd")} />
      case "currency":
        return <CurrencySetting />
      case "lang":
        return <LanguageSetting />
      // case "theme":
      //   return <SelectTheme />
      case "lcd":
        return <LCDSetting />
      // case "advanced":
      //   return <AdvancedSettings />
      default:
        return <SettingsMenu />
    }
  }

  const renderTitle = () =>
    page ? (
      <div>
        <button
          className={styles.back}
          onClick={() => setPage(page === "lcd" ? "network" : null)}
        >
          <BackIcon width={18} height={18} />
        </button>
        {routes[page].tab}
      </div>
    ) : (
      t("Settings")
    )

  return (
    <ModalButton
      title={renderTitle()}
      renderButton={(open) => (
        <HeaderIconButton
          onClick={() => {
            open()
            setPage(null)
          }}
        >
          <SettingsIcon style={{ fontSize: 18 }} />
        </HeaderIconButton>
      )}
    >
      {renderSettings()}
    </ModalButton>
  )
}

export default Preferences
