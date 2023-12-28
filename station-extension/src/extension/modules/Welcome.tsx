import {
  getStoredLegacyWallets,
  isMigrationCompleted,
} from "auth/scripts/keystore"
import { ReactComponent as WalletIcon } from "styles/images/icons/Wallet.svg"
import { ReactComponent as AddIcon } from "styles/images/icons/Buy_v2.svg"
import { Button, StationIcon, WalletList } from "@terra-money/station-ui"
import { ReactComponent as UsbIcon } from "styles/images/icons/Usb.svg"
import ExtensionPage from "extension/components/ExtensionPage"
// import { useThemeFavicon } from "data/settings/Theme"
import { addressFromWords } from "utils/bech32"
import { useTranslation } from "react-i18next"
import { openURL } from "extension/storage"
import styles from "./Welcome.module.scss"
import { useAuth } from "auth"

const Welcome = () => {
  const { t } = useTranslation()
  // const icon = useThemeFavicon()
  const { wallets, connect } = useAuth()
  const existsWallets = wallets.length > 0
  const existsLegacyWallets = getStoredLegacyWallets().length > 0
  const migrationCompleted = isMigrationCompleted()

  return (
    <ExtensionPage fullHeight>
      <main className={styles.welcome__container}>
        {existsWallets ? (
          <WalletList
            otherWallets={wallets.map((w) => ({
              name: w.name,
              address:
                "address" in w ? w.address : addressFromWords(w.words["330"]),
              onClick: () => {
                connect(w.name)
              },
            }))}
          />
        ) : (
          <section className={styles.welcome}>
            <StationIcon width={57} height={57} />
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
                variant="primary"
                block
                icon={<WalletIcon />}
                label={t("Import existing wallet")}
              />
              <Button
                onClick={() => openURL("/auth/new")}
                variant="primary"
                block
                icon={<AddIcon />}
                label={t("Create new wallet")}
              />
              <Button
                onClick={() => openURL("/auth/ledger")}
                variant="primary"
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
