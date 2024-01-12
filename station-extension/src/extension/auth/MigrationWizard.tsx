import {
  connectWallet,
  getStoredLegacyWallets,
  getStoredWallets,
  passwordExists,
  setMigrationCompleted,
  storeWallets,
} from "auth/scripts/keystore"
import {
  Banner,
  Button,
  Grid,
  SelectableListItem,
  SummaryHeader,
} from "@terra-money/station-ui"
import MigrateWalletPage, { MigratedWalletResult } from "./MigrateWalletPage"
import { ReactComponent as CheckIcon } from "styles/images/icons/Check.svg"
import { ReactComponent as AlertIcon } from "styles/images/icons/Alert.svg"
import ExtensionPage from "../components/ExtensionPage"
import { useThemeFavicon } from "data/settings/Theme"
import { truncate } from "@terra-money/terra-utils"
import { addressFromWords } from "utils/bech32"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { FlexColumn } from "components/layout"
import { encrypt } from "auth/scripts/aes"
import PasswordForm from "./PasswordForm"
import { useState } from "react"

function needsMigration(w: any): boolean {
  // ledger wallets with pubkey do not need migration
  if (w.ledger && w.pubkey) return false

  // TODO: add more edge cases
  return true
}

function isLegacyLedger(w: any): boolean {
  // ledger wallets without pubkey cannot be migrated
  if (w.ledger && !w.pubkey) return true

  return false
}

