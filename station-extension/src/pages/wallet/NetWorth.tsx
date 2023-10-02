import WalletActionButtons from "pages/wallet/WalletActionButtons"
import { useCurrency } from "data/settings/Currency"
import { TooltipIcon } from "components/display"
import NetWorthTooltip from "./NetWorthTooltip"
import { useTranslation } from "react-i18next"
import styles from "./NetWorth.module.scss"
import { capitalize } from "@mui/material"
import { Read } from "components/token"
import { usePortfolioValue } from "data/token"

const NetWorth = () => {
  const { t } = useTranslation()
  const currency = useCurrency()
  const portfolioValue = usePortfolioValue()

  const NetWorth = () => (
    <h1>
      {currency.symbol}{" "}
      <Read
        className={styles.amount}
        amount={portfolioValue}
        decimals={0}
        fixed={2}
        denom=""
        token=""
      />
    </h1>
  )

  return (
    <article className={styles.networth}>
      <TooltipIcon content={<NetWorthTooltip />} placement="bottom">
        <p>{capitalize(t("portfolio"))}</p>
      </TooltipIcon>
      <NetWorth />
      <div className={styles.networth__buttons}>
        <WalletActionButtons />
      </div>
    </article>
  )
}

export default NetWorth
