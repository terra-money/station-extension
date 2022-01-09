import { useTranslation } from "react-i18next"
import { useIsWalletEmpty } from "data/queries/bank"
import { useActiveDenoms } from "data/queries/oracle"
import { readNativeDenom } from "data/token"
import { useCustomTokensIBC } from "data/settings/CustomTokens"
import { useCustomTokensCW20 } from "data/settings/CustomTokens"
import { Button } from "components/general"
import { Grid } from "components/layout"
import { FormError } from "components/form"
import { useCoins } from "pages/wallet/Coins"
import IBCAsset from "pages/wallet/IBCAsset"
import CW20Asset from "pages/wallet/CW20Asset"
import AddTokens from "pages/wallet/AddTokens"
import ExtensionPage from "../components/ExtensionPage"
import ConnectedWallet from "../auth/ConnectedWallet"
import Asset from "./Asset"
import styles from "./Assets.module.scss"

const Assets = () => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const { data: denoms, ...state } = useActiveDenoms()
  const coins = useCoins(denoms)
  const { list: ibc } = useCustomTokensIBC()
  const { list: cw20 } = useCustomTokensCW20()

  if (!(coins && ibc && cw20)) return null

  const [, filtered] = coins

  return (
    <ExtensionPage {...state} header={<ConnectedWallet />}>
      <Grid gap={16}>
        {isWalletEmpty && (
          <FormError>{t("Coins required to post transactions")}</FormError>
        )}

        <div className={styles.assets}>
          {filtered.map((item) => {
            const { denom } = item
            return <Asset {...readNativeDenom(denom)} {...item} key={denom} />
          })}

          {!ibc.length
            ? null
            : ibc.map(({ denom }) => (
                <IBCAsset denom={denom} key={denom}>
                  {(item) => <Asset {...item} />}
                </IBCAsset>
              ))}

          {!cw20.length
            ? null
            : cw20.map((item) => (
                <CW20Asset {...item} key={item.token}>
                  {(item) => <Asset {...item} />}
                </CW20Asset>
              ))}
        </div>

        <AddTokens>
          {(open) => <Button onClick={open}>{t("Add tokens")}</Button>}
        </AddTokens>
      </Grid>
    </ExtensionPage>
  )
}

export default Assets
