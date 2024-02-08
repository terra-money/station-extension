import { TxInfo, Event } from "@terra-money/feather.js"

/* -------------------------------------------------------------------------- */
/*                             Transaction Reader                             */
/* -------------------------------------------------------------------------- */

/**
 * Extracts and transforms transaction data to generate human-readable messages.
 *
 * @param {TxInfo} txInfo Object containing relevant transaction information.
 * @param {Record} addresses Object containing user wallet addresses by chain ID.
 * @return {ReturnMsg[]} Array of objects containing msg type and corresponding human-readable text.
 */
export const getCanonicalMsg = (
  txInfo: TxInfo,
  addresses: Record<string, string>
) => {
  const events = txInfo?.logs?.length
    ? txInfo.logs.reduce((arr: any, el: any) => {
        arr.push(el.events)
        return arr
      }, [])
    : []
  const swapContractAddresses: Record<string, string> = {
    Astroport:
      "terra18plp90j0zd596zt3zdsf0w9vvk5ukwlwzwkksxv9mdu8rscat9sqndk5qz",
    Coinhall:
      "terra1e3nqr8vwu32pzgasraud9avpwdd8phmqgre5kpwlytgedj2emkkq3l67hy",
    TFM: "terra19hz374h6ruwtzrnm8ytkae782uv79h9yt9tuytgvt94t26c4793qnfg7vn"
  }
  const userAddresses = Object.values(addresses)

  const msgs = txInfo.tx.body.messages
  let returnMsgs: ReturnMsg[] = []

  // Iterate over tx messages and generate corresponding human-readable text.
  for (const [msgIdx, msg] of msgs.entries()) {
    const msgEvents = events.length ? events[msgIdx] : []

    // Adds `@type` key if not already in msg object.
    const typePattern = /"@type\\"\s*:\s*\\"([^"]+)\\"/
    const msgType = (msg as any)["@type"]
      ? (msg as any)["@type"]
      : (JSON.stringify(msg).match(typePattern) || [])[1] || null

    // Declare logic to extract message. Used inside the extractMsg utility function
    // to fail gracefully if error occurs.
    let extractMsgFn

    switch (msgType) {
      /* ---------------------------------- Send ---------------------------------- */

      case "/cosmos.bank.v1beta1.MsgSend":
        extractMsgFn = (msg: any) => {
          const sendMessageData = getSendMessage(msg, userAddresses)
          returnMsgs.push(sendMessageData)
        }
        extractMsg(extractMsgFn, msg, msgType, txInfo.txhash)
        break

      /* ----------------------- Withdraw Delegation Reward ----------------------- */

      case "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward":
        extractMsgFn = (_: any) => {
          const rewardsMsgsData = getRewardMsgs(msgEvents)
          returnMsgs.push(...rewardsMsgsData)
        }
        extractMsg(extractMsgFn, msg, msgType, txInfo.txhash)
        break

      /* -------------------------------- Delegate -------------------------------- */

      case "/cosmos.staking.v1beta1.MsgDelegate":
        extractMsgFn = (msg: any) => {
          const {
            amount: { denom: delegatedDenom, amount: delegatedAmount },
            validator_address: delegateValidator
          } = msg as any

          const trueDelegatedDenom = getTrueDenom(delegatedDenom)
          const delegatedAsset = `${delegatedAmount}${trueDelegatedDenom}`

          returnMsgs.push({
            msgType: "Delegate",
            canonicalMsg: [
              `Delegated ${delegatedAsset} to ${delegateValidator}`
            ],
            outAssets: [delegatedAsset]
          })
        }
        extractMsg(extractMsgFn, msg, msgType, txInfo.txhash)
        break

      /* -------------------------------- Transfer -------------------------------- */

      case "/ibc.applications.transfer.v1.MsgTransfer":
        extractMsgFn = (msg: any) => {
          const {
            token: { denom: ibcDenom, amount: ibcAmount },
            receiver: ibcReceiver,
            memo: ibcMemo
          } = msg as any

          const trueIBCDenom = getTrueDenom(ibcDenom)
          const transferAsset = `${ibcAmount}${trueIBCDenom}`

          let ibcMemoInfo
          try {
            ibcMemoInfo = JSON.parse(ibcMemo)
          } catch (error) {
            // Memo is not parsable as JSON.
            ibcMemoInfo = undefined
          }
          const trueIBCReceiver = ibcMemoInfo?.forward?.receiver
            ? ibcMemoInfo.forward.receiver
            : ibcReceiver

          returnMsgs.push({
            msgType: "Transfer",
            canonicalMsg: [
              `Initiated IBC transfer of ${transferAsset} to ${trueIBCReceiver}`
            ],
            outAssets: [transferAsset]
          })
        }
        extractMsg(extractMsgFn, msg, msgType, txInfo.txhash)
        break

      /* ------------------------------- Undelegate ------------------------------- */

      case "/cosmos.staking.v1beta1.MsgUndelegate":
        extractMsgFn = (msg: any) => {
          const {
            amount: { denom: undelegateDenom, amount: undelegateAmount },
            validator_address: undelegateValidator
          } = msg as any

          const trueUndelegateDenom = getTrueDenom(undelegateDenom)
          const undelegatedAsset = `${undelegateAmount}${trueUndelegateDenom}`

          returnMsgs.push({
            msgType: "Undelegate",
            canonicalMsg: [
              `Undelegated ${undelegatedAsset} from ${undelegateValidator}`
            ],
            inAssets: [undelegatedAsset]
          })

          // Get any related rewards messages associated with undelegation.
          const undelegateRewardsData = getRewardMsgs(msgEvents)
          returnMsgs.push(...undelegateRewardsData)
        }
        extractMsg(extractMsgFn, msg, msgType, txInfo.txhash)
        break

      /* ------------------------------- Redelegate ------------------------------- */

      case "/cosmos.staking.v1beta1.MsgBeginRedelegate":
        extractMsgFn = (msg: any) => {
          const {
            amount: { denom: redelegateDenom, amount: redelegateAmount },
            validator_src_address: sourceVal,
            validator_dst_address: destVal
          } = msg as any

          const trueRedelegateDenom = getTrueDenom(redelegateDenom)

          returnMsgs.push({
            msgType: "Redelegate",
            canonicalMsg: [
              `Redelegated ${redelegateAmount}${trueRedelegateDenom} from ${sourceVal} to ${destVal}`
            ]
          })

          // Get any related rewards messages associated with redelegation.
          const redelegateRewardsData = getRewardMsgs(msgEvents)
          returnMsgs.push(...redelegateRewardsData)
        }
        extractMsg(extractMsgFn, msg, msgType, txInfo.txhash)
        break

      /* ----------------------------- Proposal Voting ---------------------------- */

      case "/cosmos.gov.v1beta1.MsgVote" ||
        "/cosmos.gov.v1.MsgVote" ||
        "/cosmos.gov.v1beta1.MsgVoteWeighted":
        extractMsgFn = (msg: any) => {
          const voteOptions: { [key: string]: any } = {
            VOTE_OPTION_YES: "Yes",
            VOTE_OPTION_ABSTAIN: "Abstain",
            VOTE_OPTION_NO: "No",
            VOTE_OPTION_NO_WITH_VETO: "No With Veto"
          }

          const { option, proposal_id } = msg as any

          returnMsgs.push({
            msgType: "Vote",
            canonicalMsg: [
              `Voted ${voteOptions[option]} on proposal:${proposal_id}`
            ]
          })
        }
        extractMsg(extractMsgFn, msg, msgType, txInfo.txhash)
        break

      /* ---------------------------- Execute Contract ---------------------------- */

      case "/cosmwasm.wasm.v1.MsgExecuteContract":
        extractMsgFn = (msg: any) => {
          const contractName = getContractName(msg, swapContractAddresses)

          const swapsInfo = getEventInfo(msgEvents, "swap")
          if (swapsInfo.length) {
            /* -------------------------------- Swap -------------------------------- */

            const swapMessageData = getSwapMessage(swapsInfo, contractName)
            returnMsgs.push(swapMessageData)
          } else if ((msg as any)?.msg?.provide_liquidity) {
            /* -------------------------- Provide Liquidity ------------------------- */

            const liquidityInfo = getEventInfo(msgEvents, "provide_liquidity")

            for (const liquidityTx of liquidityInfo) {
              const { assets, contractAddress } = liquidityTx

              const providedAssetsText = formatAssetsText(assets)

              returnMsgs.push({
                msgType: "Provide Liquidity",
                canonicalMsg: [
                  `Provided ${providedAssetsText} of liquidity to ${contractAddress}`
                ],
                outAssets: providedAssetsText.split(/[,\s]+(?:and\s)?/)
              })
            }
          } else if (
            (msg as any)?.msg?.withdraw &&
            (msg as any).msg.withdraw.lp_token
          ) {
            /* -------------------------- Unstake LP Token -------------------------- */

            const transferInfo = getEventInfo(msgEvents, "transfer")
            const unstakeLPInfo = getEventInfo(msgEvents, "withdraw")
            const rewardsUnstakeLPInfo = getEventInfo(msgEvents, "claim")

            const unstakeLPMsg = generateUnstakeLPMsg(
              unstakeLPInfo,
              rewardsUnstakeLPInfo,
              transferInfo,
              userAddresses
            )

            if (unstakeLPMsg) {
              returnMsgs.push({
                msgType: "Undelegate",
                canonicalMsg: [unstakeLPMsg]
              })
            }
          } else if ((msg as any)?.msg?.claim_rewards) {
            const claimedRewards = getEventInfo(msgEvents, "claim_rewards")

            if (claimedRewards?.[0]?.rewardAsset) {
              /* ---------------------- Withdraw Alliance Rewards --------------------- */

              for (const claimedReward of claimedRewards) {
                const {
                  rewardAmount,
                  rewardAsset,
                  withdrawFromAddress
                } = claimedReward

                const splitAsset = rewardAsset.split(":")
                const trueRewardAsset = splitAsset[splitAsset.length - 1]
                const allianceRewardAsset = `${rewardAmount}${trueRewardAsset}`

                returnMsgs.push({
                  msgType: "Reward Withdrawal",
                  canonicalMsg: [
                    `Withdrew ${allianceRewardAsset} staking rewards from ${withdrawFromAddress}`
                  ],
                  inAssets: [allianceRewardAsset]
                })
              }
            }
          } else if ((msg as any)?.msg?.send) {
            const msgData = Buffer.from(
              (msg as any).msg.send.msg,
              "base64"
            ).toString()
            const submitMsgData = JSON.parse(msgData)

            if (submitMsgData.deposit) {
              /* -------------------------- Stake LP Token -------------------------- */

              const {
                amount: LPTokenAmount,
                contract: stakingContract
              } = (msg as any)?.msg?.send

              const LPTokenContract = contractName

              returnMsgs.push({
                msgType: "Deposit",
                canonicalMsg: [
                  `Deposited ${LPTokenAmount}${LPTokenContract} to ${stakingContract}`
                ]
              })
            } else if (submitMsgData.withdraw_liquidity) {
              /* ------------------------ Withdraw Liquidity ------------------------ */

              const withdrawLiquidityInfo = getEventInfo(
                msgEvents,
                "withdraw_liquidity"
              )

              for (const withdrawLiquidityTx of withdrawLiquidityInfo) {
                const { refundAssets } = withdrawLiquidityTx

                const withdrawnAssetsText = formatAssetsText(refundAssets)

                returnMsgs.push({
                  msgType: "Withdraw Liquidity",
                  canonicalMsg: [
                    `Withdrew ${withdrawnAssetsText} of liquidity from ${contractName}`
                  ],
                  outAssets: withdrawnAssetsText.split(/[,\s]+(?:and\s)?/)
                })
              }
            }
          } else {
            /* ------------------------- Contract Execution ------------------------- */
            const executables = [...Object.keys((msg as any).msg || {}), ...Object.keys((msg as any).execute_msg || {})].length ?
              [...Object.keys((msg as any).msg || {}), ...Object.keys((msg as any).execute_msg || {})] : 
              ["unknown_executable"]
            for (const executable of executables) {
              if (!["increase_allowance"].includes(executable))
                returnMsgs.push({
                  msgType: "Execute",
                  canonicalMsg: [`Executed ${executable} on ${contractName}`]
                })
            }
          }
        }
        extractMsg(extractMsgFn, msg, msgType, txInfo.txhash)
        break

      /* ----------------------------- Receive Packet ----------------------------- */

      case "/ibc.core.channel.v1.MsgRecvPacket":
        extractMsgFn = (msg: any) => {
          const {
            amount,
            denom,
            sender,
            receiver: packetReceiver,
            memo
          } = JSON.parse(
            Buffer.from((msg as any).packet.data, "base64").toString()
          )

          const trueDenom = getTrueDenom(denom)
          const receiveIBCAmount = `${amount}${trueDenom}`

          if (userAddresses.includes(packetReceiver)) {
            returnMsgs.push({
              msgType: "Transfer",
              canonicalMsg: [
                `Received ${receiveIBCAmount} from ${sender} via IBC`
              ],
              inAssets: [receiveIBCAmount]
            })
          } else if (memo) {
            const data = JSON.parse(memo)
            if (
              data?.wasm?.msg &&
              Object.keys(data?.wasm?.msg).find(k => k.includes("swap"))
            ) {
              const swapMessage = Object.keys(data?.wasm?.msg).find(k =>
                k.includes("swap")
              ) as string
              const outAsset =
                data.wasm.msg[swapMessage].min_asset?.native?.denom

              returnMsgs.push({
                msgType: "Swap",
                canonicalMsg: [
                  outAsset
                    ? `Swapped ${receiveIBCAmount} to ${outAsset}`
                    : `Swapped ${receiveIBCAmount}`
                ],
                inAssets: [receiveIBCAmount]
              })
            } else if (data?.wasm?.msg && data?.wasm?.contract) {
              returnMsgs.push({
                msgType: "Transfer",
                canonicalMsg: [
                  `Received ${receiveIBCAmount} from ${sender} via IBC`
                ],
                inAssets: [receiveIBCAmount]
              })
              returnMsgs.push({
                msgType: "Execute",
                canonicalMsg: [
                  `Executed ${Object.keys(data?.wasm?.msg).join(", ")} on ${
                    data?.wasm?.contract
                  }`
                ]
              })
            }
          }
        }
        extractMsg(extractMsgFn, msg, msgType, txInfo.txhash)
        break

      case "/ibc.core.channel.v1.MsgTimeout":
        extractMsgFn = (_: any) => {
          returnMsgs.push({
            msgType: "Timeout",
            canonicalMsg: [`Refund timed out IBC transfer`]
          })
        }
        extractMsg(extractMsgFn, msg, msgType, txInfo.txhash)
        break

      /* ------------------------- Irrelevant Transactions ------------------------ */

      case "/ibc.core.client.v1.MsgUpdateClient":
        continue

      /* ----------------------------- Unknown Message ---------------------------- */

      default:
        const msgTypeRegex = new RegExp(/.*?(Msg[a-zA-Z]+)$/)
        const msgTypeMatch = msgTypeRegex.exec(msgType)
        const msgTypeText = msgTypeMatch?.[1] ? msgTypeMatch[1] : msgType

        returnMsgs.push({
          msgType: msgTypeText,
          canonicalMsg: [`Initiated ${msgTypeText} transaction`]
        })
        break
    }
  }

  return returnMsgs
}

