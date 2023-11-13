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
} from "./types"

export const skipApi = {
  queryTokens: async () => {
    try {
      const result = await axios.get(SKIP_SWAP_API.routes.tokens, {
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
  queryRoute: async ({ askAsset, offerAmount, offerAsset }: SwapState) => {
    try {
      const res = await axios.post(
        SKIP_SWAP_API.routes.route,
        {
          amount_in: offerAmount,
          source_asset_denom: offerAsset.denom,
          source_asset_chain_id: offerAsset.chainId,
          dest_asset_denom: askAsset.denom,
          dest_asset_chain_id: askAsset.chainId,
          cumulative_affiliate_fee_bps: "0",
        },
        {
          baseURL: SKIP_SWAP_API.baseUrl,
          headers: {
            accept: "application/json",
          },
        }
      )
      if (!res?.data) throw new Error("No data returned from Skip API")

      const transformedRouteInfo: RouteInfo = {
        amountIn: res.data.amount_in,
        amountOut: res.data.estimated_amount_out,
        txsRequired: res.data.txs_required,
        source: SwapSource.SKIP,
        swapVenue: res.data.swap_venue.name as SwapVenue,
        operations: res.data.operations.map((operation: any) =>
          operation.transfer ? "transfer" : ("swap" as SwapOperation)
        ),
      }

      return transformedRouteInfo
    } catch (err) {
      console.log("Skip Route Error", err)
      throw err
    }
  },
}
