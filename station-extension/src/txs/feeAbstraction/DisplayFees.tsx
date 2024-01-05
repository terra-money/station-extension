import { useNetwork } from "auth/hooks/useNetwork"
import { Select } from "components/form"
import { ReactNode, useEffect } from "react"
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
  const { data: carbonFees} = useCarbonFees()
  const gasPrices = chainID.startsWith('carbon-') ? carbonFees?.prices : network[chainID]?.gasPrices ?? {}
  const isBalanceLoading = useIsBalanceLoading(chainID)
  const queryClient = useQueryClient()
  const { symbol, decimals } = readNativeDenom(gasDenom ?? "", chainID)

  useEffect(() => {
    if (
      availableGasDenoms.length &&
      !availableGasDenoms.includes(gasDenom ?? "")
    ) {
      setGasDenom(availableGasDenoms[0])
    }
  }, [availableGasDenoms]) // eslint-disable-line


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

  if (!chainsWithGas.includes(chainID) || !availableGasDenoms.length)
    return (
      <GasHelper
        {...{
          gas,
          gasDenom,
          chainID,
          gasPrice: gasPrices[gasDenom],
          onSuccess: () => {
            // refetch balances
            queryClient.invalidateQueries(queryKey.bank.balance)
          },
        }}
      />
    )
  const feeAmount =  Math.ceil(gasPrices[gasDenom] * (gas ?? 0))
  onReady() // if we are at this point fees are ready

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
          value: <Read amount={feeAmount} decimals={decimals} denom={gasDenom} />,
        },
      ]}
    />
  )
}
