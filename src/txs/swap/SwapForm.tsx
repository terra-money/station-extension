import {
  AssetSelectorTo,
  AssetSelectorFrom,
  Form,
  SubmitButton,
  Modal,
} from "station-ui"
import { useState } from "react"
import { SwapAssetExtra, SwapState } from "data/queries/swap/types"
import { useForm } from "react-hook-form"
import { useSwap } from "./SwapContext"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"
import SwapTokenSelector from "./SwapTokenSelector"

const SwapForm = () => {
  // Hooks
  const { tokens } = useSwap()
  const { t } = useTranslation()

  // Defaults
  const defaultOfferAsset =
    tokens.find((token) => token.balance > 0) ?? tokens[0]
  const defaultAskAsset = tokens[1]

  // Form
  const { watch, register, handleSubmit, setValue } = useForm<SwapState>({
    mode: "onChange",
    defaultValues: { offerAsset: defaultOfferAsset, askAsset: defaultAskAsset },
  })

  // State
  const [assetModal, setAssetModal] = useState<
    "offerAsset" | "askAsset" | undefined
  >("offerAsset")
  const [displayTokens, setDisplayTokens] = useState<SwapAssetExtra[]>(tokens)
  const { offerAsset, askAsset } = watch()

  // Handlers
  const handleOpenModal = (type: "offerAsset" | "askAsset") => {
    setDisplayTokens(
      type === "offerAsset"
        ? tokens.filter((token) => token.balance > 0)
        : tokens
    )
    setAssetModal(type)
  }
  const tokenOnClick = (token: SwapAssetExtra) => {
    if (assetModal) setValue(assetModal, token)
    setAssetModal(undefined) // close modal
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
      <Form>
        <AssetSelectorFrom
          extra={toInput(offerAsset?.balance, offerAsset?.decimals)}
          symbol={offerAsset?.symbol}
          chainIcon={offerAsset?.chain?.icon}
          chainName={offerAsset?.chain?.name}
          tokenIcon={offerAsset?.icon ?? ""}
          onSymbolClick={() => handleOpenModal("offerAsset")}
          currencyAmount={offerAsset?.value.toString()}
          amountInputAttrs={{ ...register("offerAmount") }}
        />
        <AssetSelectorTo
          extra={askAsset?.balance}
          symbol={askAsset?.symbol}
          chainIcon={askAsset?.chain?.icon}
          chainName={askAsset.chain?.name}
          tokenIcon={askAsset.icon ?? ""}
          onSymbolClick={() => handleOpenModal("askAsset")}
          amount={"Simulating..."}
          currencyAmount={askAsset.value.toString()}
        />
        <SubmitButton label={t("Swap")} />
      </Form>
    </>
  )
}

export default SwapForm
