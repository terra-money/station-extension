import { InputHTMLAttributes } from "react"
import classNames from "classnames/bind"
import { WalletIcon, DropdownArrowIcon } from "assets"
import styles from "./AssetSelector.module.scss"

const cx = classNames.bind(styles)

export interface AssetSelectorFromProps {
  walletAmount: number
  handleMaxClick: () => void
  symbol: string
  onSymbolClick: () => void
  tokenIcon: string
  chainIcon: string
  chainName: string
  amountInputAttrs: InputHTMLAttributes<HTMLInputElement>
  currencyAmount: number
  currencySymbol: string
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
  currencySymbol,
}: AssetSelectorFromProps) => {

  const formatValue = (value: string, decimalLimit: number) => {
    const parts = value.split(".")
    if (parts.length === 2 && parts[1].length > decimalLimit) {
      return parseFloat(value).toFixed(decimalLimit)
    }
    return value
  }

  return (
    <div className={cx(styles.asset__selector_wrapper, styles.from)}>
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
              step={0.000000000000000001}
            />
          </div>
          <div className={styles.amount__currency}>
            {currencySymbol}{formatValue(currencyAmount.toString(), 2)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetSelectorFrom
