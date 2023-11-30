import { useTranslation } from "react-i18next"
import { useThemeFavicon } from "data/settings/Theme"
import styles from "./Welcome.module.scss"
import ExtensionPage from "extension/components/ExtensionPage"
import { Button, WalletList } from "station-ui"
import { useAuth } from "auth"
import { openURL } from "extension/storage"
import { truncate } from "@terra-money/terra-utils"
import { addressFromWords } from "utils/bech32"
import { ReactComponent as AddIcon } from "styles/images/icons/Buy_v2.svg"
import { ReactComponent as UsbIcon } from "styles/images/icons/Usb.svg"
import { ReactComponent as WalletIcon } from "styles/images/icons/Wallet.svg"
import {
  getStoredLegacyWallets,
  isMigrationCompleted,
} from "auth/scripts/keystore"

const Welcome = () => {
  const { t } = useTranslation()
  const icon = useThemeFavicon()
  const { wallets, connect } = useAuth()
  const existsWallets = wallets.length > 0
  const existsLegacyWallets = getStoredLegacyWallets().length > 0
  const migrationCompleted = isMigrationCompleted()

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
                existsLegacyWallets
                  ? "Welcome to your brand new Station Wallet. You'll need to migrate your current wallets to continue using your Station Wallet."
                  : "Station Wallet is the gateway to the interchain and beyond! Please choose how to get started below."
              )}
            </p>
          </section>
        )}
        <section className={styles.connect__options}>
          {!existsWallets && existsLegacyWallets && !migrationCompleted ? (
            <>
              <Button
                onClick={() => openURL("/auth/migration")}
                variant="white-filled"
                block
                icon={<WalletIcon />}
                label={t("Upgrade wallets")}
              />
              <Button
                onClick={() => openURL("/auth/new")}
                variant="outlined"
                block
                icon={<AddIcon />}
                label={t("Create new wallet")}
              />
              <Button
                onClick={() => openURL("/auth/ledger")}
                variant="outlined"
                block
                icon={<UsbIcon />}
                label={t("Connect Ledger wallet")}
              />
            </>
          ) : (
            <>
              <Button
                onClick={() => openURL("/auth/recover")}
                variant="white-filled"
                block
                icon={<WalletIcon />}
                label={t("Import existing wallet")}
                style={existsWallets ? { color: "var(--token-dark-200)" } : {}}
              />
              <Button
                onClick={() => openURL("/auth/new")}
                variant="outlined"
                block
                icon={<AddIcon />}
                label={t("Create new wallet")}
              />
              <Button
                onClick={() => openURL("/auth/ledger")}
                variant="outlined"
                block
                icon={<UsbIcon />}
                label={t("Connect Ledger wallet")}
              />
              {existsLegacyWallets && (
                <Button
                  onClick={() => openURL("/auth/migration")}
                  variant="outlined"
                  block
                  icon={<WalletIcon />}
                  label={t("Finish wallets migration")}
                />
              )}
            </>
          )}
        </section>
      </main>
    </ExtensionPage>
  )
}

export default Welcome
