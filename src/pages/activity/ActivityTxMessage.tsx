import { AccAddress, Coin, Coins, ValAddress } from "@terra-money/feather.js"
import { useCW20Contracts, useCW20Whitelist } from "data/Terra/TerraAssets"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { isDenom, truncate } from "@terra-money/terra-utils"
import { useAddress, useNetwork } from "data/wallet"
import { getChainIDFromAddress } from "utils/bech32"
import { Fragment, ReactNode, useMemo } from "react"
import { useValidators } from "data/queries/staking"
import { FinderLink } from "components/general"
import { useProposal } from "data/queries/gov"
import { WithTokenItem } from "data/token"
import { Read } from "components/token"

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

            return (
              <WithTokenItem token={data.denom} key={denom}>
                {({ decimals }) => <Read {...data} decimals={decimals} />}
              </WithTokenItem>
            )
          })}
    </>
  )
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

  const link =
    chainID && proposalID
      ? `https://station.terra.money/proposal/${chainID}/${proposalID}`
      : "https://station.terra.money/gov"

  return <FinderLink link={link}>{proposalName}</FinderLink>
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
  if (!sentence) return null

  const parse = (word: string, index: number): ReactNode => {
    if (!word) return null
    if (word.endsWith(",")) return <>{parse(word.slice(0, -1), index)},</>

    const voteTypes = ["Yes", "No", "No With Veto", "Abstain"]

    return validateTokens(word) ? (
      <span>
        <Tokens>{word}</Tokens>
      </span>
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
  const validate = ({ denom }: Coin) =>
    isDenom(denom) ||
    AccAddress.validate(denom) ||
    denom.startsWith("stu") ||
    ["inj", "aarch"].includes(denom)

  try {
    const coins = new Coins(tokens)
    return coins.toArray().every(validate)
  } catch {
    return false
  }
}
