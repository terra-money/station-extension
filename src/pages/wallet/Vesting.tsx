import {
  parseVestingSchedule,
  isVestingAccount,
  useAccount,
} from "data/queries/vesting"
import { useNativeDenoms } from "data/token"
import styles from "./Vesting.module.scss"
import { useChainID, useNetwork } from "data/wallet"
import { Read } from "components/token"
import {
  VestingCard,
  TokenSingleChainListItem,
  SectionHeader,
} from "station-ui"
import { useExchangeRates } from "data/queries/coingecko"
import { toInput } from "txs/utils"

interface Props {
  token: string
  chain?: string
}

const Vesting = (props: Props) => {
  const { data } = useAccount()
  const readNativeDenom = useNativeDenoms()
  const { token, chain } = props
  const { data: prices } = useExchangeRates()
  const chainID = useChainID()
  const network = useNetwork()
  const { icon, decimals } = readNativeDenom(token, chain ?? chainID)

  if (!data) return null
  if (!isVestingAccount(data)) return null

  const schedule = parseVestingSchedule(data)

  return (
    <>
      <SectionHeader title="Vesting" withLine />
      <VestingCard
        vestedAmount={toInput(schedule.amount.vested, decimals).toString()}
      >
        <TokenSingleChainListItem
          tokenImg={icon ?? ""}
          symbol="LUNA"
          chain={{ icon: icon ?? "", label: network[chain ?? chainID].name }}
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
            <Read
              className={styles.amount}
              amount={
                Number(schedule.amount.vested) * (prices?.[token]?.price ?? 0)
              }
              decimals={decimals}
              fixed={2}
              denom=""
              token=""
            />
          }
        />
      </VestingCard>
    </>
  )
}

export default Vesting
