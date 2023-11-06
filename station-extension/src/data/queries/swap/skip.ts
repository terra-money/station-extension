import axios from "axios"
import { SKIP_SWAP_API } from "config/constants"
import { SkipTokenResponse, SwapAsset } from "./types"

export const querySkipTokens = async () => {
  try {
    const result = await axios.get(SKIP_SWAP_API.routes.tokens, {
      baseURL: SKIP_SWAP_API.baseUrl,
      headers: {
        accept: "application/json",
      },
    })

    let tokens: SwapAsset[] = []
    // @ts-ignore
    Object.entries(result.data.chain_to_assets_map).forEach(
      ([chainId, { assets }]) => {
        assets.forEach((asset: SkipTokenResponse) => {
          tokens.push({
            symbol: asset.symbol,
            denom: asset.denom,
            originDenom: asset.origin_denom,
            decimals: asset.decimals,
            icon: asset.logo_uri,
            chainId: chainId,
          })
        })
      }
    )

    return tokens as SwapAsset[]
  } catch (err) {
    console.log("Skip Token Error", err)
  }
}