/* -------------------------------------------------------------------------- */
/*                              Utility Functions                             */
/* -------------------------------------------------------------------------- */

/**
 * Attempts to extract and add canonical message utilizing the specified extractMsgFunction.
 * If the attempt fails, it will log information about the message that it failed to parse.
 *
 * @param {Function} extractMsgFn Function containing logic to extract canonical message.
 * @param {object} msg Object which contains message information.
 * @param {string} msgType String that specifies the type of the current message.
 * @param {string} txHash String corresponding to the tx hash of the transaction.
 */
const extractMsg = (
  extractMsgFn: Function,
  msg: any,
  msgType: string,
  txHash: string
) => {
  try {
    extractMsgFn(msg)
  } catch (error) {
    console.error(`
Failed to parse message:
Type: ${msgType}
Hash: ${txHash}
Error: ${error}
    `)
  }
}

/**
 * Extracts relevant event-specific data based on user specified event type.
 *
 * @param {Event[]} msgEvents Array containing objects of event types and event attributes.
 * @param {string} eventName Text corresponding to the event type of which data should be recorded.
 * @return {Array} Array of objects containing relevant event-specific data.
 */
const getEventInfo = (msgEvents: Event[], eventName: string) => {
  const eventType = [
    "withdraw_liquidity",
    "provide_liquidity",
    "claim_rewards",
    "transfer",
    "withdraw",
    "claim",
    "swap"
  ].includes(eventName)
    ? "wasm"
    : eventName

  const events = msgEvents.length
    ? msgEvents.filter((obj: Event) => obj.type === eventType)
    : []

  let amounts: any[] = []

  // Consolidate event attributes array of objects into single object.
  for (const event of events) {
    const eventInfo = Object.fromEntries(
      event.attributes.map((obj: any) => [obj.key, obj.value])
    )

    // Extract relevant data from event based on event type.
    switch (eventType) {
      case "withdraw_rewards":
        amounts.push({
          amount: eventInfo.amount,
          validator: eventInfo.validator
        })
        break
      case "wasm":
        if (eventInfo.action === "swap" && eventName === "swap") {
          amounts.push({
            offerAmount: eventInfo.offer_amount,
            offerAsset: eventInfo.offer_asset,
            receiveAmount: eventInfo.return_amount,
            receiveAsset: eventInfo.ask_asset
          })
        } else if (
          eventInfo.action === "provide_liquidity" &&
          eventName === "provide_liquidity"
        ) {
          if (eventInfo.assets) {
            amounts.push({
              assets: eventInfo.assets,
              contractAddress: eventInfo._contract_address
            })
          }
        } else if (
          eventInfo.action === "withdraw" &&
          eventName === "withdraw"
        ) {
          amounts.push({
            withdrawAmount: eventInfo.amount,
            withdrawSenderAddress: eventInfo._contract_address
          })
        } else if (
          eventInfo.action === "transfer" &&
          eventName === "transfer"
        ) {
          amounts.push({
            transferAmount: eventInfo.amount,
            transferTokenAddress: eventInfo._contract_address,
            transferFrom: eventInfo.from,
            transferTo: eventInfo.to
          })
        } else if (eventInfo.action === "claim" && eventName === "claim") {
          amounts.push({
            claimAmount: eventInfo.claimed_amount,
            claimSenderAddress: eventInfo._contract_address
          })
        } else if (
          eventInfo.action === "claim_rewards" &&
          eventName === "claim_rewards"
        ) {
          amounts.push({
            rewardAmount: eventInfo.reward_amount,
            rewardAsset: eventInfo.asset,
            withdrawFromAddress: eventInfo._contract_address
          })
        } else if (
          eventInfo.action === "withdraw_liquidity" &&
          eventName === "withdraw_liquidity"
        ) {
          if (eventInfo.refund_assets) {
            amounts.push({
              refundAssets: eventInfo.refund_assets
            })
          }
        }
        break
    }
  }

  return amounts
}

