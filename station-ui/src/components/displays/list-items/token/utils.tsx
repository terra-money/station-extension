import { useState } from "react"
import classNames from "classnames/bind"
import DefaultTokenIcon from "assets/icon/DefaultToken.svg"
import DefaultChainIcon from "assets/icon/DefaultChain.svg"
import { LoadingCircular } from "components"
import styles from "./utils.module.scss"

const cx = classNames.bind(styles)

interface TokenImageProps {
  tokenImg: string
  tokenName: string
  className?: string
}

export const TokenImage = ({ tokenImg, tokenName, className }: TokenImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [displayTokenImg, setDisplayTokenImg] = useState(tokenImg)

  const handleTokenImgError = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
    setDisplayTokenImg(DefaultTokenIcon)
  }

  return (
    <div className={styles.image__wrapper}>
      {isLoading && (
        <LoadingCircular size={16} className={className} />
      )}
      <img
        className={cx(className, { [styles.loaded]: !isLoading })}
        src={displayTokenImg}
        alt={tokenName}
        onError={handleTokenImgError}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}

interface ChainImageProps {
  chainImg: string
  chainName: string
  className?: string
  small?: boolean
}

export const ChainImage = ({ chainImg, chainName, className, small }: ChainImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [displayChainImg, setDisplayChainImg] = useState(chainImg)

  const handleChainImgError = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
    setDisplayChainImg(DefaultChainIcon)
  }

  return (
    <div className={cx(styles.image__wrapper, { [styles.small]: small })}>
      {isLoading && (
        <LoadingCircular size={14} className={className} />
      )}
      <img
        className={cx(className, { [styles.loaded]: !isLoading })}
        src={displayChainImg}
        alt={chainName}
        onError={handleChainImgError}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  )
}
