import { useTranslation } from "react-i18next"
import { useThemeFavicon } from "data/settings/Theme"
import styles from "./Welcome.module.scss"
import ExtensionPage from "extension/components/ExtensionPage"
import { Button } from "station-ui"
import { useAuth } from "auth"
import SwitchWallet from "extension/auth/SwitchWallet"
import { openURL } from "extension/storage"

const Welcome = () => {
  const { t } = useTranslation()
  const icon = useThemeFavicon()
  const { wallets } = useAuth()
  const existsWallets = wallets.length > 0

  return (
    <ExtensionPage
      backgroundColor={existsWallets ? undefined : "main"}
      fullHeight
    >
      <main className={styles.welcome__container}>
        {existsWallets ? (
          <SwitchWallet />
        ) : (
          <section className={styles.welcome}>
            <img src={icon} alt="Station" width={70} />
            <h1 className={styles.title}>{t("Welcome!")}</h1>
            <p className={styles.content}>
              {t(
                "Station Wallet is the gateway to the interchain and beyond! Please choose how to get started below."
              )}
            </p>
          </section>
        )}
        <section className={styles.connect__options}>
          <Button
            onClick={() => openURL("/auth/recover")}
            variant="white-filled"
            block
            label={t("Import existing wallet")}
          />
          <Button
            onClick={() => openURL("/auth/new")}
            variant="outlined"
            block
            label={t("Create new wallet")}
          />
          <Button
            onClick={() => openURL("/auth/ledger")}
            variant="outlined"
            block
            label={t("Connect Ledger wallet")}
          />
        </section>
      </main>
    </ExtensionPage>
  )
}

export default Welcome
