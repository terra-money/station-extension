import { useState } from 'react'
import Pill from "components/general/pill/Pill"
import DefaultTokenIcon from 'assets/icon/DefaultToken.svg';
import DefaultChainIcon from 'assets/icon/DefaultChain.svg';
import styles from "../TokenListItem.module.scss"
// import { truncate } from "@terra-money/terra-utils"

export interface TokenSingleChainListItemProps {
  tokenImg: string
  symbol: string
  amountNode: React.ReactNode
  priceNode: React.ReactNode
  chain: { icon: string, label: string }
  isSendBack?: boolean
  onClick?: () => void
}

const TokenSingleChainListItem = ({
  tokenImg,
  symbol,
  priceNode,
  amountNode,
  chain,
  isSendBack,
  onClick,
}: TokenSingleChainListItemProps) => {
  const [displayTokenImg, setDisplayTokenImg] = useState(tokenImg)
  const [displayChainImg, setDisplayChainImg] = useState(chain.icon);

  const handleImgError = (e: { stopPropagation: () => void; }, type: string) => {
    e.stopPropagation()
    if (type === 'token') {
      setDisplayTokenImg(DefaultTokenIcon)
    } else if (type === 'chain') {
      setDisplayChainImg(DefaultChainIcon)
    }
  }

  return (
    <div className={styles.token__container} onClick={onClick}>
      <div className={styles.details}>
        <div className={styles.token__icon__container}>
          <img
            src={displayTokenImg}
            alt={symbol}
            className={styles.token__icon}
            onError={(e) => handleImgError(e, 'token')}
          />
        </div>
        <div className={styles.details__container}>
          <div className={styles.top__row}>
            <h3 className={styles.symbol}>
              <span className={styles.symbol__name}>{symbol}</span>
              {isSendBack && <Pill variant="warning" text="Send Back" />}
            </h3>
            <h3 className={styles.amount}>
              {amountNode}
            </h3>
          </div>
          <div className={styles.bottom__row}>
            <h5 className={styles.chain__label}>
              <img
                src={displayChainImg}
                alt={chain.label}
                className={styles.chain__icon}
                onError={(e) => handleImgError(e, 'chain')}
              />
              {chain.label}
            </h5>
            <h5 className={styles.price}>
              {priceNode}
            </h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenSingleChainListItem
