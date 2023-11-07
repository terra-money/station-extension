import { AssetSelectorTo, AssetSelectorFrom, Form } from "station-ui"
import { useSwapTokens } from "data/queries/swap/hook"
import { SwapState } from "data/queries/swap/types"
import { useForm } from "react-hook-form"
import { useSwap } from "./SwapContext"

const SwapForm = () => {
  const { tokens } = useSwap()
  const { watch, register } = useForm<SwapState>({ mode: "onChange" })
  const { offerAsset, askAsset } = watch()
  console.log("tokens", tokens)
  const asset = offerAsset ?? tokens[0]
  // if (!tokens.length) return null

  return (
    <Form>
      <AssetSelectorFrom
        extra={asset.balance}
        symbol={asset.symbol}
        chainIcon={asset.chain?.icon ?? ""}
        chainName={asset.chain?.name ?? ""}
        tokenIcon={asset.icon ?? ""}
        onSymbolClick={() => {}}
        currencyAmount={asset.value.toString()}
        amountInputAttrs={{ ...register("offerAmount") }}
      />
      <AssetSelectorFrom
        extra={asset.balance}
        symbol={asset.symbol}
        chainIcon={asset.chain?.icon ?? ""}
        chainName={asset.chain?.name ?? ""}
        tokenIcon={asset.icon ?? ""}
        onSymbolClick={() => {}}
        currencyAmount={asset.value.toString()}
        amountInputAttrs={{}}
      />
    </Form>
  )
}

export default SwapForm
