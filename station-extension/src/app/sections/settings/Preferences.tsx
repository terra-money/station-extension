import { useTranslation } from "react-i18next"
import SettingsIcon from "@mui/icons-material/Settings"
import { ReactComponent as BackIcon } from "styles/images/icons/BackButton.svg"
import { FlexColumn } from "station-ui"
import { sandbox } from "auth/scripts/env"
import HeaderIconButton from "../../components/HeaderIconButton"
import { ModalButton, NavButton, SectionHeader } from "station-ui"
import { ReactElement, useState } from "react"
import styles from "./Preferences.module.scss"
import createContext from "utils/createContext"
import { useSettingsRoutes } from "./routes"

export interface SettingsPage {
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
  const { routes, functions, settings } = useSettingsRoutes()

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
