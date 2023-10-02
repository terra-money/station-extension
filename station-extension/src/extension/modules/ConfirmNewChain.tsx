import { useTranslation } from "react-i18next"
import { Card, Grid } from "components/layout"
import ConfirmButtons from "../components/ConfirmButtons"
import { useRequest } from "../RequestContainer"
import styles from "./ConfirmNewChain.module.scss"
import ExtensionPage from "extension/components/ExtensionPage"
import OriginCard from "extension/components/OriginCard"
import BottomCard from "extension/components/BottomCard"
import { SuggestChainRequest } from "extension/utils"
import { useNetworkName } from "data/wallet"
import { Dl } from "components/display"
import { Fragment } from "react"
import { ExternalLink } from "components/general"
import { useValidateLCD } from "data/queries/tendermint"
import { FormError } from "components/form"
import { useCustomChains } from "utils/localStorage"

const ConfirmNewChain = (request: SuggestChainRequest) => {
  const { origin, chain, network } = request
  const { t } = useTranslation()
  const { actions } = useRequest()
  const networkName = useNetworkName()
  const { customChains, setCustomChains } = useCustomChains()
  const { hostname } = new URL(origin)
  const { data: errorMessage, isLoading } = useValidateLCD(
    chain.lcd,
    chain?.chainID
  )

  if (networkName !== network || !["mainnet", "testnet"].includes(network)) {
    actions.chain(request, false)
    return null
  }

  return (
    <ExtensionPage header={<OriginCard hostname={hostname} />}>
      <Grid gap={20}>
        <header className="center">
          <Grid gap={8}>
            <h1 className={styles.title}>
              {t("Add {{chain}} to Station", { chain: chain.name })}
            </h1>
            <p className="muted">
              <b>{origin}</b> {t("wants to add a new chain to Station.")}
            </p>
            <Card size="small" bordered className={styles.chain__card}>
              <header className={styles.header}>
                <p className={styles.txhash}>
                  <span className={styles.chain}>
                    <img src={chain.icon} alt={chain?.chainID} />
                    {chain.name}
                  </span>
                </p>
                <p className={styles.time}>{network.toUpperCase()}</p>
              </header>

              <Dl>
                <Fragment>
                  <dt>ChainID: </dt>
                  <dd>{chain?.chainID}</dd>
                </Fragment>
                <Fragment>
                  <dt>LCD: </dt>
                  <dd>
                    <ExternalLink href={chain.lcd}>{chain.lcd}</ExternalLink>
                  </dd>
                </Fragment>
                {chain.explorer && (
                  <Fragment>
                    <dt>Explorer: </dt>
                    <dd>
                      <ExternalLink
                        href={`https://${new URL(chain.explorer.tx).hostname}`}
                      >
                        https://{new URL(chain.explorer.tx).hostname}
                      </ExternalLink>
                    </dd>
                  </Fragment>
                )}
                <Fragment>
                  <dt>Prefix: </dt>
                  <dd>{chain.prefix}</dd>
                </Fragment>
                <Fragment>
                  <dt>Base Asset: </dt>
                  <dd>{chain.baseAsset}</dd>
                </Fragment>
                <Fragment>
                  <dt>Gas Adjustment: </dt>
                  <dd>{chain.gasAdjustment}</dd>
                </Fragment>
                <Fragment>
                  <dt>Gas Prices: </dt>
                  <dd>{JSON.stringify(chain.gasPrices, null, 2)}</dd>
                </Fragment>

                {chain.tokens.length && (
                  <Fragment>
                    <dt>Tokens: </dt>
                    <dd>
                      {chain.tokens.map(({ name, icon }, i) => (
                        <span className={styles.token} key={i}>
                          <img src={icon} alt={name} />
                          {name}
                        </span>
                      ))}
                    </dd>
                  </Fragment>
                )}
              </Dl>
            </Card>
          </Grid>
        </header>

        <BottomCard>
          {errorMessage && <FormError>{errorMessage}</FormError>}
          <ConfirmButtons
            buttons={[
              {
                onClick: () => actions.chain(request, false),
                children: t("Cancel"),
              },
              {
                onClick: () => {
                  setCustomChains({
                    ...customChains,
                    [network]: {
                      ...customChains[network],
                      [chain?.chainID]: { ...chain, isCustom: true },
                    },
                  })
                  actions.chain(request, true)
                },
                children: t("Confirm"),
                disabled: !isLoading && !!errorMessage,
              },
            ]}
          />
        </BottomCard>
      </Grid>
    </ExtensionPage>
  )
}

export default ConfirmNewChain
