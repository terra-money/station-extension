import { PropsWithChildren } from "react"
import createContext from "utils/createContext"
import { UseFormReturn, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useGetWalletName } from "auth/hooks/useAddress"
import { CoinBalance, useBankBalance } from "data/queries/bank"
import { useParsedAssetList } from "data/token"
import { useIBCChannels } from "data/queries/chains"
import { TxValues } from "./types"
import { useNetwork } from "data/wallet"

interface Send {
  form: UseFormReturn<TxValues>
  goToStep: (step: number) => void
  getWalletName: (address: string) => string
  balances: CoinBalance[]
  assetList: any[]
  getIBCChannel: any
  getICSContract: any
  networks: any
}

export const [useSend, SendProvider] = createContext<Send>("useSwap")
const SendContext = ({ children }: PropsWithChildren<{}>) => {
  const navigate = useNavigate()
  const form = useForm<TxValues>({ mode: "onChange" })
  const goToStep = (step: number) => navigate(`/send/${step}`)
  const getWalletName = useGetWalletName()
  const balances = useBankBalance()
  const assetList = useParsedAssetList().map((item) => ({
    ...item,
    chains: [item.chains[0]],
  })) // TODO: fixed parsed asset list

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
