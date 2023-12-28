import { useTranslation } from "react-i18next"
import { capitalize } from "@mui/material"
import WalletActionButtons from "pages/wallet/WalletActionButtons"
import { useCurrency } from "data/settings/Currency"
import { TooltipIcon } from "components/display"
import { Read } from "components/token"
import { usePortfolioValue } from "data/token"
import { FlexColumn } from "@terra-money/station-ui"
import NetWorthTooltip from "./NetWorthTooltip"
import styles from "./NetWorth.module.scss"

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
        decimalColorSecondary
      />
    </h1>
  )

  return (
    <article className={styles.networth}>
      <FlexColumn justify="center" gap={8}>
        <TooltipIcon content={<NetWorthTooltip />} placement="bottom">
          <p>{capitalize(t("portfolio"))}</p>
        </TooltipIcon>
        <NetWorth />
      </FlexColumn>
      <div className={styles.networth__buttons}>
        <WalletActionButtons />
      </div>
    </article>
  )
}

export default NetWorth
