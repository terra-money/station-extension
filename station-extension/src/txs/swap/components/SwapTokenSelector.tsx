import {
  InputWrapper,
  SectionHeader,
  Dropdown,
  Grid,
  TokenSingleChainListItem,
} from "@terra-money/station-ui"
import WithSearchInput from "pages/custom/WithSearchInput"
import { SwapAssetExtra } from "data/queries/swap/types"
import { useTranslation } from "react-i18next"
import { toInput } from "txs/utils"
import { useCurrency } from "data/settings/Currency"
import { useState } from "react"
import { useNetwork } from "data/wallet"
import { ChainID } from "types/network"
import { Read } from "components/token"
import { FlexColumn } from "components/layout"

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
    <FlexColumn gap={24}>
      <InputWrapper label={t("Chains")}>
        <Dropdown
          options={dropdownOptions}
          onChange={(value) => setChainFilter(value)}
          value={chainFilter}
        />
      </InputWrapper>
      <SectionHeader title={t("Tokens")} withLine />
      <WithSearchInput gap={16} small label={t("Search tokens...")}>
        {(input) => (
          <Grid gap={20}>
            {tokens
              .filter((t) => {
                return (
                  t.symbol.toLowerCase().includes(input.toLowerCase()) ||
                  t.chain?.name.toLowerCase().includes(input.toLowerCase())
                )
              })
              .filter((t) => t.chainId === chainFilter || chainFilter === "all")
              .sort((a, b) => b.value - a.value)
              .map((token) => (
                <TokenSingleChainListItem
                  key={token.denom + token.chainId}
                  amountNode={toInput(token.balance, token.decimals)}
                  priceNode={
                    token.price === 0 ? (
                      "—"
                    ) : (
                      <>
                        {symbol}{" "}
                        <Read amount={token.value} decimals={0} fixed={2} />
                      </>
                    )
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
          </Grid>
        )}
      </WithSearchInput>
    </FlexColumn>
  )
}

export default SwapTokenSelector
