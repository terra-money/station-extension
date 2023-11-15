/* eslint-disable react-hooks/exhaustive-deps */
import {
  AssetSelectorTo,
  AssetSelectorFrom,
  Modal,
  Button,
  RoundedButton,
} from "station-ui"
import { useMemo, useState } from "react"
import { SwapAssetExtra, SwapState } from "data/queries/swap/types"
import { useSwap } from "./SwapContext"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"
import SwapTokenSelector from "./components/SwapTokenSelector"
import { useEffect } from "react"
import validate from "txs/validate"
import { useNavigate } from "react-router-dom"
import { ReactComponent as SwapArrows } from "styles/images/icons/SwapArrows.svg"
import styles from "./Swap.module.scss"
import { useCurrency } from "data/settings/Currency"

enum SwapAssetType {
  ASK = "askAsset",
  OFFER = "offerAsset",
}

const SwapForm = () => {
  // Hooks
  const { tokens, getTokensWithBal, getBestRoute, form, getMsgs } = useSwap()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const currency = useCurrency()

  // Form
  // const form = useForm<SwapState>({
  //   mode: "onChange",
  //   defaultValues,
  // })

  // State
  const { watch, getValues, setValue, setError, register } = form
  const [assetModal, setAssetModal] = useState<SwapAssetType | undefined>()
  const [displayTokens, setDisplayTokens] = useState<SwapAssetExtra[]>([])
  const { offerAsset, askAsset, offerInput, route, msgs } = watch()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!offerAsset || !askAsset || !offerInput) return
    const swapState = getValues()
    const fetchRouteAndMsgs = async () => {
      try {
        setIsLoading(true)
        const route = await getBestRoute(swapState)
        const msgs = await getMsgs(swapState)
        console.log("msgs", msgs)
        setValue("msgs", msgs)
        setValue("route", route)
        setIsLoading(false)
      } catch (err: any) {
        console.log("err", err)
        setError("offerInput", { message: err.message })
      }
    }

    fetchRouteAndMsgs()
  }, [offerAsset.denom, askAsset.denom, offerInput])

  // Handlers
  const handleOpenModal = (type: SwapAssetType) => {
    setDisplayTokens(
      type === SwapAssetType.OFFER ? getTokensWithBal(tokens) : tokens
    )
    setAssetModal(type)
  }
  const tokenOnClick = (token: SwapAssetExtra) => {
    if (assetModal) setValue(assetModal as keyof SwapState, token)
    setAssetModal(undefined) // close modal
  }

  const swapAssetsOnClick = () => {
    setValue("askAsset", offerAsset)
    setValue("offerAsset", askAsset)
    setValue("offerInput", route?.amountOut ?? "0")
  }

  const buttonOnClick = async () => {
    navigate("confirm", { state: getValues() })
  }

  const currencyAmount = useMemo(() => {
    const offer = `${currency.symbol} ${(
      offerAsset.price * Number(offerInput)
    ).toString()}`
    const ask = `${currency.symbol} ${toInput(
      Number(route?.amountOut) * askAsset.price,
      askAsset.decimals
    )}`
    return { offer: offer ?? "", ask: ask ?? "" }
  }, [offerAsset, offerInput, askAsset, route, currency])

  return (
    <div className={styles.container}>
      <Modal
        isOpen={!!assetModal}
        onRequestClose={() => setAssetModal(undefined)}
        title="Select Asset"
      >
        <SwapTokenSelector tokenOnClick={tokenOnClick} tokens={displayTokens} />
      </Modal>
      <AssetSelectorFrom
        extra={toInput(offerAsset.balance, offerAsset.decimals)}
        symbol={offerAsset.symbol}
        chainIcon={offerAsset.chain?.icon}
        chainName={offerAsset.chain?.name}
        tokenIcon={offerAsset.icon ?? ""}
        onSymbolClick={() => handleOpenModal(SwapAssetType.OFFER)}
        currencyAmount={currencyAmount.offer}
        amountInputAttrs={{
          ...register("offerInput", {
            // @ts-ignore
            validate: validate.input(
              toInput(offerAsset.balance, offerAsset.decimals),
              offerAsset.decimals
            ),
          }),
        }}
      />
      <RoundedButton
        className={styles.swapper}
        onClick={swapAssetsOnClick}
        variant="secondary"
        icon={<SwapArrows />}
      />
      <AssetSelectorTo
        extra={toInput(askAsset.balance, askAsset.decimals)}
        symbol={askAsset?.symbol}
        chainIcon={askAsset?.chain?.icon}
        chainName={askAsset?.chain?.name}
        tokenIcon={askAsset?.icon ?? ""}
        onSymbolClick={() => handleOpenModal(SwapAssetType.ASK)}
        amount={
          route?.amountOut
            ? toInput(route?.amountOut, askAsset.decimals).toString()
            : "0"
        }
        currencyAmount={currencyAmount.ask}
      />
      <Button
        variant="primary"
        loading={isLoading}
        disabled={!offerInput || isLoading || !route || !msgs.length}
        onClick={buttonOnClick}
        label={t("Continue")}
      />
    </div>
  )
}

export default SwapForm
