interface TxRequest {
  chainID: string
  msgs: string[]
  fee?: string
  memo?: string
}

export default class Station {
  private _pendingRequests: Record<
    string,
    { resolve: (data: unknown) => void; reject: (data: unknown) => void }
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

  async info() {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage({ type: "interchain-info" }, reqID)
      this._pendingRequests[reqID] = { resolve, reject }
    })
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage({ type: "connect" }, reqID)
      this._pendingRequests[reqID] = { resolve, reject }
    })
  }

  async theme() {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage(
        { type: "theme" },
        reqID
      )
      this._pendingRequests[reqID] = { resolve, reject }
    })
  }

  async post(tx: TxRequest, purgeQueue = false) {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage({ type: "post", data: { ...tx, purgeQueue } }, reqID)
      this._pendingRequests[reqID] = { resolve, reject }
    })
  }

  async sign(tx: TxRequest, purgeQueue = false) {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage(
        { type: "sign", data: { ...tx, purgeQueue, id: Date.now() } },
        reqID
      )
      this._pendingRequests[reqID] = { resolve, reject }
    })
  }

  async signBytes(bytes: string, purgeQueue = false) {
    return new Promise((resolve, reject) => {
      const reqID = crypto.randomUUID()
      this._sendMessage(
        { type: "sign", data: { bytes, purgeQueue, id: Date.now() } },
        reqID
      )
      this._pendingRequests[reqID] = { resolve, reject }
    })
  }
}
