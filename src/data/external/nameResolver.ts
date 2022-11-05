import { useQuery } from "react-query"
import { queryKey, RefetchOptions } from "../query"
import { useLCDClient } from "../queries/lcdClient"
import { useTerraContracts } from "../Terra/TerraAssets"
import { resolveLnsAddress, resolveLnsName } from "./lns"
import { resolveTnsAddress, resolveTnsName } from "./tns"
import { useNetworkName } from "../wallet"

export function isValidName(name?: string | undefined): boolean {
  return (
    name !== undefined &&
    (name.endsWith(".ust") || name.endsWith(".luna") || name.endsWith(".lunc"))
  )
}

/**
 * Resolve terra address from a domain name.
 *
 * @param name - A identifier such as "alice.ust"
 * @returns The terra address of the specified name, null if not resolvable
 */
export const useResolveAddress = (name: string) => {
  const lcd = useLCDClient()
  const { data: contracts } = useTerraContracts()

  return useQuery(
    [queryKey.TNS, name],
    async () => {
      if (name.endsWith(".luna")) {
        return resolveLnsAddress(lcd, "luna", name)
      }

      if (name.endsWith(".lunc")) {
        return resolveLnsAddress(lcd, "lunc", name)
      }

      if (name.endsWith(".ust")) {
        return resolveTnsAddress(lcd, contracts, name)
      }
    },
    {
      ...RefetchOptions.INFINITY,
      enabled: isValidName(name),
    }
  )
}

/**
 * Resolve name from a terra address.
 *
 * @param address - A terra address
 * @returns The name of the specified address, null if not resolvable
 */
export const useResolveName = (address: string) => {
  const lcd = useLCDClient()
  const { data: contracts } = useTerraContracts()
  const networkName = useNetworkName()

  return useQuery(
    [queryKey.TNS, address],
    async () => {
      let name = await resolveLnsName(lcd, networkName, address)
      if (name) {
        return name
      }
      return resolveTnsName(lcd, contracts, address)
    },
    {
      ...RefetchOptions.INFINITY,
      enabled: Boolean(contracts),
    }
  )
}
