import { useTranslation } from "react-i18next"
import SettingsIcon from "@mui/icons-material/Settings"
import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"
import { FlexColumn } from "components/layout"
import { sandbox } from "auth/scripts/env"
import HeaderIconButton from "../components/HeaderIconButton"
import NetworkSetting from "./NetworkSetting"
import LanguageSetting from "./LanguageSetting"
import CurrencySetting from "./CurrencySetting"
import { ModalButton } from "components/feedback"
import SettingsButton from "components/layout/SettingsButton"
import { useNetworkName } from "data/wallet"
import { useCurrency } from "data/settings/Currency"
import { Languages } from "config/lang"
import { capitalize } from "@mui/material"
import { useState } from "react"
import styles from "./Preferences.module.scss"
import SelectTheme from "./SelectTheme"
import LCDSetting from "./LCDSetting"
import { useTheme } from "data/settings/Theme"
import AdvancedSettings from "./AdvancedSettings"
import IdentitySetting from "identity/components/IdentitySetting"
import { CreateIdentity } from "identity/components/CreateIdentity"
import { LocalStorageServices } from "identity/services"
import { useActiveIdentity } from "identity/data/Identity"
import { CreateCredential } from "identity/components/CreateCredential"

export type Routes =
  | "network"
  | "lang"
  | "currency"
  | "theme"
  | "lcd"
  | "advanced"
  | "identity"
  | "newidentity"
  | "createcredential"

interface SettingsPage {
  key: Routes
  tab: string
  value?: string
  label?: string
  disabled?: boolean
  className?: string
}

const Preferences = () => {
  const { t } = useTranslation()
  const [page, setPage] = useState<Routes | null>(null)

  const { i18n } = useTranslation()
  const { id: currencyId } = useCurrency()
  const networkName = useNetworkName()
  const { name } = useTheme()
  const { activeIdentity } = useActiveIdentity()

  const routes: Record<Routes, SettingsPage> = {
    network: {
      key: "network",
      tab: t("Network"),
      value: capitalize(networkName),
      disabled: !sandbox,
    },
    lang: {
      key: "lang",
      tab: t("Language"),
      value:
        Object.values(Languages ?? {}).find(
          ({ value }) => value === i18n.language
        )?.label ?? Languages.en.label,
      disabled: false,
    },
    currency: {
      key: "currency",
      tab: t("Currency"),
      value: currencyId,
      disabled: false,
    },
    theme: {
      key: "theme",
      tab: t("Theme"),
      value: capitalize(name),
      disabled: false,
    },
    identity: {
      key: "identity",
      tab: t("Identities"),
      value: activeIdentity?.did ?? "",
      label: activeIdentity?.name ?? "",
      disabled: false,
    },
    advanced: {
      key: "advanced",
      tab: t("Advanced"),
      value: "",
      disabled: false,
      className: styles.advanced,
    },
    lcd: {
      key: "lcd",
      tab: t("Custom LCD"),
      // hide button on the main settings page
      disabled: true,
    },
    newidentity: {
      key: "newidentity",
      tab: t("New Identity"),
      disabled: true,
    },
    createcredential: {
      key: "createcredential",
      tab: t("Create Credential"),
      disabled: true,
    },
  }

  function renderSettings() {
    switch (page) {
      case "network":
        return (
          <FlexColumn gap={16}>
            <NetworkSetting />
            <div className={styles.button__container}>
              <SettingsButton
                title="Custom LCD"
                onClick={() => setPage("lcd")}
              />
            </div>
          </FlexColumn>
        )
      case "currency":
        return <CurrencySetting />
      case "lang":
        return <LanguageSetting />
      case "theme":
        return <SelectTheme />
      case "lcd":
        return <LCDSetting />
      case "advanced":
        return <AdvancedSettings />
      case "identity":
        return <IdentitySetting setPage={setPage} />
      case "newidentity":
        return <CreateIdentity setPage={setPage} />
      case "createcredential":
        return <CreateCredential setPage={setPage} />
      default:
        return (
          <FlexColumn gap={8}>
            {Object.values(routes ?? {})
              .filter(({ disabled }) => !disabled)
              .map(({ tab, value, key, className, label }) => (
                <SettingsButton
                  title={tab}
                  value={label ?? value}
                  key={key}
                  className={className}
                  onClick={() => setPage(key)}
                />
              ))}
          </FlexColumn>
        )
    }
  }

  return (
    <ModalButton
      title={
        page ? (
          <div>
            <button
              className={styles.back}
              onClick={() => {
                switch (page) {
                  case "lcd":
                    setPage("network")
                    break
                  case "newidentity":
                    setPage("identity")
                    break
                  default:
                    setPage(null)
                }
              }}
            >
              <BackIcon width={18} height={18} />
            </button>
            {routes[page].tab}
          </div>
        ) : (
          t("Settings")
        )
      }
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