/**
 * Extracts reward withdrawal events from tx, generates reward withdrawal messages, and adds
 * it to the returned messages.
 *
 * @param {Event[]} msgEvents Array containing objects of event types and event attributes.
 * @return {Object[]} Array of objects containing relevant data on withdrawn rewards.
 */
const getRewardMsgs = (msgEvents: Event[]) => {
  const rewards = getEventInfo(msgEvents, "withdraw_rewards")
  let rewardsMsgs = []

  for (const reward of rewards) {
    const { amount: rewardAssets, validator: validatorAddress } = reward

    rewardsMsgs.push({
      msgType: "Reward Withdrawal",
      canonicalMsg: [
        `Withdrew ${rewardAssets} staking rewards from ${validatorAddress}`
      ],
      inAssets: rewardAssets.split(",")
    })
  }

  return rewardsMsgs
}

/**
 * Extracts swap events from tx, generates swap message, and adds it to the returned messages.
 *
 * @param {any[]} swapsInfo Array of objects containing information on swaps.
 * @param {string} swapPlatform Name of or contract address belonging to the platform used to carry out swap.
 * @return {object} Object containing relevant swap message data.
 */
const getSwapMessage = (swapsInfo: any[], swapPlatform: string) => {
  // Extract original swap token and the requested return token.
  const { offerAsset: swapToken } = swapsInfo[0]
  const { receiveAsset: returnToken } = swapsInfo[swapsInfo.length - 1]
  let [swapAmount, returnAmount] = [0, 0]

  // The original swap amount may be split and go through different swap paths
  // to generate the expected amount of return token.
  for (const swapInfo of swapsInfo) {
    const { offerAmount, offerAsset, receiveAmount, receiveAsset } = swapInfo
    if (offerAsset === swapToken) {
      swapAmount += parseInt(offerAmount)
    }
    if (receiveAsset === returnToken) {
      returnAmount += parseInt(receiveAmount)
    }
  }

  const outAsset = `${swapAmount}${swapToken}`
  const inAsset = `${returnAmount}${returnToken}`

  return {
    msgType: "Swap",
    canonicalMsg: [`Swapped ${outAsset} for ${inAsset} on ${swapPlatform}`],
    inAssets: [inAsset],
    outAssets: [outAsset]
  }
}

/**
 * Evaluates if contract is related to a swap platform, if not, it returns the contract address.
 *
 * @param {object} msg Object which contains message information.
 * @param {Record} swapContractAddresses Record containing swap platforms and their corresponding
 * contract addresses.
 * @return {string} Name of swap platform corresponding to or contract address of executed contract.
 */
const getContractName = (
  msg: any,
  swapContractAddresses: Record<string, string>
) => {
  const contractAddress = (msg as any).contract

  const contractName = Object.keys(swapContractAddresses).find(
    key => swapContractAddresses[key] === contractAddress
  )
    ? Object.keys(swapContractAddresses).find(
        key => swapContractAddresses[key] === contractAddress
      )
    : Object.keys(swapContractAddresses).find(
        key => swapContractAddresses[key] === (msg as any).msg?.send?.contract
      )
    ? Object.keys(swapContractAddresses).find(
        key => swapContractAddresses[key] === (msg as any).msg?.send?.contract
      )
    : (msg as any).msg?.send?.contract
    ? (msg as any).msg.send.contract
    : contractAddress

  return contractName
}

/**
 * Generates appropriate send message based on whether from or to address belongs to the user.
 *
 * @param {object} msg Object which contains message information.
 * @param {string[]} userAddresses Array containing user addresses across all chains.
 * @return {Object} Object containing relevant send message data.
 */
