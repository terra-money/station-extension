import { InputHTMLAttributes, useState } from "react"
import classNames from "classnames/bind"
import { SwapArrowsIcon, WalletIcon, DropdownArrowIcon } from "assets"
import styles from "./AssetSelector.module.scss"

const cx = classNames.bind(styles)

export interface AssetSelectorFromProps {
  walletAmount: string
  handleMaxClick: () => void
  symbol: string
  tokenIcon: string
  onSymbolClick?: () => void
  chainIcon: string
  chainName: string
  amountInputAttrs: InputHTMLAttributes<HTMLInputElement>
  currencyAmount: string
}

const AssetSelectorFrom = ({
  walletAmount,
  handleMaxClick,
  symbol,
  tokenIcon,
  onSymbolClick,
  chainIcon,
  chainName,
  amountInputAttrs,
  currencyAmount,
}: AssetSelectorFromProps) => {
  const [displayMode, setDisplayMode] = useState("token")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === "") {
      setDisplayMode("token")
    } else {
      setDisplayMode("currency")
    }
  }

  return (
    <div className={styles.asset__selector_wrapper}>
      <div className={styles.header}>
        <div className={styles.left}>
          <WalletIcon width={12} height={12} fill="var(--token-dark-900)" />
          <div className={styles.wallet__text__wrapper}>
            {/* {`${walletAmount || 0} ${symbol}`} */}
            <p className={cx({ [styles.has__value]: parseFloat(walletAmount) > 1 })}>{walletAmount}</p>
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
            {onSymbolClick ? (
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
            ) : (
              <div className={styles.symbol}>{symbol}</div>
            )}
            <div className={styles.chain__wrapper}>
              <img src={chainIcon} width={12} height={12} />
              <div className={styles.chain__name}>{chainName}</div>
            </div>
          </div>
        </div>

        <SwapArrowsIcon fill={"var(--token-light-white)"} />

        <div className={styles.amounts__wrapper}>
          <div className={styles.input__amount}>
          {displayMode === "token" ? (
            <input
              className={styles.large__input}
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              {...amountInputAttrs}
              onChange={handleInputChange}
            />
          ) : (
            <input
              className={styles.large__input}
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              {...amountInputAttrs}
              onChange={handleInputChange}
            />
          )}
          </div>
          <div className={styles.amount__currency}>
            {/* {currencyAmount !== "$NaN" ? currencyAmount : "$0.00"} */}
            {displayMode === "token" ? (
              <input
                className={styles.amount__currency__input}
                type="text"
                value={currencyAmount}
                readOnly
              />
            ) : (
              <input
                className={styles.amount__currency__input}
                type="text"
                value={currencyAmount}
                readOnly
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetSelectorFrom
