import { useTranslation } from "react-i18next"
import { capitalize } from "@mui/material"
import WalletActionButtons from "pages/wallet/WalletActionButtons"
import { useCurrency } from "data/settings/Currency"
import { Read } from "components/token"
import { usePortfolioValue } from "data/token"
import { Flex, FlexColumn, Tooltip } from "@terra-money/station-ui"
import styles from "./NetWorth.module.scss"
import { ForwardedRef, forwardRef } from "react"
import { InfoIcon } from "@terra-money/station-ui"

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
        decimalSizeSecondary
      />
    </h1>
  )

  const PortfolioIcon = forwardRef(
    (_: any, ref: ForwardedRef<HTMLButtonElement>) => {
      return (
        <button ref={ref}>
          <InfoIcon style={{ fill: "var(--token-dark-900)" }} />
        </button>
      )
    }
  )

  return (
    <article className={styles.networth}>
      <FlexColumn justify="center" gap={8}>
        <Flex gap={12}>
          <p>{capitalize(t("portfolio"))}</p>
          <Tooltip
            children={<PortfolioIcon />}
            content={t(
              "Portfolio value is the total value of your assets minus staked and unstaking tokens"
            )}
          />
        </Flex>
        <NetWorth />
      </FlexColumn>
      <div className={styles.networth__buttons}>
        <WalletActionButtons />
      </div>
    </article>
  )
}

export default NetWorth
