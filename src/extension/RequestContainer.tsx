import { PropsWithChildren, useEffect, useState } from "react"
import extension from "extensionizer"
import { isNil, uniq, update } from "ramda"
import createContext from "utils/createContext"
import encrypt from "auth/scripts/encrypt"
import {
  ExtensionStorage,
  PrimitiveDefaultRequest,
  SuggestChainRequest,
} from "./utils"
import { ConnectRequest, RequestType, TxRequest } from "./utils"
import { SignBytesRequest, TxResponse } from "./utils"
import { isBytes, isSign } from "./utils"
import { parseBytes, parseDefault, useParseTx, toData } from "./utils"
import { useChainID, useNetwork } from "data/wallet"

interface RequestContext {
  requests: {
    connect?: ConnectRequest
    tx?: TxRequest | SignBytesRequest
    pubkey?: string
    chain?: SuggestChainRequest
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
    pubkey: () => void
    chain: (request: SuggestChainRequest, success: boolean) => void
  }
}

export const [useRequest, RequestProvider] =
  createContext<RequestContext>("useRequest")

const RequestContainer = ({ children }: PropsWithChildren<{}>) => {
  const [connect, setConnect] = useState<ConnectRequest>()
  const [pubkey, setPubkey] = useState<string>()
  const [chain, setChain] = useState<SuggestChainRequest>()
  const [tx, setTx] = useState<TxRequest | SignBytesRequest>()
  const parseTx = useParseTx()
  const networks = useNetwork()
  const defaultChainID = useChainID()

  useEffect(() => {
    // Requests from storage
    // except for that is already success or failure
    extension.storage?.local.get(
      ["connect", "pubkey", "post", "sign", "suggestChain"],
      (storage: ExtensionStorage) => {
        const { connect = { allowed: [], request: [] } } = storage
        const { sign = [], post = [] } = storage
        const [connectRequest] = connect.request
        const signRequests = sign.filter(({ success }) => isNil(success))
        const postRequest = post.find(({ success }) => isNil(success))
        const signRequest = signRequests.find(isSign)
        const bytesRequest = signRequests.find(isBytes)
        const suggestChainRequest = storage.suggestChain?.filter(
          ({ success }) => isNil(success)
        )[0]

        if (connectRequest) {
          setConnect({ origin: connectRequest })
        } else if (storage.pubkey) {
          setPubkey(storage.pubkey)
        } else if (suggestChainRequest) {
          setChain(suggestChainRequest)
        } else if (postRequest) {
          setTx({
            ...parseDefault(postRequest),
            tx: parseTx(postRequest),
            requestType: "post",
            signMode: postRequest.signMode,
          })
        } else if (signRequest) {
          setTx({
            ...parseDefault(signRequest),
            tx: parseTx(signRequest),
            requestType: "sign",
            signMode: signRequest.signMode,
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
  }, [parseTx])

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

  /* pubkey */
  const handlePubkey = () => {
    // Store allowed origin list
    // Delete on reject
    extension.storage?.local.set(
      {
        pubkey: false,
      },
      () => setPubkey(undefined)
    )
  }

  /* suggestChain */
  const handleSuggestChain: RequestContext["actions"]["chain"] = (
    request,
    success
  ) => {
    // Store response on storage
    const type = "suggestChain"
    extension.storage?.local.get([type], (storage: ExtensionStorage) => {
      const list = storage[type] || []
      const index = list.findIndex(
        ({ id, origin }) => id === request.id && origin === request.origin
      )
      const next = update(index, { ...list[index], success }, list)
      extension.storage?.local.set({ [type]: next }, () => setChain(undefined))
    })
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

      const result = toData(
        response.result,
        networks[defaultChainID]?.isClassic
      )
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
  const requests = { connect, pubkey, tx, chain }
  const actions = {
    connect: handleConnect,
    tx: handleTx,
    multisigTx: handleMultisigTx,
    pubkey: handlePubkey,
    chain: handleSuggestChain,
  }

  return (
    <RequestProvider value={{ requests, actions }}>{children}</RequestProvider>
  )
}

export default RequestContainer
