/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputHTMLAttributes, useEffect, useRef, useState } from "react"
import classNames from "classnames/bind"
import BigNumber from "bignumber.js"
import { WalletIcon, DropdownArrowIcon } from "assets"
import styles from "./AssetSelector.module.scss"

const cx = classNames.bind(styles)

export interface AssetSelectorFromProps {
  setValue: any
  walletAmount: number
  handleMaxClick: () => void
  symbol: string
  onSymbolClick: () => void
  tokenIcon: string
  chainIcon: string
  chainName: string
  amountInputAttrs: InputHTMLAttributes<HTMLInputElement>
  amount: number
  currencyAmount: number
  currencySymbol: string
}

const AssetSelectorFrom = ({
  setValue,
  walletAmount,
  handleMaxClick,
  symbol,
  tokenIcon,
  onSymbolClick,
  chainIcon,
  chainName,
  amountInputAttrs,
  amount,
  currencyAmount,
  currencySymbol,
}: AssetSelectorFromProps) => {
  const [helperAmount, setHelperAmount] = useState("0")
  const mirrorSpanRef = useRef<HTMLSpanElement>(null)
  const [fontSize, setFontSize] = useState(24)
  const [maxWidth, setMaxWidth] = useState(0)
  const [price, setPrice] = useState(0)

  const formatValue = (value: string, decimalLimit: number) => {
    const parts = value.split(".")
    if (parts.length === 2 && parts[1].length > decimalLimit) {
      return parseFloat(value).toFixed(decimalLimit)
    }
    return value
  }

  const formatNumber = (number: number) => {
    const bn = new BigNumber(number)
    if (bn.abs().isGreaterThan(1e+21)) {
      return bn.toExponential()
    } else {
      return bn.toFixed()
    }
  }

  useEffect(() => {
    setPrice(currencyAmount * amount)
    setHelperAmount(formatNumber(amount))
  }, [currencyAmount, amount])

  useEffect(() => {
    if (mirrorSpanRef.current && maxWidth === 0) {
      setFontSize(24)
      setMaxWidth(mirrorSpanRef.current.parentElement?.clientWidth || mirrorSpanRef.current.clientWidth)
    }

    if (mirrorSpanRef.current) {
      setMaxWidth(mirrorSpanRef.current.parentElement?.clientWidth || mirrorSpanRef.current.clientWidth)
    }

    if (mirrorSpanRef.current) {
      const hasOverflow = mirrorSpanRef.current.scrollWidth > maxWidth - 1
      let newFontSize = fontSize

      if (hasOverflow && newFontSize > 12) {
        newFontSize -= 3
      } else if (!hasOverflow && newFontSize < 24) {
        if (mirrorSpanRef.current?.parentElement && mirrorSpanRef.current.scrollWidth < mirrorSpanRef.current?.parentElement?.clientWidth) {
          newFontSize += 1
        }
      }

      setFontSize(newFontSize)
    }
  }, [helperAmount, amount, symbol, maxWidth])

  const handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    amountInputAttrs.onChange && amountInputAttrs.onChange(e)
    const inputValue = e.target.value

    const formattedValue = formatNumber(parseFloat(inputValue))
    setHelperAmount(formattedValue)
    setValue(amountInputAttrs.name || "tokenAmount", formattedValue)
  }

  return (
    <div className={styles.asset__selector_wrapper}>
      <div className={cx(styles.header, styles.from )}>
        <div className={styles.left}>
          <WalletIcon width={12} height={12} fill="var(--token-dark-900)" />
          <div className={styles.wallet__text__wrapper}>
            <p className={cx({ [styles.has__value]: walletAmount > 1 })}>
              {formatValue(walletAmount.toString(), 2)}
            </p>
            <p>{symbol}</p>
          </div>
        </div>
        <div className={styles.right}>
          <button
            className={styles.max__button}
            type="button"
            onClick={handleMaxClick}
          >
            Max
          </button>
        </div>
      </div>

      <div className={styles.inputs}>
        <div className={styles.token__selector}>
          <img src={tokenIcon} width={26} height={26} />
          <div className={styles.token__wrapper}>
            <div className={styles.symbol}>
              <button
                type="button"
                className={styles.symbol__button}
                onClick={() => {
                  onSymbolClick()
                }}
              >
                {symbol}
                <DropdownArrowIcon fill="var(--token-light-white)" />
              </button>
            </div>
            <div className={styles.chain__wrapper}>
              <img src={chainIcon} width={12} height={12} />
              <div className={styles.chain__name}>{chainName}</div>
            </div>
          </div>
        </div>

        <div className={styles.amounts__wrapper}>
          <div className={styles.input__amount}>
            <input
              className={styles.amount__token}
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              {...amountInputAttrs}
              onChange={handleInputOnChange}
              style={{ fontSize: `${fontSize}px` }}
              step={0.000000000000000001}
            />
            <span
              ref={mirrorSpanRef}
              className={cx(styles.mirror__span)}
              aria-hidden="true"
              style={{ fontSize: `${fontSize}px` }}
            >
              {helperAmount}
            </span>
          </div>
          <div className={styles.amount__currency}>
            {currencySymbol}{formatValue(price.toString(), 2)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetSelectorFrom
