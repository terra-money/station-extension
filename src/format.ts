import BigNumber from "bignumber.js"
import numeral from "numeral"
import { isNil, pickBy } from "ramda"
import { warn } from "./utils"
import { isDenom, isDenomIBC, isDenomLuna, isDenomTerra } from "./is"

const ROUNDING_MODE = BigNumber.ROUND_DOWN

export interface FormatConfig {
  comma: boolean
  fixed: number | false
  prefix: boolean
  integer: boolean
  decimals: number
}

const DefaultConfig: FormatConfig = {
  decimals: 6,
  fixed: false,
  comma: false,
  integer: false,
  prefix: false
}

const getConfig = (config: Partial<FormatConfig> = {}): FormatConfig =>
  Object.assign(
    {},
    DefaultConfig,
    pickBy(value => !isNil(value), config)
  )

/* decimals */
export const formatNumber = (
  value?: BigNumber.Value,
  config?: Partial<FormatConfig>
) => {
  if (!validateValue(value)) return "0"

  const { decimals, comma, integer, fixed, prefix } = getConfig(config)
  const dp = fixed || decimals
  const n = new BigNumber(value).dp(integer ? 0 : dp, ROUNDING_MODE)
  const d = Array.from({ length: dp }, () => "0").join("")
  const fmt = !prefix
    ? [comma ? "0,0" : "0", fixed ? d : `[${d}]`].join(".")
    : integer
    ? "0a"
    : fixed === 1
    ? "0.0a"
    : "0.00a"

  return n.lt(1e-6)
    ? n.toString(10)
    : numeral(n)
        .format(fmt)
        .toUpperCase()
}

/* amount */
export const readAmount = (
  value?: BigNumber.Value,
  config?: Partial<FormatConfig>
) => {
  if (!validateValue(value)) {
    return "0"
  }

  const { decimals } = getConfig(config)
  return formatNumber(
    new BigNumber(value).div(new BigNumber(10).pow(decimals)),
    config
  )
}

export const toAmount = (
  value?: BigNumber.Value,
  config?: Partial<FormatConfig>
) => {
  if (!validateValue(value)) return "0"

  const { decimals } = getConfig(config)
  return new BigNumber(value)
    .times(new BigNumber(10).pow(decimals))
    .integerValue()
    .toString()
}

/* denom */
export const readDenom = (denom: string) =>
  !isDenom(denom)
    ? ""
    : isDenomLuna(denom)
    ? "Luna"
    : isDenomTerra(denom)
    ? `${denom.slice(1, 3).toUpperCase()}T`
    : isDenomIBC(denom)
    ? denom.replace("ibc/", "")
    : denom.slice(1).toUpperCase()

/* percent */
export const formatPercent = (
  value?: BigNumber.Value,
  config?: Partial<FormatConfig>
) => {
  if (!validateValue(value)) return "0"

  const DefaultFixed = 2
  const fixed = isNil(config?.fixed) ? DefaultFixed : config?.fixed
  const n = new BigNumber(value).times(100)
  return fixed ? n.toFixed(fixed) : n.toString()
}

export const readPercent = (
  value?: BigNumber.Value,
  config?: Partial<FormatConfig>
) => {
  return formatPercent(value, config) + "%"
}

/* date */
export const formatDate = (date: Date) => date.toString()

/* helpers */
const validateValue = (value: any): value is BigNumber.Value => {
  if (isNil(value) || new BigNumber(value).isNaN()) {
    warn(`Value is ${value}`)
    return false
  }

  return true
}