const MigrationWizard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const icon = useThemeFavicon()

  const [password, setPassword] = useState<string | undefined>()
  const [selectedWallet, setSelectedWallet] = useState<string | undefined>()
  const [warning, setWarning] = useState<boolean>(false)
  const [completed, setCompleted] = useState<boolean>(false)

  const [legacyWallets, setLegacyWallets] = useState<any[]>(
    getStoredLegacyWallets().filter(
      (w) => needsMigration(w) && !isLegacyLedger(w)
    )
  )
  const [migratedWallets, setMigratedWallets] = useState<
    (MigratedWalletResult | ResultStoredWallet)[]
  >(getStoredLegacyWallets().filter((w) => !needsMigration(w)))

  if (completed) {
    return (
      <ExtensionPage fullHeight>
        <Grid gap={24} style={{ marginTop: 50 }}>
          <SummaryHeader
            statusLabel={t("Success!")}
            statusMessage={t("Your wallets have been imported.")}
            status={"success"}
          />
          <FlexColumn gap={8}>
            {migratedWallets.map((wallet, i) => (
              <SelectableListItem
                key={`legacy-${i}`}
                label={wallet.name}
                subLabel={truncate(
                  // @ts-expect-error
                  addressFromWords(wallet.words["330"])
                )}
                icon={
                  <CheckIcon
                    width={32}
                    height={32}
                    color="var(--token-success-500)"
                  />
                }
                disabled
                onClick={() => {}}
              />
            ))}
          </FlexColumn>
          {legacyWallets.length ? (
            <Banner
              variant="info"
              title={t(
                "You can import other wallets later from the settings page."
              )}
            />
          ) : null}
          <Button
            variant="primary"
            onClick={() => {
              navigate("/")
              setMigratedWallets([])
            }}
          >
            {t("Done")}
          </Button>
        </Grid>
      </ExtensionPage>
    )
  }

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
          setWarning(false)
          setSelectedWallet(undefined)
          setMigratedWallets((w) => [...w, res])
          setLegacyWallets((w) => w.filter(({ name }) => name !== wallet.name))
        }}
        onBack={() => {
          setWarning(false)
          setSelectedWallet(undefined)
        }}
      />
    )
  }

  function completeMigration() {
    if (!password) return

    const currentWallets = getStoredWallets()

    // MAKE SURE WALLET NAMES ARE UNIQUE
    function fixWalletName(name: string): string {
      if (currentWallets.find((w) => w.name === name)) {
        // intentionally recursive, to make sure no wallet will have the same name
        return fixWalletName(`${name} - (migrated)`)
      } else {
        return name
      }
    }

    // store the new migrated wallets
    storeWallets([
      ...currentWallets,
      ...migratedWallets.map((w) => {
        if ("seed" in w) {
          return {
            name: fixWalletName(w.name),
            encryptedSeed: encrypt(w.seed.toString("hex"), password),
            words: w.words,
            pubkey: w.pubkey,
            legacy: w.legacy,
            index: w.index,
          }
        } else if ("privatekey" in w) {
          return {
            name: fixWalletName(w.name),
            encrypted: {
              "330": encrypt(w.privatekey.toString("hex"), password),
            },
            words: w.words,
            pubkey: w.pubkey,
          } as InterchainStoredWallet
        } else if ("privatekeys" in w) {
          return {
            name: fixWalletName(w.name),
            encrypted:
              "118" in w.privatekeys
                ? {
                    "330": encrypt(
                      w.privatekeys["330"].toString("hex"),
                      password
                    ),
                    "118": encrypt(
                      w.privatekeys["118"].toString("hex"),
                      password
                    ),
                  }
                : {
                    "330": encrypt(
                      w.privatekeys["330"].toString("hex"),
                      password
                    ),
                  },
            words: w.words,
            pubkey: w.pubkey,
          } as InterchainStoredWallet
        } else {
          return w as ResultStoredWallet
        }
      }),
    ])

    // non migrated wallets
    const nonMigrated = JSON.parse(localStorage.getItem("keys") || "[]").filter(
      ({ name }: { name: string }) =>
        !migratedWallets.find((w) => w.name === name)
    )
    // delete migrated wallets from legacy storage, but keep non-migrated ones there
    localStorage.setItem("keys", JSON.stringify(nonMigrated))

    // mark migration as completed in local storage
    setMigrationCompleted()

    // cleanup sensitive data
    setPassword(undefined)

    // Connect to last migrated wallet if there is not a wallet already connected.
    if (!localStorage.connectedWallet) {
      const lastMigratedWallet =
        migratedWallets[migratedWallets.length - 1]?.name
      connectWallet(lastMigratedWallet)
    }

    // redirect to success page
    setCompleted(true)
  }

  return (
    <ExtensionPage
      title={t("Migrate wallets")}
      subtitle={t(
        "You will be required to migrate your accounts to Station v3. Please provide your password or recovery phrase for each wallet to proceed."
      )}
      fullHeight
    >
      <Grid gap={24}>
        <FlexColumn gap={8}>
          {legacyWallets.map((wallet, i) => (
            <SelectableListItem
              key={`legacy-${i}`}
              label={wallet.name}
              subLabel={truncate(
                wallet.address ?? addressFromWords(wallet.words["330"])
              )}
              icon={
                <AlertIcon
                  width={32}
                  height={32}
                  color={
                    warning
                      ? "var(--token-error-500)"
                      : "var(--token-warning-500)"
                  }
                />
              }
              onClick={() => setSelectedWallet(wallet.name)}
            />
          ))}
          {migratedWallets.map((wallet, i) => (
            <SelectableListItem
              key={`legacy-${i}`}
              label={wallet.name}
              subLabel={truncate(
                // @ts-expect-error
                addressFromWords(wallet.words["330"])
              )}
              icon={
                <CheckIcon
                  width={32}
                  height={32}
                  color="var(--token-success-500)"
                />
              }
              disabled
              onClick={() => {}}
            />
          ))}
        </FlexColumn>

        {warning && (
          <Banner
            variant="error"
            title={t(
              "You have only migrated {{migrated}} out of {{total}} wallets, are you sure you want to continue?",
              {
                migrated: migratedWallets.length,
                total: migratedWallets.length + legacyWallets.length,
              }
            )}
          />
        )}

        <Button
          variant="primary"
          onClick={() =>
            !legacyWallets.length || warning
              ? completeMigration()
              : setWarning(true)
          }
          label={t("Confirm")}
          disabled={!migratedWallets.length}
        />
      </Grid>
    </ExtensionPage>
  )
}

export default MigrationWizard
