interface AccountHistory {
  pagination: {
    total: string
    next_key: string | null
  }
  tx_responses: ActivityItem[]
}

interface PubKey {
  "@type": string
  key: string
}

interface SignerInfo {
  public_key: PubKey
  mode_info: {
    single: {
      mode: string
    }
  }
  sequence: string
}

interface MultiSignerInfo {
  public_key: {
    "@type": string
    threshold: number
    public_keys: PubKey[]
  }
  mode_info: {
    multi: {
      mode_infos: [
        {
          single: {
            mode: string
          }
        },
        {
          single: {
            mode: string
          }
        }
      ]
    }
  }
  sequence: string
}

interface ActivityItem {
  addresses: string[]
  chain_id: string
  children: ActivityItem[]
  code: number
  coinType: 60 | 118 | 330
  events: any[]
  logs: TxLog[]
  raw_log: string
  timestamp: any
  tx: {
    body: {
      messages: any[]
      memo?: string
    }
    auth_info: {
      fee: {
        amount: CoinData[]
      }
      signer_infos: SignerInfo[] | MultiSignerInfo[]
    }
  }
  tx_hash: string
  words_from_key: string
}

interface TxLog {
  msg_index: number
  log: string
  events: TxLogEvent[]
}

interface TxLogEvent {
  type: string
  attributes: {
    key: string
    value: string
  }[]
}

interface TxMessage {
  msgType: string
  canonicalMsg: string[]
}
