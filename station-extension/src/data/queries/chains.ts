import { AccAddress } from "@terra-money/feather.js"
import { useAllNetworks } from "data/wallet"
import { InterchainNetwork } from "types/network"
import createContext from "utils/createContext"

type Whitelist = Record<
  string,
  {
    token: string
    symbol: string
    name: string
    icon: string
    chains: string[]
    decimals: number
    isAxelar?: boolean
  }
>

type IBCDenoms = Record<
  string,
  Record<
    string,
    {
      token: string
      chain: string
      chainID?: string
      icsChannel?: string
    }
  >
>

export interface WhitelistData {
  whitelist: Record<string, Whitelist>
  ibcDenoms: IBCDenoms
  legacyWhitelist: Whitelist
}

// chains and token withelist are always required from the beginning.
const [useFetchedData, WhitelistProvider] =
  createContext<WhitelistData>("useWhitelist")
export { WhitelistProvider }

export function useWhitelist(): WhitelistData {
  const data = useFetchedData()
  if (!data) return { whitelist: {}, ibcDenoms: {}, legacyWhitelist: {} }
  return data
}

export function getChainNamefromID(
  id: string | undefined,
  chains: Record<string, InterchainNetwork>
) {
  return (
    Object.values(chains ?? {})
      .find(({ chainID }) => chainID === id)
      ?.name.toLowerCase() ?? ""
  )
}

export function getChainIdFromAddress(
  address: string,
  chains: Record<string, InterchainNetwork>
) {
  return (
    Object.values(chains ?? {})
      .find(({ prefix }) => address.includes(prefix))
      ?.chainID.toLowerCase() ?? ""
  )
}

export function useIBCChannels() {
  // the destination netowrk does not need to be enabled in order to send tokens to it
  const networks = useAllNetworks()

  function getICS20(to: string, from: string, token: AccAddress) {
    const channels = networks[from]?.ics20Channels?.[to]
    return (
      // ics20 channel specific for this token
      channels?.find(({ tokens }) => !!tokens?.find((t) => t === token)) ||
      // default ics channel for the chain
      channels?.find(({ tokens }) => !tokens) ||
      // fallback: ics channel from legacy assetlist | TODO: remove when this PR gets merged: https://github.com/terra-money/station-assets/pull/203
      networks[from]?.icsChannels?.[to]
    )
  }

  return {
    getIBCChannel: ({
      from,
      to,
      tokenAddress,
      icsChannel,
    }: {
      from: string
      to: string
      tokenAddress: AccAddress
      icsChannel?: string
    }): string | undefined => {
      const isCW20 = AccAddress.validate(tokenAddress)

      if (isCW20) {
        return getICS20(to, from, tokenAddress)?.channel
      }

      if (
        icsChannel &&
        (networks[to]?.ics20Channels?.[from].find(
          ({ channel }) => channel === icsChannel
        ) ||
          networks[to]?.icsChannels?.[from]?.channel === icsChannel)
      ) {
        return (
          networks[to]?.ics20Channels?.[from].find(
            ({ channel }) => channel === icsChannel
          )?.otherChannel || networks[to]?.icsChannels?.[from]?.otherChannel
        )
      }

      return networks[from]?.channels?.[to]
    },

    getICSContract: ({
      from,
      to,
      tokenAddress,
    }: {
      from: string
      to: string
      tokenAddress: AccAddress
    }): string | undefined => {
      return getICS20(to, from, tokenAddress)?.contract
    },
  }
}
