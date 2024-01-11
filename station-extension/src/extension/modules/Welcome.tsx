import {
  Button,
  BuyIcon,
  CornerBackgroundLogo,
  FlexColumn,
  Grid,
  LedgerIcon,
  StationIcon,
  WalletIcon,
  WalletList,
} from "@terra-money/station-ui"
import {
  getStoredLegacyWallets,
  isMigrationCompleted,
} from "auth/scripts/keystore"
import ExtensionPage from "extension/components/ExtensionPage"
// import { useThemeFavicon } from "data/settings/Theme"
import { addressFromWords } from "utils/bech32"
import { useTranslation } from "react-i18next"
import { openURL } from "extension/storage"
import styles from "./Welcome.module.scss"
import { useAuth } from "auth"

const Welcome = () => {
  const { t } = useTranslation()
  const { wallets, connect } = useAuth()
  const existsWallets = wallets.length > 0
  const existsLegacyWallets = getStoredLegacyWallets().length > 0
  const migrationCompleted = isMigrationCompleted()

  return (
    <ExtensionPage fullHeight>
      <main className={styles.welcome__container}>
        <CornerBackgroundLogo className={styles.logo__background} />
        <div className={styles.top__content__wrapper}>
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
            <FlexColumn align={"center"} className={styles.welcome} gap={16}>
              <StationIcon width={57} height={54} />
              <h1 className={styles.title}>{t("Welcome!")}</h1>
              <p className={styles.content}>
                {t(
                  existsLegacyWallets
                    ? "Welcome to your brand new Station Wallet. You'll need to migrate your current wallets to continue using your Station Wallet."
                    : "Station Wallet is the gateway to the interchain and beyond! Please choose how to get started below."
                )}
              </p>
            </FlexColumn>
          )}
        </div>
        <Grid gap={16}>
          {!existsWallets && existsLegacyWallets && !migrationCompleted ? (
            <>
              <Button
                onClick={() => openURL("/auth/migration")}
                variant="primary"
                block
                icon={<WalletIcon fill="var(--token-light-white)" />}
                label={t("Upgrade wallets")}
              />
              <Button
                onClick={() => openURL("/auth/new")}
                variant="secondary"
                block
                icon={<BuyIcon fill="var(--token-light-white)" />}
                label={t("Create new wallet")}
              />
              <Button
                onClick={() => openURL("/auth/ledger")}
                variant="secondary"
                block
                icon={<LedgerIcon fill="var(--token-light-white)" />}
                label={t("Connect Ledger wallet")}
              />
            </>
          ) : (
            <>
              <Button
                onClick={() => openURL("/auth/recover")}
                variant="primary"
                block
                icon={<WalletIcon fill="var(--token-light-white)" />}
                label={t("Import existing wallet")}
              />
              <Button
                onClick={() => openURL("/auth/new")}
                variant="primary"
                block
                icon={<BuyIcon fill="var(--token-light-white)" />}
                label={t("Create new wallet")}
              />
              <Button
                onClick={() => openURL("/auth/ledger")}
                variant="primary"
                block
                icon={<LedgerIcon fill="var(--token-light-white)" />}
                label={t("Connect Ledger wallet")}
              />
              {existsLegacyWallets && (
                <Button
                  onClick={() => openURL("/auth/migration")}
                  variant="secondary"
                  block
                  icon={<WalletIcon fill="var(--token-light-white)" />}
                  label={t("Finish wallets migration")}
                />
              )}
            </>
          )}
        </Grid>
      </main>
    </ExtensionPage>
  )
}

export default Welcome
