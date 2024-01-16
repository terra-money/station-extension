import { useCW20Contracts, useCW20Whitelist } from "data/Terra/TerraAssets"
import { AccAddress, Coins, ValAddress } from "@terra-money/feather.js"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { WithTokenItem, useNativeDenoms } from "data/token"
import { Fragment, ReactNode, useMemo } from "react"
import { useAddress, useNetwork } from "data/wallet"
import { getChainIDFromAddress } from "utils/bech32"
import { useValidators } from "data/queries/staking"
import { truncate } from "@terra-money/terra-utils"
import { useProposal } from "data/queries/gov"
import { Read } from "components/token"

const ValidatorAddress = ({ children: address }: { children: string }) => {
  const networks = useNetwork()
  const chainID = getChainIDFromAddress(address, networks)
  const { data: validators } = useValidators(chainID ?? "")
  const moniker = validators?.find(
    ({ operator_address }) => operator_address === address
  )?.description.moniker

  return <span>{moniker ?? address}</span>
}

const Address = ({ children: address }: { children: string }) => {
  const { data: contracts } = useCW20Contracts()
  const { data: tokens } = useCW20Whitelist()

  const addresses = useInterchainAddresses() || {}
  const networks = useNetwork()

  const name = useMemo(() => {
    if (
      address ===
      "terra1jwyzzsaag4t0evnuukc35ysyrx9arzdde2kg9cld28alhjurtthq0prs2s"
    ) {
      return "Alliance Hub"
    }

    // If the address is the user's wallet.
    const chainID = Object.keys(addresses).find(
      (key) => addresses[key] === address
    )
    if (chainID) {
      return `my ${networks[chainID].name} wallet`
    }
    if (!(contracts && tokens)) return
    const contract = contracts[address] ?? tokens[address]
    if (!contract) return
    const { protocol, name } = contract
    return [protocol, name].join(" ")
    // eslint-disable-next-line
  }, [address, networks, contracts, tokens])

  return <span>{name ?? truncate(address)}</span>
}

const Tokens = ({ children: coins }: { children: string }) => {
  const list = new Coins(coins).toArray()

  const tokenWords =
    list.length > 1
      ? "multiple tokens" // Do not translate this
      : list.map((coin) => {
          let data = coin.toData()
          const { denom } = data

          return (
            <WithTokenItem token={denom} key={denom}>
              {({ decimals }) => <Read {...data} decimals={decimals} />}
            </WithTokenItem>
          )
        })

  return <span>{tokenWords}</span>
}

interface ProposalProps {
  proposalID: number
  chainID: string
}

const Proposal = (props: ProposalProps) => {
  const { proposalID, chainID } = props

  const { data: proposal } = useProposal(proposalID, chainID)

  const proposalName = proposal?.content?.title
    ? proposal.content.title
    : `Proposal ID ${proposalID}`

  return <span>{proposalName}</span>
}

interface Props {
  children?: string
  className?: string
  chainID?: string
}

const ActivityTxMessage = ({
  children: sentence,
  className,
  chainID,
}: Props) => {
  const address = useAddress()
  const readNativeDenom = useNativeDenoms()
  if (!sentence) return null

  const parse = (word: string, index: number): ReactNode => {
    if (!word) return null
    if (word.endsWith(",")) return <>{parse(word.slice(0, -1), index)},</>

    const voteTypes = ["Yes", "No", "No With Veto", "Abstain"]

    return validateTokens(word) ? (
      <Tokens>{word}</Tokens>
    ) : /^proposal:(\d+)/.exec(word)?.[1] ? (
      <Proposal
        proposalID={parseInt(/^proposal:(\d+)$/.exec(word)?.[1] || "")}
        chainID={chainID || ""}
      />
    ) : ValAddress.validate(word) ? (
      <ValidatorAddress>{word}</ValidatorAddress>
    ) : AccAddress.validate(word) ? (
      <Address>{word}</Address>
    ) : parseFloat(word) ||
      voteTypes.includes(word) ||
      index === 1 ||
      ["IBC", "transfer", "Coinhall", "TFM", "Astroport"].includes(word) ? (
      <span>{word}</span>
    ) : /^ibc\/[0-9A-F]{64}$/g.test(word) ? (
      <span>{readNativeDenom(word).symbol}</span>
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
          const parsed = parse(word, index)

          return !index && index > 0 ? (
            <span key={index}>{parsed}</span>
          ) : (
            <Fragment key={index}> {parsed} </Fragment>
          )
        })}
    </div>
  )
}

export default ActivityTxMessage

/* helpers */
const validateTokens = (tokens: any) => {
  try {
    const coins = new Coins(tokens)
    return !!coins.toArray().length
  } catch {
    return false
  }
}
