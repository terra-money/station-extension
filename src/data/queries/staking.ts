import { useQuery } from "react-query"
import { path, uniqBy } from "ramda"
import { AccAddress, ValAddress, Validator } from "@terra-money/feather.js"
import { queryKey, RefetchOptions } from "../query"
import { useInterchainLCDClient } from "./lcdClient"
import { useNetwork } from "data/wallet"
import { getChainIDFromAddress } from "utils/bech32"

export const useValidators = (chainID?: string) => {
  const lcd = useInterchainLCDClient()

  return useQuery(
    [queryKey.staking.validators, chainID],
    async () => {
      const result: Validator[] = []
      let key: string | null = ""

      do {
        // @ts-expect-error
        const [list, pagination] = await lcd.staking.validators(chainID, {
          "pagination.limit": "100",
          "pagination.key": key,
        })

        result.push(...list)
        key = pagination?.next_key
      } while (key)

      return uniqBy(path(["operator_address"]), result)
    },
    { ...RefetchOptions.INFINITY, enabled: !!chainID }
  )
}

export const useValidator = (operatorAddress: ValAddress) => {
  const lcd = useInterchainLCDClient()
  const networks = useNetwork()
  const chainID = getChainIDFromAddress(operatorAddress, networks)

  return useQuery(
    [queryKey.staking.validator, operatorAddress],
    () => lcd.staking.validator(operatorAddress),
    { ...RefetchOptions.INFINITY, enabled: !!chainID }
  )
}

export const useStakingParams = (chainID: string) => {
  const lcd = useInterchainLCDClient()
  return useQuery(
    [queryKey.staking.params, chainID],
    () => lcd.staking.parameters(chainID),
    { ...RefetchOptions.INFINITY }
  )
}

export const getChainUnbondTime = (unbondTime: number | undefined) => {
  if (!unbondTime) return 0
  return +(unbondTime / (60 * 60 * 24)).toFixed(2)
}

export const useStakingPool = (chainID: string) => {
  const lcd = useInterchainLCDClient()
  return useQuery(
    [queryKey.staking.pool, chainID],
    () => lcd.staking.pool(chainID),
    {
      ...RefetchOptions.INFINITY,
    }
  )
}

/* helpers */
export const getFindValidator = (validators: Validator[]) => {
  return (address: AccAddress) => {
    const validator = validators.find((v) => v.operator_address === address)
    if (!validator) throw new Error(`${address} is not a validator`)
    return validator
  }
}

export const getFindMoniker = (validators: Validator[]) => {
  return (address: ValAddress) => {
    try {
      const validator = getFindValidator(validators)(address)
      return validator.description.moniker
    } catch {
      return address
    }
  }
}
