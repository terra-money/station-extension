import { useState } from 'react';
import DefaultTokenIcon from 'assets/icon/DefaultToken.svg';

const TokenImage = ({
  tokenImg,
  symbol,
  imgClassName,
}: {
  tokenImg: string
  symbol: string
  imgClassName?: string
}) => {
  const [displayTokenImg, setDisplayTokenImg] = useState(tokenImg)

  const handleTokenImgError = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation()
    setDisplayTokenImg(DefaultTokenIcon)
  }

  return (
    <img
      src={displayTokenImg}
      alt={symbol}
      className={imgClassName}
      onError={handleTokenImgError}
    />
  )
}

export default TokenImage
