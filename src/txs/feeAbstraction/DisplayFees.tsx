import { useNetwork } from "auth/hooks/useNetwork"
import { ReactNode, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Dropdown,
  LoadingCircular,
  SummaryTable,
} from "@terra-money/station-ui"
import styles from "./DisplayFees.module.scss"
import { useNativeDenoms } from "data/token"
import { Read } from "components/token"
import {
  useAvailableGasDenoms,
  useChainsWithGas,
  useIsBalanceLoading,
} from "./utils"
import GasHelper from "./GasHelper"
import { useQueryClient } from "react-query"
import { queryKey } from "data/query"
import { useCarbonFees } from "data/queries/tx"
import { Coins, TxInfo } from "@terra-money/feather.js"
import GasHelperStatus from "./GasHelperStatus"
import { Flex } from "components/layout"

export default function DisplayFees({
  chainID,
  gas,
  gasDenom,
  setGasDenom,
  descriptions,
  onReady,
  totalFees,
}: {
  chainID: string
  gas: number | undefined
  gasDenom: string | undefined
  setGasDenom?: (gasDenom: string) => void
  descriptions?: { label: ReactNode; value: ReactNode }[]
  onReady: (state: boolean) => void
  totalFees?: Coins
}) {
  const chainsWithGas = useChainsWithGas()
  const availableGasDenoms = useAvailableGasDenoms(chainID, gas ?? 0)
  const { t } = useTranslation()
  const readNativeDenom = useNativeDenoms()
  const network = useNetwork()
  const { data: carbonFees } = useCarbonFees()
  const gasPrices = chainID.startsWith("carbon-")
    ? carbonFees?.prices
    : network[chainID]?.gasPrices ?? {}
  const isBalanceLoading = useIsBalanceLoading(chainID)
  const queryClient = useQueryClient()
  const { decimals } = readNativeDenom(gasDenom ?? "", chainID)
  const [lastSubmitTime, setSubmitTime] = useState(0)
  const [helperState, setHelperState] = useState<{
    tx?: TxInfo
    time?: number
    chainID?: string
    submitting: boolean
  }>({ submitting: false })
  const hasMultipleFeeCoins = !!totalFees?.denoms().length
  useEffect(() => {
    if (
      availableGasDenoms.length &&
      !availableGasDenoms.includes(gasDenom ?? "")
    ) {
      setGasDenom && setGasDenom(availableGasDenoms[0])
    }
  }, [availableGasDenoms]) // eslint-disable-line

  if (helperState.submitting || helperState.tx) {
    return (
      <GasHelperStatus
        tx={helperState.tx}
        chainID={helperState.chainID ?? ""}
        timestamp={helperState.time ?? 0}
        onSuccess={() => {
          // refetch balances
          queryClient.invalidateQueries(queryKey.bank.balance)
          onReady(true)
          setSubmitTime(new Date().getTime())
          setHelperState({ submitting: false })
        }}
        gasDenom={gasDenom ?? ""}
      />
    )
  }

  if (!gas || !gasDenom)
    return (
      <section className={styles.loading__card}>
        <LoadingCircular />
        <p>{t("Estimating fee...")}</p>
      </section>
    )

  if (isBalanceLoading)
    return (
      <section className={styles.loading__card}>
        <LoadingCircular />
        <p>{t("Loading balances...")}</p>
      </section>
    )

  if (
    lastSubmitTime + 30_000 < new Date().getTime() &&
    (!chainsWithGas.includes(chainID) || !availableGasDenoms.length)
  ) {
    onReady(false)
    return (
      <GasHelper
        {...{
          gas,
          gasDenom,
          chainID,
          gasPrice: gasPrices?.[gasDenom],
          setState: setHelperState,
        }}
      />
    )
  }

  const feeAmount = Math.ceil(gasPrices?.[gasDenom] * (gas ?? 0))
  if (chainsWithGas.includes(chainID) && availableGasDenoms.length)
    onReady(true)

  return (
    <SummaryTable
      rows={[
        ...(descriptions ?? []),
        {
          label: (
            <div className={styles.gas}>
              {t("Fee")}{" "}
              {!hasMultipleFeeCoins &&
                availableGasDenoms.length > 1 &&
                setGasDenom && (
                  <Dropdown
                    value={gasDenom}
                    options={availableGasDenoms.map((denom) => ({
                      value: denom,
                      label: readNativeDenom(denom, chainID).symbol,
                    }))}
                    onChange={(val) => setGasDenom(val)}
                  />
                )}
            </div>
          ),
          value: hasMultipleFeeCoins ? (
            <Flex gap={8}>
              {totalFees.toArray().map(({ amount, denom }, i) => (
                <Read
                  amount={amount.toNumber()}
                  decimals={decimals}
                  denom={denom}
                  chainID={chainID}
                  key={i}
                />
              ))}
            </Flex>
          ) : (
            <Read
              amount={feeAmount}
              decimals={decimals}
              denom={gasDenom}
              chainID={chainID}
            />
          ),
        },
      ]}
    />
  )
}
