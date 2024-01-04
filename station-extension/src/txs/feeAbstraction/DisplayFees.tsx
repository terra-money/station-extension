import { useNetwork } from "auth/hooks/useNetwork"
import { Select } from "components/form"
import { ReactNode, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { LoadingCircular, SummaryTable } from "@terra-money/station-ui"
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
import { TxInfo } from "@terra-money/feather.js"
import GasHelperStatus from "./GasHelperStatus"

export default function DisplayFees({
  chainID,
  gas,
  gasDenom,
  setGasDenom,
  descriptions,
  onReady,
}: {
  chainID: string
  gas: number | undefined
  gasDenom: string | undefined
  setGasDenom: (gasDenom: string) => void
  descriptions?: { label: ReactNode; value: ReactNode }[]
  onReady: () => void
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
  const { symbol, decimals } = readNativeDenom(gasDenom ?? "", chainID)
  const [showGasHelper, setShowGasHelper] = useState(false)
  const [opCompleted, setGasCompleted] = useState(false)
  const [helperState, setHelperState] = useState<{
    tx?: TxInfo
    time?: number
    chainID?: string
    submitting: boolean
  }>({ submitting: false })

  useEffect(() => {
    if (
      availableGasDenoms.length &&
      !availableGasDenoms.includes(gasDenom ?? "")
    ) {
      setGasDenom(availableGasDenoms[0])
    }
  }, [availableGasDenoms]) // eslint-disable-line

  useEffect(() => {
    if (
      !opCompleted &&
      (!chainsWithGas.includes(chainID) || !availableGasDenoms.length)
    ) {
      setGasCompleted(false)
      setShowGasHelper(true)
    }
  }, [chainID, chainsWithGas, availableGasDenoms, gas]) // eslint-disable-line

  if (helperState.submitting || helperState.tx) {
    return (
      <GasHelperStatus
        tx={helperState.tx}
        chainID={helperState.chainID ?? ""}
        timestamp={helperState.time ?? 0}
        onSuccess={() => {
          // refetch balances
          onReady()
          setGasCompleted(true)
          setShowGasHelper(false)
          queryClient.invalidateQueries(queryKey.bank.balance)
        }}
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

  if (showGasHelper) {
    return (
      <GasHelper
        {...{
          gas,
          gasDenom,
          chainID,
          gasPrice: gasPrices[gasDenom],
          setState: setHelperState,
        }}
      />
    )
  }

  if (isBalanceLoading)
    return (
      <section className={styles.loading__card}>
        <LoadingCircular />
        <p>{t("Loading balances...")}</p>
      </section>
    )

  if (chainsWithGas.includes(chainID) && availableGasDenoms.length) {
    onReady()
  }

  const feeAmount = Math.ceil(gasPrices[gasDenom] * (gas ?? 0))

  return (
    <SummaryTable
      rows={[
        ...(descriptions ?? []),
        {
          label: (
            <div className={styles.gas}>
              {t("Fee")}{" "}
              {availableGasDenoms.length > 1 && (
                <Select
                  value={gasDenom}
                  onChange={(e) => setGasDenom(e.target.value)}
                  className={styles.select}
                  small
                >
                  {availableGasDenoms.map((denom, i) => (
                    <option value={denom} key={i}>
                      {symbol}
                    </option>
                  ))}
                </Select>
              )}
            </div>
          ),
          value: (
            <Read amount={feeAmount} decimals={decimals} denom={gasDenom} />
          ),
        },
      ]}
    />
  )
}
