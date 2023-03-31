import { useCallback, useEffect } from "react"
import {
  CreateTxOptions,
  Fee,
  GenericAuthorization,
  Msg,
  MsgGrantAuthorization,
  Tx,
} from "@terra-money/feather.js"
import { useChainID, useNetwork } from "data/wallet"
import { isNil } from "ramda"
import extension from "extensionizer"
import { useMsgGrantAuthorization } from "data/Terra/TerraAssets"

/* primitive */
export interface PrimitiveDefaultRequest {
  id: number
  origin: string
}

export interface PrimitiveTxRequest
  extends Partial<TxResponse>,
    PrimitiveDefaultRequest {
  msgs: string[]
  chainID?: string
  fee?: string
  memo?: string
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
      return isProto
        ? {
            msgs: msgs.map((msg) =>
              Msg.fromData(
                JSON.parse(msg),
                networks[chainID ?? defaultChainID].isClassic
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
    if (origin.includes("https://station.terra.money")) return false
    const type = msg.toData()["@type"]
    return type !== "/terra.wasm.v1beta1.MsgExecuteContract"
  }
}

export const useIsDangerousTx = (msgs: Msg[]) => {
  let msgGrantType = "/cosmos.authz.v1beta1.MsgGrant"
  let hasDangerous = msgs.some((msg) => {
    const data = msg.toData()
    return data["@type"] === msgGrantType
  })

  // only conditionally load the grant authorization when it has a dangerous tx
  const { data: allowedGrants = {} } = useMsgGrantAuthorization(!hasDangerous)

  if (hasDangerous) {
    let genericAuthorizationType = "/cosmos.authz.v1beta1.GenericAuthorization"
    hasDangerous = msgs.some((msg) => {
      let data = msg.toData()
      if (data["@type"] === msgGrantType) {
        let msgGrant = data as MsgGrantAuthorization.Data
        let allowedGrant =
          allowedGrants[msgGrant.grantee] ?? allowedGrants[msgGrant.granter]

        if (allowedGrant) {
          let authorization = msgGrant.grant.authorization
          let authorizationType = authorization["@type"]

          if (!allowedGrant.types.includes(authorizationType)) {
            return true
          }

          if (authorizationType === genericAuthorizationType) {
            let genericAuth = authorization as GenericAuthorization.Data

            if (!allowedGrant.msgs.includes(genericAuth.msg)) {
              // if the msg is not whitelisted -> isDangerous
              // example msgs: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward", "/cosmwasm.wasm.v1.MsgExecuteContract"
              return true
            }
          }
        } else {
          // not whitelisted grant -> isDangerous
          return true
        }
      }

      return false
    })
  }

  return hasDangerous
}

export async function incomingRequest() {
  // Requests from storage
  // except for that is already success or failure
  return new Promise<boolean>((resolve) => {
    extension.storage?.local.get(
      ["connect", "post", "sign"],
      (storage: ExtensionStorage) => {
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
      }
    )
  })
}
