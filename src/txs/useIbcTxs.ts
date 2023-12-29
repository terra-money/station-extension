import { useAuth } from "auth"
import axios from "axios"
import { RefetchOptions, queryKey } from "data/query"
import { useEffect } from "react"
import { useQueries } from "react-query"
import { atom, useRecoilState } from "recoil"
import { ChainID } from "types/network"

type WalletName = string
type TxHash = string

export enum IbcTxState {
  BROADCASTING = "broadcasting",
  PENDING = "loading",
  //RECEIVED = "received",
  SUCCESS = "success",
  ERROR = "failed",
}

type IbcTx = {
  state: IbcTxState
  txhash: TxHash
  chainID: ChainID
  timestamp: number
  msgs: Object[]
}

type StoredIbcTxs = Record<WalletName, IbcTx[]>

const LOCALSTORAGE_IBC_TXS_KEY = "ibcTxs"

const ibcTxsState = atom<StoredIbcTxs>({
  key: "ibc-txs",
  default: JSON.parse(localStorage.getItem(LOCALSTORAGE_IBC_TXS_KEY) ?? "{}"),
})

export default function useIbcTxs() {
  const { wallet } = useAuth()
  const walletName = wallet?.name
  const [_ibcTxs, _setIbcTxsState] = useRecoilState(ibcTxsState)

  const txs = _ibcTxs[walletName] ?? []
  function setIbcTxs(state: (prev: IbcTx[]) => IbcTx[]) {
    const newState = {
      ..._ibcTxs,
      [walletName]: state(_ibcTxs[walletName] ?? []),
    }
    _setIbcTxsState(newState)
    localStorage.setItem(LOCALSTORAGE_IBC_TXS_KEY, JSON.stringify(newState))
  }

  // query broadcasting txs
  useQueries(
    txs
      .filter(({ state }) => state === IbcTxState.BROADCASTING)
      .map(({ chainID, txhash, ...txData }) => ({
        queryKey: [queryKey.ibc.transactionStatus, chainID, txhash],
        queryFn: async () => {
          const { data } = await axios.post(
            "https://api.skip.money/v2/tx/track",
            {
              tx_hash: txhash,
              chain_id: chainID,
            }
          )
          return data
        },
        // ping the Skip API every 5 sec
        retryDelay: 5_000,
        // if after 5 minutes the transaction has not been broadcasted yet set the status to failed
        retry: (failureCount: number) => {
          if (failureCount > 60) {
            setIbcTxs((s) => [
              ...s.filter((d) => txhash !== d.txhash),
              {
                ...txData,
                chainID,
                txhash,
                state: IbcTxState.ERROR,
              },
            ])
            return false
          }
          return true
        },
        onSuccess: () => {
          setIbcTxs((s) => [
            ...s.filter((d) => txhash !== d.txhash),
            {
              ...txData,
              chainID,
              txhash,
              state: IbcTxState.PENDING,
            },
          ])
        },
      }))
  )

  const result = useQueries(
    txs
      .filter(({ state }) => state === IbcTxState.PENDING)
      .map(({ chainID, txhash, ...txData }) => ({
        queryKey: [queryKey.ibc.transactionStatus, chainID, txhash],
        queryFn: async () => {
          const { data } = await axios.get(
            `https://api.skip.money/v2/tx/status?tx_hash=${txhash}&chain_id=${chainID}`
          )
          return { ...txData, state: data.state as string, txhash, chainID }
        },
        refetchInterval: (data: any) => {
          if (
            [
              "STATE_COMPLETED_SUCCESS",
              "STATE_COMPLETED_ERROR",
              "STATE_ABANDONED",
            ].includes(data?.state)
          ) {
            return false
          }
          return 10_000
        },
        ...RefetchOptions.INFINITY,
      }))
  )

  useEffect(() => {
    result.forEach(({ data }) => {
      if (
        data &&
        [
          "STATE_COMPLETED_SUCCESS",
          "STATE_COMPLETED_ERROR",
          "STATE_ABANDONED",
        ].includes(data.state)
      ) {
        setIbcTxs((s) => [
          ...s.filter(({ txhash }) => txhash !== data.txhash),
          {
            ...data,
            state:
              data.state === "STATE_COMPLETED_SUCCESS"
                ? IbcTxState.SUCCESS
                : IbcTxState.ERROR,
          },
        ])
      }
    })
  }, [result]) // eslint-disable-line

  return {
    trackIbcTx: (txhash: TxHash, chainID: ChainID, msgs: Object[]) => {
      setIbcTxs((s) => [
        {
          txhash,
          chainID,
          state: IbcTxState.BROADCASTING,
          timestamp: Date.now(),
          msgs,
        },
        ...s,
      ])
    },
    clearCompletedTxs: () => {
      setIbcTxs((s) =>
        s.filter(({ state }) =>
          [IbcTxState.PENDING, IbcTxState.BROADCASTING].includes(state)
        )
      )
    },
    ibcTxs: [...txs].sort((a, b) => b.timestamp - a.timestamp),
  }
}
