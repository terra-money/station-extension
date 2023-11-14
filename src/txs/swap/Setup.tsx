import {
  AssetSelectorTo,
  AssetSelectorFrom,
  Modal,
  Button,
  RoundedButton,
} from "station-ui"
import { useState } from "react"
import { SwapAssetExtra, SwapState, RouteInfo } from "data/queries/swap/types"
import { useForm } from "react-hook-form"
import { useSwap } from "./SwapContext"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"
import SwapTokenSelector from "./components/SwapTokenSelector"
import { useEffect } from "react"
import { toAmount } from "@terra-money/terra-utils"
import validate from "txs/validate"
import { useNavigate } from "react-router-dom"
import { ReactComponent as SwapArrows } from "styles/images/icons/SwapArrows.svg"
import styles from "./Swap.module.scss"

enum SwapAssetType {
  ASK = "askAsset",
  OFFER = "offerAsset",
}

const SwapForm = () => {
  // Hooks
  const { tokens, getTokensWithBal, getBestRoute, defaultValues } = useSwap()
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Form
  const form = useForm<SwapState>({
    mode: "onChange",
    defaultValues,
  })

  // State
  const { watch, getValues, setValue, setError, register } = form
  const [assetModal, setAssetModal] = useState<SwapAssetType | undefined>()
  const [displayTokens, setDisplayTokens] = useState<SwapAssetExtra[]>([])
  const { offerAsset, askAsset, offerAmount, route } = watch()

  useEffect(() => {
    if (!offerAsset || !askAsset || !offerAmount) return
    const swapState = getValues()
    const amount = toAmount(offerAmount, { decimals: offerAsset.decimals })
    const fetchRoute = async () => {
      try {
        const route = await getBestRoute({ ...swapState, offerAmount: amount })
        setValue("route", route)
      } catch (err) {
        console.log("err", err)
      }
    }

    fetchRoute()
  }, [
    offerAsset,
    askAsset,
    offerAmount,
    getBestRoute,
    getValues,
    setValue,
    setError,
  ])

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
    setValue("offerAmount", route?.amountOut ?? "0")
  }

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
        currencyAmount={offerAsset.value.toString()}
        amountInputAttrs={{
          ...register("offerAmount", {
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
        extra={askAsset?.balance}
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
        currencyAmount={askAsset?.value?.toString()}
      />
      <Button
        variant="primary"
        onClick={() => navigate("confirm", { state: getValues() })}
        label={t("Continue")}
      />
    </div>
  )
}

export default SwapForm
