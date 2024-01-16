import {
  FormatConfig,
  formatPercent,
  readAmount,
  truncate,
} from "@terra-money/terra-utils"
import { useNativeDenoms, WithTokenItem } from "data/token"
import { ForwardedRef, forwardRef, Fragment } from "react"
import { useCurrency } from "data/settings/Currency"
import { AccAddress } from "@terra-money/feather.js"
import classNames from "classnames/bind"
import styles from "./Read.module.scss"
import BigNumber from "bignumber.js"

const cx = classNames.bind(styles)

interface Props extends Partial<FormatConfig> {
  amount?: Amount | Value
  denom?: Denom
  token?: Token
  chainID?: string
  currency?: boolean

  approx?: boolean
  block?: boolean
  className?: string
  decimalSizeSecondary?: boolean
}

const Read = forwardRef(
  (
    {
      amount,
      denom,
      approx,
      block,
      comma = false,
      chainID,
      decimalSizeSecondary,
      ...props
    }: Props,
    ref: ForwardedRef<HTMLSpanElement>
  ) => {
    const currency = useCurrency()

    const amountBN = new BigNumber(amount ?? "")
    if (amountBN.isNaN()) return null
    const tenToThePowerOf = (exp: number) => new BigNumber(10).pow(exp)
    const decimals = props.decimals ?? 6

    const fixed = props.fixed
      ? props.fixed
      : amountBN.gte(tenToThePowerOf(decimals + 3))
      ? 0
      : amountBN.lt(tenToThePowerOf(decimals))
      ? props.decimals
      : 2

    const lessThanFloor = fixed ? tenToThePowerOf(-fixed) : 0
    const lessThanFixed =
      amountBN.isGreaterThan(0) &&
      amountBN.times(tenToThePowerOf(-decimals)).lt(lessThanFloor)

    const config = { ...props, comma, fixed }
    const [integer, decimal] = readAmount(amountBN, config).split(".")
    const formattedInteger = Number(integer).toLocaleString("en-US")

    const renderDecimal = () => {
      const decimalValue = lessThanFixed
        ? `.${lessThanFloor.toString().split(".")[1]}`
        : `.${decimal ?? (0).toFixed(fixed || 2).split(".")[1]}`

      const formattedDecimalValue =
        decimalValue.match(/^(\.\d{2,}?)0*?$/)?.[1] || decimalValue
      return (
        <span className={cx({ [styles.small__decimal]: decimalSizeSecondary })}>
          {formattedDecimalValue}
        </span>
      )
    }

    const renderSymbol = () => {
      const token = props.token ?? denom
      if (!token) return null

      return (
        <span className={styles.symbol}>
          {" "}
          <WithTokenItem token={token} chainID={chainID}>
            {({ symbol }) =>
              AccAddress.validate(symbol)
                ? truncate(symbol)
                : symbol ?? truncate(token)
            }
          </WithTokenItem>
        </span>
      )
    }

    const className = cx(styles.component, { block }, props.className)

    return (
      <span className={className} ref={ref}>
        {approx && "≈ "}
        {!!lessThanFixed && "< "}
        {props.currency && currency.symbol}
        {formattedInteger}
        {renderDecimal()}
        {renderSymbol()}
      </span>
    )
  }
)

export default Read

/* percent */
interface PercentProps extends Partial<FormatConfig> {
  children?: string | number
}

export const ReadPercent = forwardRef(
  (
    { children: value, ...config }: PercentProps,
    ref: ForwardedRef<HTMLSpanElement>
  ) => {
    const [integer, decimal] = value
      ? formatPercent(value, config).split(".")
      : []

    return (
      <span className={styles.component} ref={ref}>
        {(integer ?? "0").replace(/\B(?=(\d{3})+(?!\d))/g, "'")}
        {decimal && (
          <>
            <span className={cx({ small: Number(integer ?? "0") })}>
              {decimal && `.${decimal}`}
            </span>
            <span className={styles.small}>%</span>
          </>
        )}
      </span>
    )
  }
)

/* helpers */
export const ReadMultiple = ({ list }: { list: Props[] }) => {
  const readNativeDenom = useNativeDenoms()
  return (
    <>
      {list.map((item, index) => {
        const { denom } = item
        const { decimals } = denom ? readNativeDenom(denom) : { decimals: 6 }
        return (
          <Fragment key={index}>
            {!!index && " + "}
            <Read {...item} decimals={decimals} />
          </Fragment>
        )
      })}
    </>
  )
}
