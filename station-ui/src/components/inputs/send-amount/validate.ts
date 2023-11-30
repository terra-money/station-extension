import BigNumber from "bignumber.js"
import { readAmount } from "@terra-money/terra-utils"
import { always } from "ramda"

export const toInput = (amount: BigNumber.Value, decimals = 6) =>
  new BigNumber(readAmount(amount, { decimals })).toNumber()

export const lessThan = (max: number, label = "Amount", optional = false) => {
  return (value = 0) => {
    if (optional)
      return !value || value <= max || `${label} must be less than ${max}`

    return (
      (value > 0 && value <= max) || `${label} must be between 0 and ${max}`
    )
  }
}

export const decimal = (decimals = 6, label = "Amount", optional = false) => {
  return (value = 0) => {
    return (
      (optional && !value) ||
      new BigNumber(value).times(new BigNumber(10).pow(decimals)).isInteger() ||
      `${label} must be within ${decimals} decimal points`
    )
  }
}

export const input = (
  max: number,
  decimals = 6,
  label = "Amount",
  optional = false
) => {
  if (max <= 0) return always("Insufficient balance")
  return {
    required: (value = 0) => optional || !!value || `${label} is required`,
    lessThan: lessThan(max, label, optional),
    decimal: decimal(decimals, label, optional),
  }
}
