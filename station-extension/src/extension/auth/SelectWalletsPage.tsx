import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useAuth } from "auth"
import is from "auth/scripts/is"
import { addressFromWords } from "utils/bech32"
import ExtensionPageV2 from "extension/components/ExtensionPageV2"
import { FlexColumn, NavButton, WalletList } from "@terra-money/station-ui"
import styles from "./SelectWallets.module.scss"

export default function SelectWalletsPage() {
  const { wallets, connectedWallet, connect } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const activeWallet = wallets.filter(
    (wallet) => wallet.name === connectedWallet?.name
  )[0]
  const activeWalletAddress = addressFromWords(
    connectedWallet?.words["330"] ?? "",
    "terra"
  )

  return (
    <ExtensionPageV2 title={t("Select wallet")} fullHeight>
      <FlexColumn
        gap={24}
        className={styles.select__wallet__container}
        justify="flex-start"
      >
        <NavButton
          label={t("Add Wallet")}
          onClick={() => navigate("/manage-wallet/add")}
          data-testid="add-wallet-button"
        />
        <WalletList
          data-testid="wallet-list"
          activeWallet={{
            name: activeWallet?.name ?? "",
            address: activeWalletAddress,
            isLedger: is.ledger(activeWallet),
            isMultisig: is.multisig(activeWallet),
            settingsOnClick: () =>
              navigate(`/manage-wallet/manage/${activeWallet?.name ?? ""}`),
          }}
          otherWallets={wallets
            .filter(({ name }) => name !== activeWallet?.name)
            .map((wallet) => {
              const address =
                "address" in wallet
                  ? wallet.address
                  : addressFromWords(wallet.words["330"], "terra")

              return {
                name: wallet.name,
                address,
                isLedger: is.ledger(wallet),
                isMultisig: is.multisig(wallet),
                onClick: () => {
                  connect(wallet.name)
                  navigate("/")
                },
                settingsOnClick: () =>
                  navigate(`/manage-wallet/manage/${wallet?.name ?? ""}`),
              }
            })}
        />
      </FlexColumn>
    </ExtensionPageV2>
  )
}