const getSendMessage = (msg: any, userAddresses: string[]) => {
  const {
    from_address: fromAddress,
    to_address: toAddress,
    amount: [{ denom: sentDenom, amount: sentAmount }]
  } = msg

  const trueSentDenom = getTrueDenom(sentDenom)
  const sentAsset = `${sentAmount}${trueSentDenom}`

  let sendMsg, inAsset, outAsset
  if (userAddresses.includes(fromAddress)) {
    sendMsg = `Sent ${sentAsset} to ${toAddress}`
    outAsset = sentAsset
  } else if (userAddresses.includes(toAddress)) {
    sendMsg = `Received ${sentAsset} from ${fromAddress}`
    inAsset = sentAsset
  } else {
    sendMsg = `${fromAddress} sent ${sentAsset} to ${toAddress}`
  }

  return {
    msgType: "Send",
    canonicalMsg: [sendMsg],
    inAssets: inAsset ? [inAsset] : undefined,
    outAssets: outAsset ? [outAsset] : undefined
  }
}

/**
 * Generates message for an unstake LP transaction on Astroport.
 *
 * @param {object[]} unstakeLPInfo Array of objects containing unstake info.
 * @param {object[]} rewardsUnstakeLPInfo Array of objects containing reward withdrawal info.
 * @param {object[]} transferInfo Array of objects containing token amount and type info for related txs.
 * @param {string[]} userAddresses Array containing user addresses across all chains.
 * @return {string} Human-readable message representing the unstake LP transaction.
 */
