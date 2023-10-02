import { useCallback } from "react"
import {
  CreateTxOptions,
  Fee,
  Msg,
  SignatureV2,
  Tx,
} from "@terra-money/feather.js"
import { useChainID, useNetwork } from "data/wallet"
import { isNil } from "ramda"
import browser from "webextension-polyfill"

/* primitive */
export interface PrimitiveDefaultRequest {
  id: number
  origin: string
}

interface Token {
  token: string
  symbol: string
  name: string
  icon: string
  decimals: number
}

export interface SuggestChainRequest extends PrimitiveDefaultRequest {
  network: "mainnet" | "testnet"
  chain: {
    chainID: string
    lcd: string
    gasAdjustment: number
    gasPrices: Record<string, number>
    prefix: string
    coinType: "118" | "330"
    baseAsset: string
    name: string
    icon: string
    explorer?: {
      address: string
      tx: string
      validator: string
      block: string
    }
    tokens: Token[]
  }
  success?: boolean
}

export interface SwitchNetworkRequest extends PrimitiveDefaultRequest {
  network: "mainnet" | "testnet" | "classic" | "localterra"
  error?: { message: string }
  success?: boolean
}

export interface PrimitiveTxRequest
  extends Partial<TxResponse>,
    PrimitiveDefaultRequest {
  msgs: string[]
  chainID?: string
  fee?: string
  memo?: string
  signMode?: SignatureV2.SignMode
}

export interface PrimitiveSignBytesRequest
  extends Partial<TxResponse>,
    PrimitiveDefaultRequest {
  bytes: string
}

export interface ExtensionStorage {
  connect?: { allowed: string[]; request: string[] }
  sign?: (PrimitiveTxRequest | PrimitiveSignBytesRequest)[]
  post?: PrimitiveTxRequest[]
  pubkey?: string // hostname
  suggestChain?: SuggestChainRequest[]
  switchNetwork?: SwitchNetworkRequest[]
}

/* app */
export interface ConnectRequest {
  origin: string
}

export interface DefaultRequest extends PrimitiveDefaultRequest {
  timestamp: Date
}

export type RequestType = "sign" | "post" | "signBytes"

export interface TxRequest extends DefaultRequest {
  tx: CreateTxOptions
  requestType: "sign" | "post"
  signMode?: SignatureV2.SignMode
}

export interface SignBytesRequest extends DefaultRequest {
  bytes: Buffer
  requestType: "signBytes"
}

/* response */
export interface TxResponse<T = any> {
  success: boolean
  result?: T
  error?: { code: number; message?: string }
}

/* utils */
export const isSign = (
  request: PrimitiveTxRequest | PrimitiveSignBytesRequest
): request is PrimitiveTxRequest => "msgs" in request

export const isBytes = (
  request: PrimitiveTxRequest | PrimitiveSignBytesRequest
): request is PrimitiveSignBytesRequest => "bytes" in request

/* parse */
export const parseDefault = (
  request: PrimitiveDefaultRequest
): DefaultRequest => {
  return { ...request, timestamp: new Date(request.id) }
}

export const useParseTx = () => {
  // for lecacy support
  const defaultChainID = useChainID()
  const networks = useNetwork()

  return useCallback(
    (request: PrimitiveTxRequest): TxRequest["tx"] => {
      const { msgs, fee, memo, chainID } = request
      const isProto = "@type" in JSON.parse(msgs[0])
      const shouldOverrideClassic =
        isProto &&
        msgs.some((msg) => {
          const parsed = JSON.parse(msg)
          return (
            parsed["@type"] === "/cosmwasm.wasm.v1.MsgExecuteContract" &&
            parsed.msg
          )
        })

      return isProto
        ? {
            msgs: msgs.map((msg) =>
              Msg.fromData(
                JSON.parse(msg),
                shouldOverrideClassic
                  ? false
                  : networks[chainID ?? defaultChainID].isClassic
              )
            ),
            fee: fee ? Fee.fromData(JSON.parse(fee)) : undefined,
            memo,
            chainID: chainID ?? defaultChainID,
          }
        : {
            msgs: msgs.map((msg) =>
              Msg.fromAmino(
                JSON.parse(msg),
                networks[chainID ?? defaultChainID].isClassic
              )
            ),
            fee: fee ? Fee.fromAmino(JSON.parse(fee)) : undefined,
            memo,
            chainID: chainID ?? defaultChainID,
          }
    },
    [defaultChainID, networks]
  )
}

export const parseBytes = (
  request: PrimitiveSignBytesRequest
): SignBytesRequest["bytes"] => {
  const { bytes } = request
  return Buffer.from(bytes, "base64")
}

export const toData = (result: any, isClassic?: boolean) => {
  return result instanceof Tx ? result.toData(isClassic) : result
}

/* helpers */
export const getIsNativeMsgFromExternal = (origin: string) => {
  return (msg: Msg) => {
    // TODO: fix that
    if (origin.includes("https://station.money")) return false
    const type = msg.toData()["@type"]
    return type !== "/terra.wasm.v1beta1.MsgExecuteContract"
  }
}

export const getIsDangerousTx = ({ msgs }: CreateTxOptions) =>
  msgs.some((msg) => {
    const data = msg.toData()
    return data["@type"] === "/cosmos.authz.v1beta1.MsgGrant"
  })

export async function incomingRequest() {
  // Requests from storage
  // except for that is already success or failure
  return new Promise<boolean>((resolve) => {
    browser.storage?.local
      .get(["connect", "post", "sign"])
      .then((storage: ExtensionStorage) => {
        const { connect = { allowed: [], request: [] } } = storage
        const { sign = [], post = [] } = storage
        const [connectRequest] = connect.request
        const signRequests = sign.filter(({ success }) => isNil(success))
        const postRequest = post.find(({ success }) => isNil(success))
        const signRequest = signRequests.find(isSign)
        const bytesRequest = signRequests.find(isBytes)

        return resolve(
          !!(connectRequest || postRequest || signRequest || bytesRequest)
        )
      })
  })
}
