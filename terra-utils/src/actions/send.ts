import {
  MsgExecuteContract,
  MsgSend,
  MsgTransfer,
} from "@terra-money/feather.js"
import type { SendTokensArgs } from "../types/send"
import { getIBCChannel } from "../helpers"

export interface ISendMessageStrategy {
  generateMessage(args: SendTokensArgs): any
}

export class CW20SendMessageStrategy implements ISendMessageStrategy {
  generateMessage({ senderAddress, recipientAddress, amount }: SendTokensArgs) {
    const execute_msg = {
      transfer: {
        recipient: recipientAddress.address,
        amount: amount.amount,
      },
    }
    const msg = new MsgExecuteContract(
      senderAddress.address,
      amount.denom,
      execute_msg,
    )
    return { msgs: [msg], chainID: senderAddress.chainId }
  }
}

export class BankSendMessageStrategy implements ISendMessageStrategy {
  generateMessage({ senderAddress, recipientAddress, amount }: SendTokensArgs) {
    const msg = new MsgSend(
      senderAddress.address,
      recipientAddress.address,
      amount.toString(),
    )
    return { msgs: [msg], chainID: senderAddress.chainId }
  }
}

export class IBCSendMessageStrategy implements ISendMessageStrategy {
  generateMessage({ senderAddress, recipientAddress, amount }: SendTokensArgs) {
    const channel = getIBCChannel({
      from: senderAddress.chainId,
      to: recipientAddress.chainId,
      tokenAddress: amount.denom,
    })

    if (!channel) {
      throw new Error("IBC channel not found")
    }

    const msg = new MsgTransfer(
      "transfer",
      channel,
      amount,
      senderAddress.address,
      recipientAddress.address,
      undefined,
      (Date.now() + 120 * 1000) * 1e6,
      undefined,
    )

    return { msgs: [msg], chainID: senderAddress.chainId }
  }
}

export const generateSendMessage = (
  strategy: ISendMessageStrategy,
  args: SendTokensArgs,
) => {
  return strategy.generateMessage(args)
}
