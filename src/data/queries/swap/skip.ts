import axios from "axios"
import { SKIP_SWAP_API } from "config/constants"
import {
  SkipTokenResponse,
  SwapAssetBase,
  SwapState,
  RouteInfo,
  SwapVenue,
  SwapOperation,
  SwapSource,
  TimelineMessage,
  OperationType,
} from "./types"
import { InterchainAddresses } from "types/network"
import { IInterchainNetworks } from "data/wallet"
import { isTerraChain } from "utils/chain"

export const skipApi = {
  queryTokens: async () => {
    try {
      const result = await axios.get(SKIP_SWAP_API.routes.tokens, {
        params: {
          include_cw20_assets: true,
        },
        baseURL: SKIP_SWAP_API.baseUrl,
        headers: {
          accept: "application/json",
        },
      })

      const tokens = Object.entries(result.data.chain_to_assets_map).reduce(
        // @ts-ignore
        (acc, [chainId, { assets }]) => {
          const transformedAssets = assets.map((asset: SkipTokenResponse) => ({
            symbol: asset.symbol,
            denom: asset.denom,
            originDenom: asset.origin_denom,
            decimals: asset.decimals,
            icon: asset.logo_uri,
            chainId: chainId,
          }))
          return acc.concat(transformedAssets)
        },
        [] as SwapAssetBase[]
      )
      return tokens
    } catch (err) {
      console.log("Skip Token Error", err)
    }
  },
  queryMsgs: async (swap: SwapState, addresses: InterchainAddresses) => {
    try {
      const { askAsset, offerInput, offerAsset, route, slippageTolerance } =
        swap
      if (!route || !addresses) return
      const params = {
        amount_in: offerInput,
        amount_out: route.amountOut,
        source_asset_denom: offerAsset.denom,
        source_asset_chain_id: offerAsset.chainId,
        dest_asset_denom: askAsset.denom,
        dest_asset_chain_id: askAsset.chainId,
        address_list: route.chainIds.map((chainId) => addresses[chainId]),
        operations: route.operations,
        slippage_tolerance_percent: slippageTolerance.toString(),
      }
      const res = await axios.post(SKIP_SWAP_API.routes.msgs, params, {
        baseURL: SKIP_SWAP_API.baseUrl,
        headers: {
          accept: "application/json",
        },
      })
      if (!res?.data?.msgs) {
        throw new Error("No available swap routes for this pair")
      }
      return res.data.msgs
    } catch (err) {
      throw new Error(`Unknown error`)
    }
  },
  queryRoute: async (swap: SwapState, network: IInterchainNetworks) => {
    try {
      const { askAsset, offerInput, offerAsset } = swap

      const payload: { [key: string]: any } = {
        amount_in: offerInput,
        source_asset_denom: offerAsset.denom,
        source_asset_chain_id: offerAsset.chainId,
        dest_asset_denom: askAsset.denom,
        dest_asset_chain_id: askAsset.chainId,
        cumulative_affiliate_fee_bps: "0",
      }
      const swapOnTerra = [offerAsset.chainId, askAsset.chainId].every(
        isTerraChain
      )

      if (swapOnTerra) {
        payload.swap_venue = {
          name: SwapVenue.ASTROPORT,
          chain_id: offerAsset.chainId,
        }
      }

      const res = await axios.post(SKIP_SWAP_API.routes.route, payload, {
        baseURL: SKIP_SWAP_API.baseUrl,
        headers: {
          accept: "application/json",
        },
      })
      if (!res?.data) throw new Error("No data returned from Skip API")
      if (res.data.txs_required > 1)
        throw new Error(
          `Swap not supported, ${res.data.txs_required} txs required`
        )

      const transformedRouteInfo: RouteInfo = {
        amountIn: res.data.amount_in,
        amountOut: res.data.estimated_amount_out,
        txsRequired: res.data.txs_required,
        source: SwapSource.SKIP,
        chainIds: res.data.chain_ids,
        swapVenue: res.data?.swap_venue?.name as SwapVenue,
        operations: res.data.operations as SwapOperation[],
        timelineMsgs: getTimelineMessages(res.data, swap, network),
      }

      return transformedRouteInfo
    } catch (err) {
      console.log("Skip Route Error", err)
      throw err
    }
  },
}

// UTILS

const getTimelineMessages = (
  route: any,
  swap: SwapState,
  network: IInterchainNetworks
) => {
  let swapsOccured = 0
  const swapsRequired = route.operations.filter(
    (op: any) => Object.keys(op)[0] === "swap"
  ).length


  const timelineMsgs: TimelineMessage[] = route.operations.map(
    // eslint-disable-next-line array-callback-return
    (op: any, i: number) => {
      const type = Object.keys(op)[0] as OperationType
      const swapIn = route.operations[i + 1]?.swap?.swap_in
      const swapOut = route.operations[i + 1]?.swap?.swap_out
      const venue = (swapIn ?? swapOut)?.swap_venue

      if (type === "transfer") {
        const fromChainId = op[type].chain_id
        const toChainId = venue?.chain_id    
          return {
            type,
            symbol: swapsOccured === swapsRequired ? swap.askAsset.symbol : swap.offerAsset.symbol, 
            from: network[fromChainId]?.name ?? "Unknown",
            to: network[toChainId ?? swap.askAsset.chainId]?.name ?? "Unknown", // get final chainId from askAsset or next one in ops
          }
      }

      if (type === "swap") {
        swapsOccured++
        if (venue?.name) {
          return {
            type,
            venue: venue.name as SwapVenue,
            askAssetSymbol: swap.askAsset.symbol,
            offerAssetSymbol: swap.offerAsset.symbol,
          }
        }
      }
    }
  )
  return timelineMsgs.filter(Boolean)
}
