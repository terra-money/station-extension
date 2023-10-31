import { useTranslation } from "react-i18next"
import { useThemeFavicon } from "data/settings/Theme"
import styles from "./Welcome.module.scss"
import ExtensionPage from "extension/components/ExtensionPage"
import { Button, WalletList } from "station-ui"
import { useAuth } from "auth"
import { openURL } from "extension/storage"
import { truncate } from "@terra-money/terra-utils"
import { addressFromWords } from "utils/bech32"

const Welcome = () => {
  const { t } = useTranslation()
  const icon = useThemeFavicon()
  const { wallets, connect } = useAuth()
  const existsWallets = wallets.length > 0

  return (
    <ExtensionPage
      backgroundColor={existsWallets ? undefined : "main"}
      fullHeight
    >
      <main className={styles.welcome__container}>
        {existsWallets ? (
          <WalletList
            otherWallets={wallets.map((w) => ({
              name: w.name,
              address: truncate(
                "address" in w ? w.address : addressFromWords(w.words["330"]),
                [11, 6]
              ),
              onClick: () => {
                connect(w.name)
              },
            }))}
          />
        ) : (
          <section className={styles.welcome}>
            <img src={icon} alt="Station" width={60} />
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
            style={existsWallets ? { color: "var(--token-dark-200)" } : {}}
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
