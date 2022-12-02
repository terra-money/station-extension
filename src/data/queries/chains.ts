import { useNetwork } from "data/wallet"
import createContext from "utils/createContext"

interface Chains {
  chains: Record<
    "mainnet" | "testnet",
    Record<
      string,
      {
        chainID: string
        lcd: string
        gasAdjustment: number
        gasPrices: Record<string, number>
        prefix: string
        baseAsset: string
        name: string
        icon: string
        ibc?: {
          toTerra: string
          fromTerra: string
        }
      }
    >
  >
  whitelist: Record<
    string,
    {
      token: string
      symbol: string
      name: string
      icon: string
      chains: string[]
      decimals: number
    }
  >
}

// chains and token withelist are always required from the beginning.
const [useFetchedData, ChainsProvider] = createContext<Chains>("useChains")
export { ChainsProvider }

export function useWhitelist(): Chains["whitelist"] {
  const data = useFetchedData()
  if (!data) return {}

  return data.whitelist
}

export function useIBCChannels() {
  const network = useNetwork()

  return function getIBCChannel({
    from,
    to,
  }: {
    from: string
    to: string
  }): string {
    if (network[from].name === "Terra") {
      return network[to].ibc?.fromTerra ?? ""
    } else if (network[to].name === "Terra") {
      return network[from].ibc?.toTerra ?? ""
    } else {
      // one of the 2 chains MUST be Terra
      return ""
    }
  }
}
