import { useTranslation } from "react-i18next"
import { Grid } from "components/layout"
import ConfirmButtons from "../components/ConfirmButtons"
import { useRequest } from "../RequestContainer"
import styles from "./ConfirmNewChain.module.scss"
import ExtensionPage from "extension/components/ExtensionPage"
import OriginCard from "extension/components/OriginCard"
import BottomCard from "extension/components/BottomCard"
import { SwitchNetworkRequest } from "extension/utils"
import { useNetworkState } from "data/wallet"

const ConfirmSwitchNetwork = (request: SwitchNetworkRequest) => {
  const { origin, network } = request
  const { t } = useTranslation()
  const { actions } = useRequest()
  const [networkName, setNetwork] = useNetworkState()
  const { hostname } = new URL(origin)

  // network is already correct
  if (networkName === network) {
    actions.network(request, true)
    return null
  }

  if (!["mainnet", "testnet", "classic", "localterra"].includes(network)) {
    actions.network(request, false, "Invalid request")
    return null
  }

  return (
    <ExtensionPage header={<OriginCard hostname={hostname} />}>
      <Grid gap={20}>
        <header className="center">
          <Grid gap={8}>
            <h1 className={styles.title}>
              {t("Switch network to {{network}}", { network: network })}
            </h1>
            <p className="muted">
              <b>{origin}</b> {t("wants to switch network on the extension.")}
            </p>
          </Grid>
        </header>

        <BottomCard>
          <ConfirmButtons
            buttons={[
              {
                onClick: () => actions.network(request, false, "User denied"),
                children: t("Cancel"),
              },
              {
                onClick: () => {
                  setNetwork(network)
                  actions.network(request, true)
                },
                children: t("Confirm"),
              },
            ]}
          />
        </BottomCard>
      </Grid>
    </ExtensionPage>
  )
}

export default ConfirmSwitchNetwork
