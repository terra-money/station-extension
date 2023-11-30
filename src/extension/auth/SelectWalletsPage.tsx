import ExtensionPage from "extension/components/ExtensionPage"
import { useTranslation } from "react-i18next"
import { FlexColumn, NavButton, WalletList } from "station-ui"
import styles from "./SelectWallets.module.scss"
import { useAuth } from "auth"
import { truncate } from "@terra-money/terra-utils"
import { addressFromWords } from "utils/bech32"
import { useNavigate } from "react-router-dom"

export default function SelectWalletsPage() {
  const { wallets, connectedWallet, connect } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
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
            name: connectedWallet?.name ?? "",
            address: activeWalletAddress,
            settingsOnClick: () =>
              navigate(`/manage-wallet/manage/${connectedWallet?.name ?? ""}`),
          }}
          otherWallets={wallets
            .filter(({ name }) => name !== connectedWallet?.name)
            .map((wallet) => {
              const address =
                "address" in wallet
                  ? wallet.address
                  : addressFromWords(wallet.words["330"], "terra")

              return {
                name: wallet.name,
                address,
                subLabel: truncate(address, [11, 6]),
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
