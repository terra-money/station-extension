import { AccAddress } from "@terra-money/feather.js"
import {
  useMutation,
  UseMutationResult,
  UseMutateFunction,
  UseMutateAsyncFunction,
} from "@tanstack/react-query"
import {
  ISendMessageStrategy,
  CW20SendMessageStrategy,
  BankSendMessageStrategy,
  IBCSendMessageStrategy,
  generateSendMessage,
} from "../actions/send"
import type { SendTokensArgs } from "../types/send"

interface UseSendTokenResult
  extends Omit<
    UseMutationResult<any, Error, SendTokensArgs>,
    "mutate" | "mutateAsync"
  > {
  sendTokens: UseMutateFunction<any, Error, SendTokensArgs>
  sendTokensAsync: UseMutateAsyncFunction<any, Error, SendTokensArgs>
}

export const useSendTokens = (): UseSendTokenResult => {
  const mutation = useMutation<any, Error, SendTokensArgs>({
    mutationFn: async ({ senderAddress, recipientAddress, amount }) => {
      let strategy: ISendMessageStrategy

      if (AccAddress.validate(amount.denom)) {
        strategy = new CW20SendMessageStrategy()
      } else if (senderAddress.chainId === recipientAddress.chainId) {
        strategy = new BankSendMessageStrategy()
      } else {
        strategy = new IBCSendMessageStrategy()
      }

      return await generateSendMessage(strategy, {
        senderAddress,
        recipientAddress,
        amount,
      })
    },
  })

  return {
    ...mutation,
    sendTokens: mutation.mutate,
    sendTokensAsync: mutation.mutateAsync,
  }
}
