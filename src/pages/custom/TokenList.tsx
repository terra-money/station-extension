import { Flex } from "components/layout"
import { Fetching, Empty } from "components/feedback"
import { TokenItemProps } from "./TokenItem"
import styles from "./TokenList.module.scss"
import TokenFilters from "./TokenFilters"
import { Grid, TokenCheckboxListItem } from "station-ui"
import { useNetwork } from "data/wallet"

interface Props<T> extends QueryState {
  results: T[]
  renderTokenItem: (item: T) => TokenItemProps

  /* manage tokens */
  getIsAdded: (item: T) => boolean
  add: (item: T) => void
  remove: (item: T) => void
}

const TokenList = <T extends { symbol: string }>(props: Props<T>) => {
  const { getIsAdded, add, remove, ...rest } = props
  const { results, renderTokenItem, ...state } = rest
  const empty = !state.isLoading && !results.length
  const network = useNetwork()

  return state.error || empty ? (
    <Flex className={styles.results}>
      <Empty />
    </Flex>
  ) : (
    <Fetching {...state} height={2}>
      <TokenFilters />
      <Grid gap={10}>
        {results
          .sort((a, b) => Number(getIsAdded(b)) - Number(getIsAdded(a)))
          .map((i) => {
            const token = renderTokenItem(i)
            const isAdded = getIsAdded(i)
            return (
              <Grid gap={14} key={token.key}>
                <TokenCheckboxListItem
                  symbol={i.symbol}
                  tokenImg={token.icon ?? ""}
                  chain={{
                    label: network[token.chainID ?? ""]?.name,
                    icon: network[token.chainID ?? ""]?.icon,
                  }}
                  checked={isAdded}
                  onClick={isAdded ? () => remove(i) : () => add(i)}
                />
              </Grid>
            )
          })}
      </Grid>
    </Fetching>
  )
}

export default TokenList
