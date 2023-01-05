import { useQuery } from "react-query"
import BigNumber from "bignumber.js"
import { Coins, Rewards, ValAddress, Validator } from "@terra-money/feather.js"
import { has } from "utils/num"
import { sortCoins } from "utils/coin"
import { queryKey, RefetchOptions } from "../query"
import { useAddress } from "../wallet"
import { useInterchainLCDClient, useLCDClient } from "./lcdClient"
import { CalcValue } from "./coingecko"

export const useRewards = () => {
  const address = useAddress()
  const lcd = useLCDClient()

  return useQuery(
    [queryKey.distribution.rewards, address],
    async () => {
      if (!address) return { total: new Coins(), rewards: {} }
      return await lcd.distribution.rewards(address)
    },
    { ...RefetchOptions.DEFAULT }
  )
}

export const useCommunityPool = (chain: string) => {
  const lcd = useInterchainLCDClient()

  return useQuery(
    [queryKey.distribution.communityPool, chain],
    () => lcd.distribution.communityPool(chain),
    { ...RefetchOptions.INFINITY }
  )
}

/* commission */
export const useValidatorCommission = () => {
  const lcd = useLCDClient()
  const address = useAddress()

  return useQuery(
    [queryKey.distribution.validatorCommission],
    async () => {
      if (!address) return new Coins()
      const prefix = ValAddress.getPrefix(address)
      const validatorAddress = ValAddress.fromAccAddress(address, prefix)
      return await lcd.distribution.validatorCommission(validatorAddress)
    },
    { ...RefetchOptions.DEFAULT }
  )
}

export const useWithdrawAddress = () => {
  const lcd = useLCDClient()
  const address = useAddress()

  return useQuery(
    [queryKey.distribution.withdrawAddress],
    async () => {
      if (!address) return
      return await lcd.distribution.withdrawAddress(address)
    },
    { ...RefetchOptions.DEFAULT }
  )
}

/* hooks */
export const getConnectedMoniker = (
  address?: string,
  validators?: Validator[]
) => {
  if (!(address && validators)) return
  const prefix = ValAddress.getPrefix(address)
  const validatorAddress = ValAddress.fromAccAddress(address, prefix)
  const validator = validators.find(
    ({ operator_address }) => operator_address === validatorAddress
  )

  if (!validator) return

  return validator.description.moniker
}

/* helpers */
export const calcRewardsValues = (
  rewards: Rewards,
  currency: Denom,
  calcValue: CalcValue
) => {
  const calc = (coins: Coins) => {
    const list = sortCoins(coins, currency).filter(({ amount }) => has(amount))
    const sum = BigNumber.sum(
      ...list.map((item) => calcValue(item) ?? 0)
    ).toString()

    return { sum, list }
  }

  const total = calc(rewards.total)
  const byValidator = Object.entries(rewards.rewards)
    .map(([address, coins]) => ({ ...calc(coins), address }))
    .filter(({ sum }) => has(sum))
    .sort(({ sum: a }, { sum: b }) => Number(b) - Number(a))

  return { total, byValidator }
}
