import {
  AssetSelectorTo,
  AssetSelectorFrom,
  Form,
  SubmitButton,
  InputWrapper,
  SectionHeader,
  Dropdown,
  FlexColumn,
  TokenSingleChainListItem,
  Input,
  Modal,
} from "station-ui"
import WithSearchInput from "pages/custom/WithSearchInput"
import { useState } from "react"
import { SwapAssetExtra, SwapState } from "data/queries/swap/types"
import { useForm } from "react-hook-form"
import { useSwap } from "./SwapContext"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"
import { useCurrency } from "data/settings/Currency"

const SwapForm = () => {
  // Hooks
  const { tokens } = useSwap()
  const { symbol } = useCurrency()
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
  const [tokenFilter, setTokenFilter] = useState("")
  const { offerAsset, askAsset } = watch()

  useEffect(() => {
    setDisplayTokens(tokens)
  }, [tokenFilter])

  // Handlers
  const handleOpenModal = (type: "offerAsset" | "askAsset") => {
    setDisplayTokens(
      type === "offerAsset"
        ? tokens.filter((token) => token.balance > 0)
        : tokens
    )
    setAssetModal(type)
  }
  const handleTokenClick = (token: SwapAssetExtra) => {
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
        <FlexColumn gap={24} style={{ width: "100%" }}>
          <InputWrapper label="Chains">
            <Dropdown
              options={[
                { value: "terra", label: "Terra" },
                { value: "axelar", label: "Axelar" },
              ]}
              onChange={() => {}}
              value="terra"
            />
          </InputWrapper>

          <SectionHeader title="Tokens" withLine />
          <WithSearchInput gap={8} small label="Search Tokens">
            {(input) => (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  gap: 20,
                  flexDirection: "column",
                }}
              >
                {displayTokens
                  .filter((tokens) => {
                    return (
                      tokens.symbol
                        .toLowerCase()
                        .includes(input.toLowerCase()) ||
                      tokens.chain?.name
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    )
                  })
                  .map((token) => (
                    <TokenSingleChainListItem
                      key={token.denom}
                      amountNode={toInput(token.balance, token.decimals)}
                      priceNode={
                        token.price === 0
                          ? "—"
                          : symbol + " " + token.price.toFixed(2)
                      }
                      symbol={token.symbol}
                      chain={{
                        label: token.chain?.name ?? "",
                        icon: token.chain?.icon ?? "",
                      }}
                      tokenImg={token.icon ?? ""}
                      onClick={() => handleTokenClick(token)}
                    />
                  ))}
              </div>
            )}
          </WithSearchInput>
        </FlexColumn>
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
