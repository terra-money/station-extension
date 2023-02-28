import { AccAddress } from "@terra-money/feather.js"
import { useNetwork } from "data/wallet"
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
    Object.values(chains)
      .find(({ chainID }) => chainID === id)
      ?.name.toLowerCase() ?? ""
  )
}

export function getChainIdFromAddress(
  address: string,
  chains: Record<string, InterchainNetwork>
) {
  return (
    Object.values(chains)
      .find(({ prefix }) => address.includes(prefix))
      ?.chainID.toLowerCase() ?? ""
  )
}

export function useIBCChannels() {
  const networks = useNetwork()

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

      // from Terra to other chains
      if (networks[from]?.prefix === "terra") {
        // non-CW20 ICS transfer
        if (!!icsChannel && networks[to].ibc?.ics?.fromTerra === icsChannel) {
          return icsChannel
        }
        return isCW20
          ? // CW20 ICS transfer
            networks[to].ibc?.icsFromTerra?.fromTerra
          : // standard IBC transfer
            networks[to].ibc?.fromTerra

        // from other chains to Terra
      } else if (networks[to]?.prefix === "terra") {
        // non-CW20 ICS transfer
        if (
          !!icsChannel &&
          networks[from].ibc?.icsFromTerra?.toTerra === icsChannel
        ) {
          return icsChannel
        }
        return isCW20
          ? // CW20 ICS transfer
            networks[from].ibc?.ics?.toTerra
          : // standard IBC transfer
            networks[from].ibc?.toTerra
      }
    },

    getICSContract: ({
      from,
      to,
    }: {
      from: string
      to: string
    }): string | undefined => {
      if (networks[from]?.prefix === "terra") {
        return networks[to].ibc?.icsFromTerra?.contract
      } else if (networks[to]?.prefix === "terra") {
        return networks[from].ibc?.ics?.contract
      }
    },
  }
}
