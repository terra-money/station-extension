import { useState } from 'react';
import DefaultTokenIcon from 'assets/icon/DefaultToken.svg';
import DefaultChainIcon from 'assets/icon/DefaultChain.svg';

interface TokenImageProps {
  tokenImg: string
  tokenName: string
  className?: string
}

export const TokenImage = ({ tokenImg, tokenName, className }: TokenImageProps) => {
  const [displayTokenImg, setDisplayTokenImg] = useState(tokenImg)

  const handleTokenImgError = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
    setDisplayTokenImg(DefaultTokenIcon)
  }

  return (
    <img
      className={className}
      src={displayTokenImg}
      alt={tokenName}
      onError={handleTokenImgError}
    />
  )
};

interface ChainImageProps {
  chainImg: string
  chainName: string
  className?: string
}

export const ChainImage = ({ chainImg, chainName, className }: ChainImageProps) => {
  const [displayChainImg, setDisplayChainImg] = useState(chainImg)

  const handleChainImgError = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
    setDisplayChainImg(DefaultChainIcon)
  }

  return (
    <img
      className={className}
      src={displayChainImg}
      alt={chainName}
      onError={handleChainImgError}
    />
  )
};
