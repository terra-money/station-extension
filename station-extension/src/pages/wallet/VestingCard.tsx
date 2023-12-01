import { parseVestingSchedule, useAccount } from "data/queries/vesting"
import { useNativeDenoms } from "data/token"
import { useNetwork } from "data/wallet"
import { Read } from "components/token"
import { VestingCard, TokenSingleChainListItem } from "station-ui"
import { useExchangeRates } from "data/queries/coingecko"
import { toInput } from "txs/utils"
import { useMemo } from "react"

const Vesting = () => {
  const { data: account } = useAccount()
  const { data: prices } = useExchangeRates()
  const readNativeDenom = useNativeDenoms()
  const network = useNetwork()
  const {
    icon: tokenImg,
    decimals,
    symbol,
  } = readNativeDenom("uluna", "phoenix-1")

  const schedule = useMemo(() => {
    if (!account?.base_vesting_account) return
    return parseVestingSchedule(account)
  }, [account])

  if (!schedule) return null

  const { icon, name } = network["phoenix-1"]

  return (
    <VestingCard
      vestedAmount={toInput(schedule.amount.vested, decimals).toString()}
    >
      <TokenSingleChainListItem
        tokenImg={tokenImg ?? ""}
        symbol={symbol}
        chain={{ icon, label: name }}
        amountNode={
          <Read
            amount={schedule.amount.vested}
            fixed={2}
            decimals={decimals}
            denom=""
            token=""
          />
        }
        priceNode={
          <>
            <Read
              currency
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
    </VestingCard>
  )
}

export default Vesting
