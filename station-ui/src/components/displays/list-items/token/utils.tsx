import { useEffect, useState } from "react"
import classNames from "classnames/bind"
import DefaultTokenIcon from "assets/icon/DefaultToken.svg"
import DefaultChainIcon from "assets/icon/DefaultChain.svg"
import { LoadingCircular } from "components"
import styles from "./utils.module.scss"

const cx = classNames.bind(styles)

const tokenImageCache = new Map();
const chainImageCache = new Map();

interface TokenImageProps {
  tokenImg: string
  tokenName: string
  className?: string
}

export const TokenImage = ({ tokenImg, tokenName, className }: TokenImageProps) => {
  const [isLoading, setIsLoading] = useState(!tokenImageCache.get(tokenImg))
  const [displayTokenImg, setDisplayTokenImg] = useState(tokenImg)

  useEffect(() => {
    if (tokenImageCache.get(tokenImg)) {
      setIsLoading(false)
    }
  }, [tokenImg])

  const handleTokenImgError = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
    setDisplayTokenImg(DefaultTokenIcon)
    tokenImageCache.set(tokenImg, false)
  }

  const handleLoad = () => {
    setIsLoading(false)
    tokenImageCache.set(tokenImg, true)
  };

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
        onLoad={handleLoad}
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
  const [isLoading, setIsLoading] = useState(!chainImageCache.get(chainImg))
  const [displayChainImg, setDisplayChainImg] = useState(chainImg)

  useEffect(() => {
    setDisplayChainImg(chainImg)
    if (chainImageCache.get(chainImg)) {
      setIsLoading(false)
    }
  }, [chainImg]);

  const handleChainImgError = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
    setDisplayChainImg(DefaultChainIcon)
    chainImageCache.set(chainImg, false)
  }

  const handleLoad = () => {
    setIsLoading(false);
    chainImageCache.set(chainImg, true);
  };

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
        onLoad={handleLoad}
      />
    </div>
  )
}
