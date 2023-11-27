import { useNetwork } from "auth/hooks/useNetwork"
import { Select } from "components/form"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { LoadingCircular, SummaryTable } from "station-ui"
import styles from "./DisplayFees.module.scss"
import { useNativeDenoms } from "data/token"
import { Read } from "components/token"
import {
  useAvailableGasDenoms,
  useChainsWithGas,
  useIsBalanceLoading,
} from "./utils"
import GasHelper from "./GasHelper"

export default function DisplayFees({
  chainID,
  gas,
  gasDenom,
  setGasDenom,
}: {
  chainID: string
  gas: number | undefined
  gasDenom: string
  setGasDenom: (gasDenom: string) => void
}) {
  const chainsWithGas = useChainsWithGas()
  const availableGasDenoms = useAvailableGasDenoms(chainID, gas ?? 0)
  const { t } = useTranslation()
  const readNativeDenom = useNativeDenoms()
  const network = useNetwork()
  const gasPrices = network[chainID]?.gasPrices ?? {}
  const feeAmount = Math.ceil(gasPrices[gasDenom] * (gas ?? 0))
  const isBalanceLoading = useIsBalanceLoading(chainID)

  useEffect(() => {
    if (availableGasDenoms.length && !availableGasDenoms.includes(gasDenom)) {
      setGasDenom(availableGasDenoms[0])
    }
  }, [availableGasDenoms]) // eslint-disable-line

  // gas is loading
  if (!gas)
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
        {...{ gas, gasDenom, chainID, gasPrice: gasPrices[gasDenom] }}
      />
    )

  return (
    <SummaryTable
      rows={[
        {
          label: t("Gas"),
          value: gas,
        },
        {
          label: (
            <>
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
                      {readNativeDenom(denom, chainID).symbol}
                    </option>
                  ))}
                </Select>
              )}
            </>
          ),
          value: <Read amount={feeAmount} denom={gasDenom} />,
        },
      ]}
    />
  )
}
