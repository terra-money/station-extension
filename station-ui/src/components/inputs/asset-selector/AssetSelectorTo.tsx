import { useEffect, useRef, useState } from "react"
import classNames from "classnames/bind"
import { WalletIcon, DropdownArrowIcon, RoughlyEqualsIcon } from "assets"
import styles from "./AssetSelector.module.scss"

const cx = classNames.bind(styles)

export interface AssetSelectorToProps {
  walletAmount: number
  symbol: string
  tokenIcon: string
  onSymbolClick: () => void
  chainIcon: string
  chainName: string
  amount: number
  currencyAmount: number
  currencySymbol: string
}

const AssetSelectorTo = ({
  walletAmount,
  symbol,
  tokenIcon,
  onSymbolClick,
  chainIcon,
  chainName,
  amount,
  currencyAmount,
  currencySymbol,
}: AssetSelectorToProps) => {
  const amountDisplayRef = useRef<HTMLSpanElement>(null)
  const [fontSize, setFontSize] = useState(24)
  const [maxWidth, setMaxWidth] = useState(0)

  const formatValue = (value: string, decimalLimit: number) => {
    const parts = value.split(".")
    if (parts.length === 2 && parts[1].length > decimalLimit) {
      return parseFloat(value).toFixed(decimalLimit)
    }
    return value
  }

  useEffect(() => {
    if (amountDisplayRef.current && maxWidth === 0) {
      setMaxWidth(amountDisplayRef.current.parentElement?.clientWidth || amountDisplayRef.current.clientWidth)
      setFontSize(24)
    }

    if (amountDisplayRef.current) {
      const scrollWidth = amountDisplayRef.current.scrollWidth

      const hasOverflow = scrollWidth > maxWidth - 18
      let newFontSize = fontSize

      if (hasOverflow && newFontSize > 12) {
        newFontSize -= 3
      } else if (!hasOverflow && newFontSize < 24) {
        if (amountDisplayRef.current?.parentElement && scrollWidth < amountDisplayRef.current?.parentElement?.clientWidth) {
          newFontSize += 1
        }
      }

      setFontSize(newFontSize)
    }
  }, [amount, maxWidth])

  return (
    <div className={styles.asset__selector_wrapper}>
      <div className={styles.header}>
        <div className={styles.left}>
          <WalletIcon width={12} height={12} fill="var(--token-dark-900)" />
          <div className={styles.wallet__text__wrapper}>
            <p className={cx({ [styles.has__value]: walletAmount > 1 })}>
              {formatValue(walletAmount.toString(), 2)}
            </p>
            <p>{symbol}</p>
          </div>
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
                onClick={onSymbolClick}
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
          <div className={styles.input__amount} style={{ width: "100%" }}>
            <RoughlyEqualsIcon fill="var(--token-light-100)" />
            <span
              ref={amountDisplayRef}
              className={cx(styles.amount__token, { [`${styles.amount__empty}`]: Number.isNaN(amount) || amount === 0 })}
              style={{ fontSize: `${fontSize}px` }}
            >
              {!Number.isNaN(amount) ? formatValue(amount.toString(), 4) : "0.00"}
            </span>
          </div>
          <div className={styles.amount__currency}>
            {currencySymbol}{formatValue(currencyAmount.toString(), 2)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetSelectorTo
