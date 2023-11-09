import { TokenData as SquidToken } from "@0xsquid/sdk/dist/types"
import axios from "axios"
import { SQUID_SWAP_API } from "config/constants"
import { SwapAssetBase } from "./types"

export const squidApi = {
  queryTokens: async () => {
    try {
      const result = await axios.get(SQUID_SWAP_API.routes.tokens, {
        baseURL: SQUID_SWAP_API.baseUrl,
        headers: { "x-integrator-id": SQUID_SWAP_API.integrationID },
      })
      const tokens = result.data.tokens
        .filter((token: SquidToken) => token.ibcDenom) // ignore eth assets
        .map((token: SquidToken) => ({
          symbol: token.symbol,
          denom: token.ibcDenom,
          originDenom: token.address,
          decimals: token.decimals,
          icon: token.logoURI,
          chainId: token.chainId,
        }))
      return tokens as SwapAssetBase[]
    } catch (err) {
      console.log("Squid Token Error", err)
    }
  },
}
