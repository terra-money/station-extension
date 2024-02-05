import { TxInfo } from "@terra-money/feather.js"
import {
  useMutation,
  UseMutationResult,
  UseMutateFunction,
  UseMutateAsyncFunction,
} from "@tanstack/react-query"
import { pollTransactionStatus } from "../actions"

interface PollParams {
  txhash: string
  chainId: string
}

interface UsePollTransactionStatusResult
  extends Omit<
    UseMutationResult<TxInfo, Error, PollParams>,
    "mutate" | "mutateAsync"
  > {
  pollTransaction: UseMutateFunction<TxInfo, Error, PollParams>
  pollTransactionAsync: UseMutateAsyncFunction<TxInfo, Error, PollParams>
}

export const usePollTransactionStatus = (): UsePollTransactionStatusResult => {
  const mutation = useMutation<TxInfo, Error, PollParams>({
    mutationFn: ({ txhash, chainId }) => pollTransactionStatus(txhash, chainId),
  })

  return {
    ...mutation,
    pollTransaction: mutation.mutate,
    pollTransactionAsync: mutation.mutateAsync,
  }
}
