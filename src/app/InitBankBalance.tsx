import { PropsWithChildren, useEffect, useState } from "react"
import {
  useInitialBankBalance,
  useInitialTokenBalance,
} from "data/queries/bank"
import { BankBalanceProvider } from "data/queries/bank"
import NetworkLoading from "./NetworkLoading"
import { incomingRequest } from "extension/utils"

const InitBankBalance = ({ children }: PropsWithChildren<{}>) => {
  const { data: bankBalance } = useInitialBankBalance()
  const { data: tokenBalance } = useInitialTokenBalance()
  const [shouldSkip, setShouldSkip] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (await incomingRequest()) {
        setShouldSkip(true)
        return
      }
    })()
  }, [])

  // If the balance doesn't exist, nothing is worth rendering.
  if (!bankBalance && !shouldSkip) return <NetworkLoading />
  return (
    <BankBalanceProvider
      value={[...(bankBalance ?? []), ...(tokenBalance ?? [])]}
    >
      {children}
    </BankBalanceProvider>
  )
}

export default InitBankBalance
