import { SwapAssetExtra } from "data/queries/swap/types"
import { Read } from "components/token"
import { ReactComponent as WalletIcon } from "styles/images/icons/Wallet.svg"
import style from "../Swap.module.scss"

const AssetFormExtra = ({
  asset,
  onClick,
}: {
  asset: SwapAssetExtra
  onClick?: () => void
}) => {
  return (
    <button style={{ gap: 5 }} onClick={onClick}>
      <WalletIcon style={{ height: 16 }} />{" "}
      <Read
        className={style.text}
        decimals={asset.decimals}
        fixed={4}
        amount={asset.balance}
      />{" "}
      {asset.symbol}
    </button>
  )
}

export default AssetFormExtra
