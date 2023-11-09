import { useTranslation } from "react-i18next"
import ExtensionPage from "../components/ExtensionPage"
import { useState } from "react"
import { getStoredLegacyWallets, passwordExists } from "auth/scripts/keystore"
import PasswordForm from "./PasswordForm"
import { NavButton } from "station-ui"
import { FlexColumn } from "components/layout"

import { ReactComponent as CheckIcon } from "styles/images/icons/Check.svg"
import { ReactComponent as AlertIcon } from "styles/images/icons/Alert.svg"
import MigrateWalletPage from "./MigrateWalletPage"

function needsMigration(w: any): boolean {
  console.log(w.ledger && w.pubkey)
  // ledger wallets with pubkey do not need migration
  if (w.ledger && w.pubkey) return false
  // TODO: add more edge cases

  return true
}

const MigrationWizard = () => {
  const { t } = useTranslation()

  const [password, setPassword] = useState<string | undefined>()
  const [selectedWallet, setSelectedWallet] = useState<string | undefined>()

  const [legacyWallets, setLegacyWallets] = useState<any[]>(
    getStoredLegacyWallets().filter((w) => needsMigration(w))
  )
  const [migratedWallets, setMigratedWallets] = useState<any[]>(
    getStoredLegacyWallets().filter((w) => !needsMigration(w))
  )

  if (!password) {
    return (
      <ExtensionPage
        title={t(passwordExists() ? "Password" : "New password")}
        subtitle={t(
          passwordExists()
            ? "Please enter your global password to complete your wallet migration"
            : "Please choose a new global password for all your imported wallets"
        )}
        fullHeight
      >
        <PasswordForm onComplete={setPassword} />
      </ExtensionPage>
    )
  }

  if (selectedWallet) {
    const wallet = legacyWallets.find((w) => w.name === selectedWallet)
    if (!wallet) setSelectedWallet(undefined)

    return (
      <MigrateWalletPage
        wallet={wallet}
        onComplete={(res) => {
          setSelectedWallet(undefined)
          setMigratedWallets((w) => [...w, res])
          setLegacyWallets((w) => w.filter(({ name }) => name !== wallet.name))
        }}
        onBack={() => setSelectedWallet(undefined)}
      />
    )
  }

  return (
    <ExtensionPage
      title={t("Import wallets")}
      subtitle={t(
        "You will be required to migrate your accounts to Station V3. Please provide your password or seed phrase for each wallet to proceed."
      )}
      fullHeight
    >
      <FlexColumn gap={8}>
        {legacyWallets.map((wallet, i) => (
          <NavButton
            key={`legacy-${i}`}
            label={wallet.name}
            onClick={() => setSelectedWallet(wallet.name)}
            icon={<AlertIcon color="var(--token-dark-900)" />}
          />
        ))}
        {migratedWallets.map((wallet, i) => (
          <NavButton
            key={`migrated-${i}`}
            label={wallet.name}
            icon={<CheckIcon color="var(--token-success-500)" />}
            disabled
          />
        ))}
      </FlexColumn>
    </ExtensionPage>
  )
}

export default MigrationWizard
