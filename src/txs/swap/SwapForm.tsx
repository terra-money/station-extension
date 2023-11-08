import {
  AssetSelectorTo,
  AssetSelectorFrom,
  Form,
  SubmitButton,
} from "station-ui"
import { SwapState } from "data/queries/swap/types"
import { useForm } from "react-hook-form"
import { useSwap } from "./SwapContext"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"

const SwapForm = () => {
  const { tokens } = useSwap()
  const defaultOfferAsset =
    tokens.find((token) => token.balance > 0) ?? tokens[0]
  const defaultAskAsset = tokens[1]
  const { watch, register, handleSubmit, setValue } = useForm<SwapState>({
    mode: "onChange",
    defaultValues: { offerAsset: defaultOfferAsset, askAsset: defaultAskAsset },
  })
  const { offerAsset, askAsset } = watch()
  const { t } = useTranslation()

  return (
    <Form>
      <AssetSelectorFrom
        extra={toInput(offerAsset?.balance, offerAsset?.decimals)}
        symbol={offerAsset?.symbol}
        chainIcon={offerAsset?.chain?.icon}
        chainName={offerAsset?.chain?.name}
        tokenIcon={offerAsset?.icon ?? ""}
        onSymbolClick={() => {}}
        currencyAmount={offerAsset?.value.toString()}
        amountInputAttrs={{ ...register("offerAmount") }}
      />
      <AssetSelectorTo
        extra={askAsset?.balance}
        symbol={askAsset?.symbol}
        chainIcon={askAsset?.chain?.icon ?? ""}
        chainName={askAsset.chain?.name ?? ""}
        tokenIcon={askAsset.icon ?? ""}
        onSymbolClick={() => {}}
        amount={"Simulating..."}
        currencyAmount={askAsset.value.toString()}
      />
      <SubmitButton label={t("Swap")} />
    </Form>
  )
}

export default SwapForm
