import {
  ParsedVestingSchedule,
  parseVestingSchedule,
  useAccount,
} from "data/queries/vesting"
import { useNativeDenoms } from "data/token"
import styles from "./Vesting.module.scss"
import { useNetwork } from "data/wallet"
import { Read } from "components/token"
import { VestingCard as Vesting, TokenSingleChainListItem } from "station-ui"
import { useExchangeRates } from "data/queries/coingecko"
import { toInput } from "txs/utils"
import { useCurrency } from "data/settings/Currency"

const VestingCard = () => {
  const { data: account } = useAccount()
  const readNativeDenom = useNativeDenoms()
  const { data: prices } = useExchangeRates()
  const network = useNetwork()
  const {
    icon: tokenImg,
    decimals,
    symbol,
  } = readNativeDenom("uluna", "phoenix-1")
  const currency = useCurrency()
  if (!account) return null

  const schedule = parseVestingSchedule(account)

  const { icon, name } = network["phoenix-1"]

  return (
    <Vesting
      vestedAmount={toInput(schedule.amount.vested, decimals).toString()}
    >
      <TokenSingleChainListItem
        tokenImg={tokenImg ?? ""}
        symbol={symbol}
        chain={{ icon, label: name }}
        amountNode={
          <Read
            className={styles.amount}
            amount={schedule.amount.vested}
            fixed={2}
            decimals={decimals}
            denom=""
            token=""
          />
        }
        priceNode={
          <>
            {currency.symbol + " "}
            <Read
              className={styles.amount}
              amount={
                Number(schedule.amount.vested) * (prices?.["uluna"]?.price ?? 0)
              }
              decimals={decimals}
              fixed={2}
              denom=""
              token=""
            />
          </>
        }
      />
    </Vesting>
  )
}

export default VestingCard
