window.nostr = {
  _requests: {},
  _pubkey: null,

  async getPublicKey() {
    if (this._pubkey) return this._pubkey
    this._pubkey = await this._call('getPublicKey', {})
    return this._pubkey
  },

  async signEvent(event) {
    return await this._call('signEvent', {event})
  },

  async getRelays() {
    return this._call('getRelays', {})
  },

  nip04: {
    async encrypt(peer, plaintext) {
      return window.nostr._call('nip04.encrypt', {peer, plaintext})
    },

    async decrypt(peer, ciphertext) {
      return window.nostr._call('nip04.decrypt', {peer, ciphertext})
    }
  },

  _call(type, params) {
    return new Promise((resolve, reject) => {
      let id = Math.random().toString().slice(4)
      this._requests[id] = {resolve, reject}
      window.postMessage(
        {
          id,
          ext: 'Station',
          type,
          params
        },
        '*'
      )
    })
  }
}