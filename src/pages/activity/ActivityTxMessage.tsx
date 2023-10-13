import { ReactNode, useMemo } from "react"
import { capitalize } from "@mui/material"
import { isDenom, truncate } from "@terra-money/terra-utils"
import { AccAddress, Coin, Coins, ValAddress } from "@terra-money/feather.js"
import { useAddress, useNetwork } from "data/wallet"
import { useValidators } from "data/queries/staking"
import { WithTokenItem } from "data/token"
import { useCW20Contracts, useCW20Whitelist } from "data/Terra/TerraAssets"
import { FinderLink } from "components/general"
import { Read } from "components/token"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { getChainIDFromAddress } from "utils/bech32"

const ValidatorAddress = ({ children: address }: { children: string }) => {
  const networks = useNetwork()
  const chainID = getChainIDFromAddress(address, networks)
  const { data: validators } = useValidators(chainID ?? "")
  const moniker = validators?.find(
    ({ operator_address }) => operator_address === address
  )?.description.moniker

  return (
    <FinderLink value={address} short={!moniker} validator>
      {moniker ?? address}
    </FinderLink>
  )
}

const TerraAddress = ({ children: address }: { children: string }) => {
  const { data: contracts } = useCW20Contracts()
  const { data: tokens } = useCW20Whitelist()
  const addresses = useInterchainAddresses()

  const name = useMemo(() => {
    if (addresses && Object.values(addresses ?? {}).includes(address))
      return "my wallet" // Do not translate this
    if (!(contracts && tokens)) return
    const contract = contracts[address] ?? tokens[address]
    if (!contract) return
    const { protocol, name } = contract
    return [protocol, name].join(" ")
  }, [address, addresses, contracts, tokens])

  return <FinderLink value={address}>{name ?? truncate(address)}</FinderLink>
}

const Tokens = ({ children: coins }: { children: string }) => {
  const list = new Coins(coins).toArray()

  return (
    <>
      {list.length > 1
        ? "multiple tokens" // Do not translate this
        : list.map((coin) => {
            const data = coin.toData()
            const { denom } = data
            // TODO: remove this when getCanonicalMsgs() is updated
            if (denom !== "uluna" && denom.endsWith("uluna")) {
              data.denom = denom.slice(0, -5)
            }

            return (
              <WithTokenItem token={data.denom} key={denom}>
                {({ decimals }) => <Read {...data} decimals={decimals} />}
              </WithTokenItem>
            )
          })}
    </>
  )
}

interface Props {
  children?: string
  className?: string
}

const ActivityTxMessage = ({ children: sentence, className }: Props) => {
  const address = useAddress()
  if (!sentence) return null

  const parse = (word: string, index: number): ReactNode => {
    if (!word) return null
    if (word.endsWith(",")) return <>{parse(word.slice(0, -1), index)},</>

    return validateTokens(word) ? (
      <span>
        <Tokens>{word}</Tokens>
      </span>
    ) : ValAddress.validate(word) ? (
      <ValidatorAddress>{word}</ValidatorAddress>
    ) : AccAddress.validate(word) ? (
      <TerraAddress>{word}</TerraAddress>
    ) : !index ? (
      capitalize(word)
    ) : (
      word
    )
  }

  return (
    <div className={className}>
      {sentence
        .split(" ")
        .filter((word, index) => index || word !== address)
        .map((word, index) => {
          console.log("WORD", word, !index)
          const parsed = parse(word, index)

          return !index && index > 0 ? (
            <span key={index}>{parsed}</span>
          ) : (
            <> {parsed} </>
          )
        })}
    </div>
  )
}

export default ActivityTxMessage

/* helpers */
const validateTokens = (tokens: any) => {
  const validate = ({ denom }: Coin) =>
    isDenom(denom) || AccAddress.validate(denom)

  try {
    const coins = new Coins(tokens)
    return coins.toArray().every(validate)
  } catch {
    return false
  }
}
