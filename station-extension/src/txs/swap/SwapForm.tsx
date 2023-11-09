import {
  AssetSelectorTo,
  AssetSelectorFrom,
  Form,
  SubmitButton,
  Modal,
  Button,
} from "station-ui"
import { useState } from "react"
import { SwapAssetExtra, SwapState, RouteInfo } from "data/queries/swap/types"
import { useForm } from "react-hook-form"
import { useSwap } from "./SwapContext"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"
import SwapTokenSelector from "./SwapTokenSelector"
import { useEffect } from "react"
import { toAmount } from "@terra-money/terra-utils"

enum SwapAssetType {
  ASK = "askAsset",
  OFFER = "offerAsset",
}

const SwapForm = () => {
  // Hooks
  const { tokens, getTokensWithBal, getBestRoute } = useSwap()
  const { t } = useTranslation()

  // Defaults
  const defaultOfferAsset =
    tokens.find((token) => token.balance > 0) ?? tokens[0]

  // Form
  const { watch, register, handleSubmit, setValue, reset, getValues } =
    useForm<SwapState>({
      mode: "onChange",
      defaultValues: { offerAsset: defaultOfferAsset },
    })

  // State
  const [assetModal, setAssetModal] = useState<SwapAssetType | undefined>()
  const [route, setRoute] = useState<RouteInfo | undefined>()
  const [displayTokens, setDisplayTokens] = useState<SwapAssetExtra[]>([])
  const { offerAsset, askAsset, offerAmount } = watch()

  useEffect(() => {
    if (!offerAsset || !askAsset || !offerAmount) return
    const swapState = getValues()
    const amount = toAmount(offerAmount, { decimals: offerAsset.decimals })
    getBestRoute({ ...swapState, offerAmount: Number(amount) }).then(
      (route) => {
        setRoute(route)
      }
    )
  }, [offerAsset, askAsset, offerAmount, getBestRoute, getValues])

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
    reset({
      offerAmount: 0,
      offerAsset: askAsset,
      askAsset: offerAsset,
    })
  }

  return (
    <>
      <Modal
        isOpen={!!assetModal}
        onRequestClose={() => setAssetModal(undefined)}
        title="Select Asset"
      >
        <SwapTokenSelector tokenOnClick={tokenOnClick} tokens={displayTokens} />
      </Modal>
      <Form onSubmit={() => handleSubmit}>
        <AssetSelectorFrom
          extra={toInput(offerAsset.balance, offerAsset.decimals)}
          symbol={offerAsset.symbol}
          chainIcon={offerAsset.chain?.icon}
          chainName={offerAsset.chain?.name}
          tokenIcon={offerAsset.icon ?? ""}
          onSymbolClick={() => handleOpenModal(SwapAssetType.OFFER)}
          currencyAmount={offerAsset.value.toString()}
          amountInputAttrs={{ ...register("offerAmount") }}
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
          variant="secondary"
          onClick={swapAssetsOnClick}
          label={t("Swap Assets")}
        />
        <SubmitButton label={t("Submit")} />
      </Form>
    </>
  )
}

export default SwapForm
