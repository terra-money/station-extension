import { AccAddress } from "@terra-money/feather.js"
import { useNetwork } from "data/wallet"
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

      if (isCW20) {
        return networks[from]?.icsChannels?.[to]?.channel
      }

      if (
        icsChannel &&
        networks[to]?.icsChannels?.[from]?.channel === icsChannel
      ) {
        return networks[to]?.icsChannels?.[from]?.otherChannel
      }

      return networks[from]?.channels?.[to]
    },

    getICSContract: ({
      from,
      to,
    }: {
      from: string
      to: string
    }): string | undefined => {
      return networks[from]?.icsChannels?.[to]?.contract
    },
  }
}
