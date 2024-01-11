import { PropsWithChildren } from "react"
import createContext from "utils/createContext"
import { UseFormReturn, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useGetWalletName } from "auth/hooks/useAddress"
import { CoinBalance, useBankBalance } from "data/queries/bank"
import { useParsedAssetList } from "data/token"
import { useIBCChannels } from "data/queries/chains"
import { TxValues } from "./types"
import { IInterchainNetworks, useNetwork } from "data/wallet"

interface Send {
  form: UseFormReturn<TxValues>
  goToStep: (step: number) => void
  getWalletName: (address: string) => string
  balances: CoinBalance[]
  assetList: any[]
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

export const [useSend, SendProvider] = createContext<Send>("useSwap")
const SendContext = ({ children }: PropsWithChildren<{}>) => {
  const navigate = useNavigate()
  const form = useForm<TxValues>({ mode: "onChange" })
  const goToStep = (step: number) => navigate(`/send/${step}`)
  const getWalletName = useGetWalletName()
  const balances = useBankBalance()
  const assetList = useParsedAssetList()

  const networks = useNetwork()
  const { getIBCChannel, getICSContract } = useIBCChannels()

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
    }
    return <SendProvider value={value}>{children}</SendProvider>
  }

  return render()
}

export default SendContext
