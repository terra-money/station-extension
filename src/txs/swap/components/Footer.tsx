import { useNavigate } from "react-router-dom"
import { useSwap } from "../SwapContext"
import style from "../Swap.module.scss"
import { useTranslation } from "react-i18next"
import { useMemo } from "react"
import { DropdownArrowIcon } from "@terra-money/station-ui"
import { has } from "utils/num"

const Footer = () => {
  const { slippage, form } = useSwap()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { askAsset, offerAsset } = form.watch()

  const exchangeRate = useMemo(() => {
    if (!(has(askAsset.price) && has(offerAsset.price))) return ""
    const rate = (offerAsset.price / askAsset.price).toFixed(4)
    return `1 ${offerAsset.symbol} = ${rate} ${askAsset.symbol}`
  }, [askAsset, offerAsset])

  return (
    <div className={style.footer}>
      <div className={style.item}>{exchangeRate}</div>
      <button onClick={() => navigate("slippage")} className={style.item}>
        {t("Max Slip:")} <span className={style.text}>{slippage}%</span>{" "}
        <DropdownArrowIcon fill="var(--token-light-500)" />
      </button>
    </div>
  )
}

export default Footer
