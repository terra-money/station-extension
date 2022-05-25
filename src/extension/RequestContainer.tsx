import { PropsWithChildren, useEffect, useState } from "react"
import extension from "extensionizer"
import { isNil, uniq, update } from "ramda"
import createContext from "utils/createContext"
import encrypt from "auth/scripts/encrypt"
import { ExtensionStorage, PrimitiveDefaultRequest } from "./utils"
import { ConnectRequest, RequestType, TxRequest } from "./utils"
import { SignBytesRequest, TxResponse } from "./utils"
import { isBytes, isSign } from "./utils"
import { parseBytes, parseDefault, parseTx, toData } from "./utils"

interface RequestContext {
  requests: {
    connect?: ConnectRequest
    tx?: TxRequest | SignBytesRequest
  }
  actions: {
    connect: (origin: string, allow: boolean) => void
    tx: (
      requestType: RequestType,
      request: PrimitiveDefaultRequest,
      response: TxResponse,
      password?: string
    ) => void
    multisigTx: (request: PrimitiveDefaultRequest) => void
  }
}

export const [useRequest, RequestProvider] =
  createContext<RequestContext>("useRequest")

const RequestContainer = ({ children }: PropsWithChildren<{}>) => {
  const [connect, setConnect] = useState<ConnectRequest>()
  const [tx, setTx] = useState<TxRequest | SignBytesRequest>()

  useEffect(() => {
    // Requests from storage
    // except for that is already success or failure
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

        if (connectRequest) {
          setConnect({ origin: connectRequest })
        } else if (postRequest) {
          setTx({
            ...parseDefault(postRequest),
            tx: parseTx(postRequest),
            requestType: "post",
          })
        } else if (signRequest) {
          setTx({
            ...parseDefault(signRequest),
            tx: parseTx(signRequest),
            requestType: "sign",
          })
        } else if (bytesRequest) {
          setTx({
            ...parseDefault(bytesRequest),
            bytes: parseBytes(bytesRequest),
            requestType: "signBytes",
          })
        }
      }
    )
  }, [])

  /* connect */
  const handleConnect = (origin: string, allow: boolean) => {
    // Store allowed origin list
    // Delete on reject
    extension.storage?.local.get(["connect"], ({ connect = { allowed: [] } }) =>
      extension.storage?.local.set(
        {
          connect: {
            request: [],
            allowed: uniq(
              allow ? [...connect.allowed, origin] : connect.allowed
            ),
          },
        },
        () => setConnect(undefined)
      )
    )
  }

  /* post | sign */
  const handleTx: RequestContext["actions"]["tx"] = (
    requestType,
    request,
    response,
    password
  ) => {
    const timestamp = Date.now()
    extension.storage?.local.set({
      timestamp: password ? timestamp : null,
      encrypted: password ? encrypt(password, String(timestamp)) : null,
    })

    // Store response on storage
    const type = requestType === "signBytes" ? "sign" : requestType
    extension.storage?.local.get([type], (storage: ExtensionStorage) => {
      const list = storage[type] || []
      const index = list.findIndex(
        ({ id, origin }) => id === request.id && origin === request.origin
      )

      const result = toData(response.result)
      const next = update(index, { ...list[index], ...response, result }, list)
      extension.storage?.local.set({ [type]: next }, () => setTx(undefined))
    })
  }

  /* multisig */
  const handleMultisigTx = (request: PrimitiveDefaultRequest) => {
    // Delete request
    extension.storage?.local.get(["post"], (storage: ExtensionStorage) => {
      const list = storage.post || []
      const next = list.filter(
        ({ id, origin }) => !(id === request.id && origin === request.origin)
      )

      extension.storage?.local.set({ post: next }, () => setTx(undefined))
    })
  }

  /* context */
  const requests = { connect, tx }
  const actions = {
    connect: handleConnect,
    tx: handleTx,
    multisigTx: handleMultisigTx,
  }

  return (
    <RequestProvider value={{ requests, actions }}>{children}</RequestProvider>
  )
}

export default RequestContainer
