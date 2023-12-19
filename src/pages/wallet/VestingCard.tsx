import { VestingCard, TokenSingleChainListItem } from "@terra-money/station-ui"
import { parseVestingSchedule, useAccount } from "data/queries/vesting"
import { useExchangeRates } from "data/queries/coingecko"
import { useChainID, useNetwork } from "data/wallet"
import { useNativeDenoms } from "data/token"
import { Read } from "components/token"
import { toInput } from "txs/utils"
import { useMemo } from "react"

const Vesting = () => {
  const { data: account } = useAccount()
  const { data: prices } = useExchangeRates()
  const readNativeDenom = useNativeDenoms()
  const network = useNetwork()
  const networkID = useChainID()

  const {
    icon: tokenImg,
    decimals,
    symbol,
  } = readNativeDenom("uluna", networkID)

  const schedule = useMemo(() => {
    if (!account?.base_vesting_account) return
    return parseVestingSchedule(account)
  }, [account])

  if (!schedule) return null

  const { icon, name } = network[networkID]

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
