interface TxRequest {
  chainID: string
  msgs: string[]
  fee?: string
  memo?: string
}

type NetworkName = "mainnet" | "testnet" | "classic" | "localterra"
type ChainID = string

type InfoResponse = Record<ChainID, ChainInfo>
type ChainInfo = {
  baseAsset: string
  chainID: ChainID
  coinType: "330" | "118"
  explorer: {
    address: string
    block: string
    tx: string
    validator: string
  }
  gasAdjustment: number
  gasPrices: Record<string, number>
  icon: string
  lcd: string
  name: string
  prefix: string
}

type AccAddress = string
type ConnectResponse = {
  addresses: Record<ChainID, AccAddress>
  ledger: boolean
  name: string
  network: NetworkName
  pubkey?: {
    "330": string
    "118"?: string
  }
}

type PostResponse = {
  height: number
  raw_log: string
  txhash: string
}

type SignResponse = {
  auth_info: Object
  body: Object
  signatures: string[]
}

type SignBytesResponse = {
  public_key: string
  recid: number
  signature: string
}

export default class Station {
  private _pendingRequests: Record<
    string,
    { resolve: (data: any) => void; reject: (data: any) => void }
  > = {}

  constructor() {
    const origin = window.location.origin

    window.addEventListener("message", (event) => {
      if (event.origin !== origin) return

      const reqID = event.data?.uuid
      if (!reqID || !this._pendingRequests[reqID]) return

      const { sender, success, data } = event.data
      if (sender !== "station") return

      success && data?.success !== false
        ? this._pendingRequests[reqID].resolve(data)
        : this._pendingRequests[reqID].reject(data?.error?.message ?? data)
      delete this._pendingRequests[reqID]
    })
  }

  private _sendMessage(content: Object, uuid: string) {
    window.postMessage(
      {
        ...content,
        sender: "web",
        uuid,
      },
      window.location.origin
    )
  }

  async info(): Promise<InfoResponse> {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage({ type: "interchain-info" }, reqID)
      this._pendingRequests[reqID] = { resolve, reject }
    })
  }

  async connect(): Promise<ConnectResponse> {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage({ type: "connect" }, reqID)
      this._pendingRequests[reqID] = { resolve, reject }
    })
  }

  async theme(): Promise<string> {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage({ type: "theme" }, reqID)
      this._pendingRequests[reqID] = { resolve, reject }
    })
  }

  async post(tx: TxRequest, purgeQueue = false): Promise<PostResponse> {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage(
        { type: "post", data: { ...tx, purgeQueue, id: Date.now() } },
        reqID
      )
      this._pendingRequests[reqID] = {
        resolve: (data: any) => resolve(data.result),
        reject,
      }
    })
  }

  async sign(tx: TxRequest, purgeQueue = false): Promise<SignResponse> {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage(
        { type: "sign", data: { ...tx, purgeQueue, id: Date.now() } },
        reqID
      )
      this._pendingRequests[reqID] = {
        resolve: (data: any) => resolve(data.result),
        reject,
      }
    })
  }

  async signBytes(
    bytes: string,
    purgeQueue = false
  ): Promise<SignBytesResponse> {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage(
        { type: "sign", data: { bytes, purgeQueue, id: Date.now() } },
        reqID
      )
      this._pendingRequests[reqID] = {
        resolve: (data: any) => resolve(data.result),
        reject,
      }
    })
  }

  async switchNetwork(
    network: NetworkName,
    purgeQueue = true
  ): Promise<{ success: true; network: NetworkName }> {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage(
        {
          type: "switch-network",
          data: { network, purgeQueue, id: Date.now() },
        },
        reqID
      )
      this._pendingRequests[reqID] = { resolve, reject }
    })
  }
}
