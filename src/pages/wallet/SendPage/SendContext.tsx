import { PropsWithChildren, useCallback, useMemo } from "react"
import createContext from "utils/createContext"
import { UseFormReturn, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useGetWalletName, useInterchainAddresses } from "auth/hooks/useAddress"
import { CoinBalance, useBankBalance } from "data/queries/bank"
import { useParsedAssetList } from "data/token"
import { useIBCChannels } from "data/queries/chains"
import { TxValues } from "./types"
import { IInterchainNetworks, useNetwork } from "data/wallet"
import { toAmount } from "@terra-money/terra-utils"
import {
  AccAddress,
  Coin,
  Msg,
  MsgExecuteContract,
  MsgSend,
  MsgTransfer,
} from "@terra-money/feather.js"
import { toInput } from "txs/utils"

enum TxType {
  SEND = "Send",
  EXECUTE = "Execute Contract",
  TRANSFER = "Transfer",
}
interface Send {
  form: UseFormReturn<TxValues>
  txType: TxType | null
  goToStep: (step: number) => void
  estimationTxValues: { address?: string; input?: number }
  getWalletName: (address: string) => string
  balances: CoinBalance[]
  assetList: any[]
  createTx: () =>
    | { msgs: Msg[]; memo: string | undefined; chainID: string }
    | undefined
  getIBCChannel: ({
    from,
    to,
    tokenAddress,
    icsChannel,
  }: {
    from: string
    to: string
    tokenAddress: string
    icsChannel?: string | undefined
  }) => string | undefined

  getICSContract: ({
    from,
    to,
    tokenAddress,
  }: {
    from: string
    to: string
    tokenAddress: string
  }) => string | undefined
  networks: IInterchainNetworks
}

export const [useSend, SendProvider] = createContext<Send>("useSend")

const SendContext = ({ children }: PropsWithChildren<{}>) => {
  const navigate = useNavigate()
  const form = useForm<TxValues>({ mode: "onChange" })
  const goToStep = (step: number) => navigate(`/send/${step}`)
  const getWalletName = useGetWalletName()
  const balances = useBankBalance()
  const assetList = useParsedAssetList()
  const addresses = useInterchainAddresses()

  const networks = useNetwork()
  const { getIBCChannel, getICSContract } = useIBCChannels()
  const { input, assetInfo, chain, recipient, destination, memo } = form.watch()

  const txType = useMemo(() => {
    if (!assetInfo?.denom) return null
    return AccAddress.validate(assetInfo.denom)
      ? TxType.EXECUTE
      : destination === chain
      ? TxType.SEND
      : TxType.TRANSFER
  }, [assetInfo, destination, chain])

  const createTx = useCallback(() => {
    const amount = toAmount(input, { decimals: assetInfo?.decimals })
    const { senderAddress, denom, channel } = assetInfo ?? {}

    if (!(recipient && AccAddress.validate(recipient))) return
    if (!(chain && destination && denom && amount && senderAddress)) return

    const execute_msg = {
      transfer: { recipient, amount },
    }

    let msgs

    if (destination === chain) {
      msgs =
        txType === TxType.EXECUTE
          ? new MsgExecuteContract(senderAddress, denom, execute_msg)
          : new MsgSend(senderAddress, recipient, amount + denom)
    } else {
      if (!channel) throw new Error("No IBC channel found")
      msgs =
        txType === TxType.EXECUTE
          ? new MsgExecuteContract(senderAddress, denom, {
              send: {
                contract: getICSContract({
                  from: chain,
                  to: destination,
                  tokenAddress: denom,
                }),
                amount: amount,
                msg: Buffer.from(
                  JSON.stringify({
                    channel,
                    remote_address: recipient,
                  })
                ).toString("base64"),
              },
            })
          : new MsgTransfer(
              "transfer",
              channel,
              new Coin(denom ?? "", amount),
              senderAddress,
              recipient,
              undefined,
              (Date.now() + 120 * 1000) * 1e6,
              undefined
            )
    }
    return { msgs: [msgs], memo, chainID: chain }
  }, [
    assetInfo,
    recipient,
    chain,
    memo,
    getICSContract,
    destination,
    input,
    txType,
  ])
  const estimationTxValues = useMemo(() => {
    return {
      address: addresses?.[chain ?? "phoenix-1"],
      input: toInput(1, assetInfo?.decimals),
    }
  }, [addresses, assetInfo, chain])

  const render = () => {
    const value = {
      form,
      goToStep,
      getWalletName,
      balances,
      assetList,
      getIBCChannel,
      getICSContract,
      networks,
      createTx,
      txType,
      estimationTxValues,
    }
    return <SendProvider value={value}>{children}</SendProvider>
  }

  return render()
}

export default SendContext