const generateUnstakeLPMsg = (
  unstakeLPInfo: any[],
  rewardsUnstakeLPInfo: any[],
  transferInfo: any[],
  userAddresses: string[]
) => {
  let unstakeLPMsgs: string[] = []
  for (const unstakeLPTx of unstakeLPInfo) {
    const { withdrawAmount, withdrawSenderAddress } = unstakeLPTx
    for (const transferTx of transferInfo) {
      const {
        transferAmount,
        transferTokenAddress,
        transferFrom,
        transferTo
      } = transferTx

      if (
        withdrawAmount === transferAmount &&
        withdrawSenderAddress === transferFrom &&
        userAddresses.includes(transferTo)
      ) {
        unstakeLPMsgs.push(
          `Withdrew ${transferAmount}${transferTokenAddress} from ${transferFrom}`
        )
      }
    }
  }

  for (const rewardsUnstakeLPTx of rewardsUnstakeLPInfo) {
    const { claimAmount, claimSenderAddress } = rewardsUnstakeLPTx
    for (const transferTx of transferInfo) {
      const {
        transferAmount,
        transferTokenAddress,
        transferFrom,
        transferTo
      } = transferTx

      if (
        claimAmount === transferAmount &&
        claimSenderAddress === transferFrom &&
        userAddresses.includes(transferTo)
      ) {
        unstakeLPMsgs.push(
          `claimed ${transferAmount}${transferTokenAddress} from ${transferFrom}`
        )
      }
    }
  }

  return unstakeLPMsgs.join(" and ")
}

