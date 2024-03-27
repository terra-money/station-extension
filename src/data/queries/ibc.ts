import { useQueries, useQuery } from "react-query"
import { isDenomIBC } from "@terra-money/terra-utils"
import { queryKey, RefetchOptions } from "../query"
import { useInterchainLCDClient } from "./lcdClient"
import { useNetwork } from "data/wallet"
import axios from "axios"
import crypto from "crypto"
import { AccAddress } from "@terra-money/feather.js"
import {
  getLocalSetting,
  setLocalSetting,
  SettingKey,
} from "utils/localStorage"

export const useIBCBaseDenom = (
  denom: Denom,
  chainID: string,
  enabled: boolean
) => {
  const lcd = useInterchainLCDClient()
  const network = useNetwork()

  return useQuery(
    [queryKey.ibc.denomTrace, denom, chainID],
    async () => {
      const { base_denom, path } = await lcd.ibcTransfer.denomTrace(
        denom.replace("ibc/", ""),
        chainID
      )

      const paths = path.split("/")
      const chains = [chainID]
      const channels = []

      for (let i = 0; i < paths.length; i += 2) {
        const chain = chains[0]

        if (!network[chain]?.lcd) return

        const [port, channel] = [paths[i], paths[i + 1]]
        channels.unshift({ port, channel })

        const { data } = await axios.get(
          `/ibc/core/channel/v1/channels/${channel}/ports/${port}/client_state`,
          { baseURL: network[chain].lcd }
        )

        chains.unshift(data.identified_client_state.client_state.chain_id)
      }

      return {
        ibcDenom: denom,
        baseDenom: base_denom.startsWith("cw20:")
          ? base_denom.replace("cw20:", "")
          : base_denom,
        chainIDs: chains,
        channels,
      }
    },
    {
      ...RefetchOptions.INFINITY,
      enabled: isDenomIBC(denom) && !!network[chainID] && enabled,
    }
  )
}

export const useIBCBaseDenoms = (data: { denom: Denom; chainID: string }[]) => {
  const network = useNetwork()
  const lcd = useInterchainLCDClient()

  const fetchDenomTrace = async ({
    denom,
    chainID,
  }: {
    denom: Denom
    chainID: string
  }) => {
    const cachedDenomTraces = getLocalSetting<
      Record<string, { data: any; timestamp: number }>
    >(SettingKey.DenomTrace)
    const oneWeekAgo = 7 * 24 * 60 * 60 * 1000

    if (
      cachedDenomTraces[denom] &&
      Date.now() - cachedDenomTraces[denom].timestamp < oneWeekAgo
    ) {
      console.log(denom, "cached")
      return cachedDenomTraces[denom].data
    }

    const { base_denom, path } = await lcd.ibcTransfer.denomTrace(
      denom.replace("ibc/", ""),
      chainID
    )
    const paths = path.split("/")
    const chains = [chainID]
    const channels = []

    for (let i = 0; i < paths.length; i += 2) {
      if (!network[chainID]?.lcd) return
      const [port, channel] = [paths[i], paths[i + 1]]
      channels.unshift({ port, channel })
      const res = await axios.get(
        `/ibc/core/channel/v1/channels/${channel}/ports/${port}/client_state`,
        { baseURL: network[chainID].lcd }
      )
      chains.unshift(res?.data?.identified_client_state.client_state.chain_id)
    }

    const result = {
      ibcDenom: denom,
      baseDenom: base_denom.startsWith("cw20:")
        ? base_denom.replace("cw20:", "")
        : base_denom.startsWith("factory:")
        ? base_denom.replaceAll(":", "/")
        : base_denom,
      chainIDs: chains,
      channels,
    }

    return result
  }

  const queryResults = useQueries(
    data.map(({ denom, chainID }) => ({
      ...RefetchOptions.INFINITY,
      queryKey: [queryKey.ibc.denomTrace, denom, network],
      queryFn: () => fetchDenomTrace({ denom, chainID }),
      enabled: isDenomIBC(denom) && !!network[chainID],
    }))
  )

  const updatedDenomTraces = queryResults.reduce((acc, result) => {
    if (result.data) {
      const { ibcDenom, ...rest } = result.data
      acc[ibcDenom] = { data: rest, timestamp: Date.now() }
    }
    return acc
  }, {} as Record<string, { data: any; timestamp: number }>)

  setLocalSetting(SettingKey.DenomTrace, {
    ...getLocalSetting<Record<string, { data: any; timestamp: number }>>(
      SettingKey.DenomTrace
    ),
    ...updatedDenomTraces,
  })

  return queryResults
}

export function calculateIBCDenom(baseDenom: string, path: string) {
  if (!path)
    return baseDenom.startsWith("factory:")
      ? baseDenom.replaceAll(":", "/")
      : baseDenom

  const assetString = [
    path,
    AccAddress.validate(baseDenom) ? `cw20:${baseDenom}` : baseDenom,
  ].join("/")
  const hash = crypto.createHash("sha256")
  hash.update(assetString)
  return `ibc/${hash.digest("hex").toUpperCase()}`
}
