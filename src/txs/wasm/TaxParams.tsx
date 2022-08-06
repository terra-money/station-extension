import { FC } from "react"
import { zipObj } from "ramda"
import createContext from "utils/createContext"
import { useBankBalance } from "data/queries/bank"
import { useTaxCaps, useTaxRate } from "data/queries/treasury"
import { useIsClassic } from "data/query"
import { TaxParams } from "../utils"

export const [useTaxParams, TaxParamsProvider] =
  createContext<TaxParams>("useTaxParams")

interface Props {
  children: React.ReactNode
}

const TaxParamsContext: FC<Props> = ({ children }) => {
  const bankBalance = useBankBalance()

  const denoms = bankBalance.toArray().map(({ denom }) => denom) ?? []
  const { data: taxRate } = useTaxRate(!useIsClassic()) || "0"
  const taxCapsState = useTaxCaps(denoms, !useIsClassic())

  const taxCaps = zipObj(
    denoms,
    taxCapsState.map(({ data }) => {
      return data
    })
  )

  return (
    <TaxParamsProvider value={{ taxRate, taxCaps }}>
      {children}
    </TaxParamsProvider>
  )
}

export default TaxParamsContext