/**
 * Evaluates supplied denom to ensure that it is properly formatted for message parsing.
 *
 * @param {string} denom String corresponding to asset which may need formatting.
 * @return {string} String of true denom for effective message parsing.
 *
 * Example of expected input/outputs:
 * - uluna -> uluna
 * - transfer/channel-42/ujuno -> ujuno
 * - transfer/channel-42/transfer/channel-34/uatom -> uatom
 * - transfer/channel-42/cw20:terra1....
 */
const getTrueDenom = (denom: string): string => {
  if (denom.startsWith("cw20:")) {
    return denom.replace("cw20:", "")
  }

  if (denom.split("/").length >= 3) {
    const [port, channel, ...extra] = denom.split("/")

    // if port is "transfer" and channel matches "channel-{NUMBER}"
    if (port === "transfer" && /^channel-\d+$/g.test(channel)) {
      // recursive, there might be another channel or a "cw20:"" prefix
      return getTrueDenom(extra.join("/"))
    }
  }

  // denom is fine as it is
  return denom
}

/**
 * Formats comma separated assets into human readable text.
 *
 * @param {string} assets String of comma separated assets.
 * @return {string} Formatted assets string to use in returned message.
 */
const formatAssetsText = (assets: string) => {
  const splitAssets = assets.split(/,\s?/)
  const assetsText =
    splitAssets.length > 2
      ? `${splitAssets.slice(0, splitAssets.length - 1).join(", ")}, and ${
          splitAssets[splitAssets.length - 1]
        }`
      : splitAssets.join(" and ")

  return assetsText
}

/* -------------------------------------------------------------------------- */
/*                                 Interfaces                                 */
/* -------------------------------------------------------------------------- */

interface ReturnMsg {
  msgType: string
  canonicalMsg: string[]
  inAssets?: (undefined | string)[]
  outAssets?: (undefined | string)[]
}
