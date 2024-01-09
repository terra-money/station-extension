import ExtensionPage from "extension/components/ExtensionPage"
import { useTranslation } from "react-i18next"
import { FlexColumn, NavButton, WalletList } from "@terra-money/station-ui"
import styles from "./SelectWallets.module.scss"
import { useAuth } from "auth"
import { addressFromWords } from "utils/bech32"
import { useNavigate } from "react-router-dom"
import is from "auth/scripts/is"

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
    <ExtensionPage title={t("Select wallet")} fullHeight modal>
      <FlexColumn gap={24} className={styles.select__wallet__container}>
        <NavButton
          label={t("Add Wallet")}
          onClick={() => navigate("/manage-wallet/add")}
        />
        <WalletList
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
    </ExtensionPage>
  )
}
