import { VestingCard, TokenSingleChainListItem } from "@terra-money/station-ui"
import { parseVestingSchedule, useAccount } from "data/queries/vesting"
import { useExchangeRates } from "data/queries/coingecko"
import { useNetwork, useNetworkName } from "data/wallet"
import { useCurrency } from "data/settings/Currency"
import { useNativeDenoms } from "data/token"
import { Read } from "components/token"
import { toInput } from "txs/utils"
import { useMemo } from "react"

const Vesting = () => {
  const { data: account } = useAccount()
  const { data: prices } = useExchangeRates()
  const readNativeDenom = useNativeDenoms()
  const network = useNetwork()
  const networkName = useNetworkName()

  let networkID
  switch (networkName) {
    case "testnet":
      networkID = "pisco-1"
      break
    case "classic":
      networkID = "columbus-5"
      break
    default:
      networkID = "phoenix-1"
      break
  }

  const {
    icon: tokenImg,
    decimals,
    symbol,
  } = readNativeDenom("uluna", networkID)
  const currency = useCurrency()

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
            {currency.symbol + " "}
            <Read
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
