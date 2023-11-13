import {
  InputWrapper,
  SectionHeader,
  Dropdown,
  FlexColumn,
  TokenSingleChainListItem,
} from "station-ui"
import WithSearchInput from "pages/custom/WithSearchInput"
import { SwapAssetExtra } from "data/queries/swap/types"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"
import { useCurrency } from "data/settings/Currency"
import { useState } from "react"
import { useNetwork } from "data/wallet"
import { ChainID } from "types/network"

interface Props {
  tokenOnClick: (token: SwapAssetExtra) => void
  tokens: SwapAssetExtra[]
}

const SwapTokenSelector = ({ tokens, tokenOnClick }: Props) => {
  const { symbol } = useCurrency()
  const { t } = useTranslation()
  const network = useNetwork()

  const [chainFilter, setChainFilter] = useState<ChainID | "all">("all")

  const dropdownOptions = [
    { label: "All", value: "all" },
    ...Object.values(network).map((chain) => ({
      label: chain.name,
      value: chain.chainID,
    })),
  ]

  return (
    <FlexColumn gap={24} style={{ width: "100%" }}>
      <InputWrapper label={t("Chains")}>
        <Dropdown
          options={dropdownOptions}
          onChange={(value) => setChainFilter(value)}
          value={chainFilter}
        />
      </InputWrapper>
      <SectionHeader title={t("Tokens")} withLine />
      <WithSearchInput gap={8} small label={t("Search tokens...")}>
        {(input) => (
          <div
            style={{
              width: "100%",
              display: "flex",
              gap: 20,
              flexDirection: "column",
            }}
          >
            {tokens
              .filter((t) => {
                return (
                  t.symbol.toLowerCase().includes(input.toLowerCase()) ||
                  t.chain?.name.toLowerCase().includes(input.toLowerCase())
                )
              })
              .filter((t) => {
                if (chainFilter === "all") return true
                return t.chainId === chainFilter
              })
              .map((token) => (
                <TokenSingleChainListItem
                  key={token.denom + token.chainId}
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
                  onClick={() => tokenOnClick(token)}
                />
              ))}
          </div>
        )}
      </WithSearchInput>
    </FlexColumn>
  )
}

export default SwapTokenSelector
