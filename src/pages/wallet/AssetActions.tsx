import { useTranslation } from "react-i18next"
import { flatten, uniq } from "ramda"
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined"
import ShortcutOutlinedIcon from "@mui/icons-material/ShortcutOutlined"
import RestartAltIcon from "@mui/icons-material/RestartAlt"
import { isDenomTerraNative } from "@terra.kitchen/utils"
import { has } from "utils/num"
import { useNetworkName } from "data/wallet"
import { useIsWalletEmpty } from "data/queries/bank"
import { useCW20Pairs } from "data/Terra/TerraAssets"
import { useTFMTokens } from "data/external/tfm"
import { InternalLink } from "components/general"
import { ExtraActions } from "components/layout"
import { Props } from "./Asset"

const AssetActions = ({ token, symbol, balance }: Props) => {
  const { t } = useTranslation()
  const isWalletEmpty = useIsWalletEmpty()
  const networkName = useNetworkName()
  const getIsSwappableToken = useGetIsSwappableToken()

  return (
    <ExtraActions>
      <InternalLink
        icon={<ShortcutOutlinedIcon style={{ fontSize: 18 }} />}
        to={`/send?token=${token}`}
        disabled={isWalletEmpty || !has(balance)}
      >
        {t("Send")}
      </InternalLink>

      {networkName !== "testnet" && (
        <InternalLink
          icon={<RestartAltIcon style={{ fontSize: 18 }} />}
          to="/"
          state={token}
          disabled={
            isWalletEmpty || !has(balance) || !getIsSwappableToken(token)
          }
        >
          {t("Swap")}
        </InternalLink>
      )}
    </ExtraActions>
  )
}

export default AssetActions

/* helpers */
const useGetIsSwappableToken = () => {
  const networkName = useNetworkName()
  const { data: TFMTokens } = useTFMTokens()

  return (token: TerraAddress) => {
    if (isDenomTerraNative(token)) return true
    if (networkName === "testnet") return false

    if (!TFMTokens) return false
    return TFMTokens.find(({ contract_addr }) => token === contract_addr)
  }
}
