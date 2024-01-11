import {
  useGammTokens,
  GAMM_TOKEN_DECIMALS,
  OSMO_ICON,
} from "./external/osmosis"
import { isDenomIBC, readDenom, truncate } from "@terra-money/terra-utils"
import { useCW20Whitelist, useIBCWhitelist } from "./Terra/TerraAssets"
import { useCustomTokensCW20 } from "./settings/CustomTokens"
import { useExchangeRates } from "data/queries/coingecko"
import { useNetworkName, useNetwork } from "./wallet"
import { getChainIDFromAddress } from "utils/bech32"
import { AccAddress } from "@terra-money/feather.js"
import { useIBCBaseDenoms } from "data/queries/ibc"
import { useTokenInfoCW20 } from "./queries/wasm"
import { useBankBalance } from "./queries/bank"
import { useWhitelist } from "./queries/chains"
import { ReactNode, useMemo } from "react"
import { ASSETS } from "config/constants"
import { toInput } from "txs/utils"

export const DEFAULT_NATIVE_DECIMALS = 6

export const useTokenItem = (
  token: Token,
  chainID?: string
): TokenItem | undefined => {
  const readNativeDenom = useNativeDenoms()

  /* CW20 */
  const matchToken = (item: TokenItem) => item.token === token

  // 1. Local storage
  const { list } = useCustomTokensCW20()
  const customTokenItem = list.find(matchToken)

  // 2. Whitelist
  const cw20WhitelistResult = useCW20Whitelist(!!customTokenItem)
  const { data: cw20Whitelist = {} } = cw20WhitelistResult
  const listedCW20TokenItem = Object.values(cw20Whitelist ?? {}).find(
    matchToken
  )

  // 3. Contract query - token info
  const shouldQueryCW20 = cw20WhitelistResult.isSuccess && !listedCW20TokenItem
  const tokenInfoResult = useTokenInfoCW20(token, shouldQueryCW20)
  const { data: tokenInfo } = tokenInfoResult
  const tokenInfoItem = tokenInfo ? { token, ...tokenInfo } : undefined

  /* IBC */
  // 1. Whitelist
  const { data: ibcWhitelist = {} } = useIBCWhitelist()
  const listedIBCTokenItem = ibcWhitelist[token.replace("ibc/", "")]

  // 2. Query denom trace
  //const shouldQueryIBC = ibcWhitelistState.isSuccess && !listedIBCTokenItem
  //const { data: base_denom } = useIBCBaseDenom(token, shouldQueryIBC)

  if (AccAddress.validate(token)) {
    return customTokenItem ?? listedCW20TokenItem ?? tokenInfoItem
  }

  if (isDenomIBC(token)) {
    const item = {
      ...listedIBCTokenItem,
      denom: token,
      base_denom: listedIBCTokenItem?.base_denom,
    }

    return readIBCDenom(item)
  }

  return readNativeDenom(token, chainID)
}

interface Props {
  token: Token
  chainID?: string
  children: (token: TokenItem) => ReactNode
}

export const WithTokenItem = ({ token, chainID, children }: Props) => {
  const readNativeDenom = useNativeDenoms()
  return <>{children(readNativeDenom(token, chainID))}</>
}

/* helpers */
export const getIcon = (path: string) => `${ASSETS}/icon/svg/${path}`

export enum TokenType {
  IBC = "ibc",
  GAMM = "gamm",
  FACTORY = "factory",
  STRIDE = "stride",
}

// React Hooks cannot be called inside of a callback like the one used by map.
// This custom React Hook function allows for calling this Hook in a callback.
export const useNativeDenoms = () => {
  const { whitelist, ibcDenoms } = useWhitelist()
  const { list: cw20 } = useCustomTokensCW20()
  const networkName = useNetworkName()
  const networks = useNetwork()
  const gammTokens = useGammTokens()

  let decimals = DEFAULT_NATIVE_DECIMALS

  function readNativeDenom(
    denom: Denom,
    chainID?: string
  ): TokenItem & { isNonWhitelisted?: boolean } {
    let tokenType = ""
    if (denom.startsWith("ibc/")) {
      tokenType = TokenType.IBC
    } else if (denom.startsWith("factory/")) {
      tokenType = TokenType.FACTORY
    } else if (denom.startsWith("gamm/")) {
      tokenType = TokenType.GAMM
      decimals = GAMM_TOKEN_DECIMALS
    } else if (
      denom.startsWith("stu") &&
      (!chainID || chainID === "stride-1")
    ) {
      tokenType = TokenType.STRIDE
    }

    let fixedDenom = ""
    switch (tokenType) {
      case TokenType.IBC:
        fixedDenom = `${readDenom(denom).substring(0, 5)}...`
        break

      case TokenType.GAMM:
        fixedDenom = gammTokens.get(denom) ?? readDenom(denom)
        break

      case TokenType.FACTORY:
        const factoryParts = denom.split(/[/:]/)
        let tokenAddress = ""
        if (factoryParts.length >= 2) {
          tokenAddress = factoryParts.slice(2).join(" ")
        }
        fixedDenom = tokenAddress
        break

      case TokenType.STRIDE:
        fixedDenom = `st${denom.replace("stu", "").toUpperCase()}`
        break

      default:
        fixedDenom = readDenom(denom) || denom
    }

    let factoryIcon
    if (tokenType === TokenType.FACTORY) {
      const tokenAddress = denom.split(/[/:]/)[1]
      const chainID = getChainIDFromAddress(tokenAddress, networks)
      if (chainID) {
        factoryIcon = networks[chainID].icon
      }
    }

    if (tokenType === TokenType.GAMM) {
      factoryIcon = OSMO_ICON
    }

    // native token
    if (chainID) {
      const tokenID = `${chainID}:${denom}`

      if (whitelist[networkName]?.[tokenID])
        return whitelist[networkName]?.[tokenID]
    } else {
      const tokenDetails = Object.values(whitelist[networkName] ?? {}).find(
        ({ token }) => token === denom
      )
      if (tokenDetails) return tokenDetails
    }

    // ibc token
    let ibcToken = chainID
      ? ibcDenoms[networkName]?.[`${chainID}:${denom}`]
      : Object.entries(ibcDenoms[networkName] ?? {}).find(
          ([k]) => k.split(":")[1] === denom
        )?.[1]

    if (
      ibcToken &&
      whitelist[networkName][ibcToken?.token] &&
      (!chainID || ibcToken?.chainID === chainID)
    ) {
      return {
        ...whitelist[networkName][ibcToken?.token],
        type: tokenType,
        // @ts-expect-error
        chains: [ibcToken?.chainID],
      }
    }

    if (denom === "uluna") {
      if (chainID === "columbus-5" || (!chainID && networkName === "classic")) {
        return {
          token: denom,
          symbol: "LUNC",
          name: "Luna Classic",
          icon: "https://assets.terra.dev/icon/svg/LUNC.svg",
          decimals: 6,
          isNonWhitelisted: false,
        }
      } else if (chainID === "phoenix-1" || chainID === "pisco-1") {
        return {
          token: denom,
          symbol: "LUNA",
          name: "Luna",
          icon: "https://assets.terra.dev/icon/svg/Luna.svg",
          decimals: 6,
          isNonWhitelisted: false,
        }
      }
    }

    const CHAIN_ICON =
      networks[chainID ?? ""]?.icon ||
      "https://assets.terra.dev/icon/svg/Terra.svg"

    return (
      cw20.find(({ token }) => denom === token) ?? {
        // default token icon
        token: denom,
        symbol: fixedDenom,
        name: fixedDenom,
        type: tokenType,
        icon:
          (tokenType === TokenType.IBC
            ? "https://assets.terra.dev/icon/svg/IBC.svg"
            : tokenType === TokenType.STRIDE
            ? "https://station-assets.terra.dev/img/chains/Stride.png"
            : (tokenType === TokenType.FACTORY || TokenType.GAMM) &&
              factoryIcon) || CHAIN_ICON,
        decimals,
        isNonWhitelisted: true,
      }
    )
  }

  return readNativeDenom
}

export const readIBCDenom = (item: IBCTokenItem): TokenItem => {
  const { denom, base_denom } = item
  const symbol =
    item.symbol ?? ((base_denom && readDenom(base_denom)) || base_denom)
  const path = symbol ? `ibc/${symbol}.svg` : "IBC.svg"

  return {
    token: denom,
    symbol: symbol ?? truncate(denom),
    icon: getIcon(path),
    decimals: item.decimals ?? 6,
  }
}

export const usePortfolioValue = () => {
  const readNativeDenom = useNativeDenoms()
  const coins = useBankBalance()
  const { data: prices } = useExchangeRates()

  return coins?.reduce((acc, { amount, denom }) => {
    const { token, decimals, symbol } = readNativeDenom(denom)
    return (
      acc +
      (parseInt(amount) *
        (symbol?.endsWith("...") ? 0 : prices?.[token]?.price ?? 0)) /
        10 ** decimals
    )
  }, 0)
}

interface IBCDenom {
  baseDenom: string
  chainID: string
  chainIDs: string[]
}

export const useUnknownIBCDenoms = () => {
  const readNativeDenom = useNativeDenoms()
  const coins = useBankBalance()

  const unknownIBCDenomsData = useIBCBaseDenoms(
    coins
      .map(({ denom, chain }) => ({ denom, chainID: chain }))
      .filter(({ denom, chainID }) => {
        const data = readNativeDenom(denom, chainID)
        return denom.startsWith("ibc/") && data.symbol.endsWith("...")
      })
  )
  const unknownIBCDenoms = unknownIBCDenomsData.reduce(
    (acc, { data }) =>
      data
        ? {
            ...acc,
            [[data.ibcDenom, data.chainIDs[data.chainIDs.length - 1]].join(
              "*"
            )]: {
              baseDenom: data.baseDenom,
              chainID: data?.chainIDs[0],
              chainIDs: data?.chainIDs,
            },
          }
        : acc,
    {} as Record<string, IBCDenom>
  )
  return unknownIBCDenoms
}

interface ChainTokenItem {
  denom: string
  id: string
  balance: number
  decimals: number
  chainID: string
  chainName: string
  chainIcon: string
}

export interface AssetItem {
  //balance: string
  denom: string
  decimals: number
  totalBalance: string
  icon?: string
  symbol: string
  price: number
  change: number
  tokenChainInfo: ChainTokenItem[]
  nativeChain: string
  id: string
  whitelisted: boolean
  totalValue: number
}

export const useParsedAssetList = () => {
  const unknownIBCDenoms = useUnknownIBCDenoms()
  const { data: prices } = useExchangeRates()
  const readNativeDenom = useNativeDenoms()
  const coins = useBankBalance()
  const networks = useNetwork()

  const list = useMemo(() => {
    return (
      coins.reduce((acc, { denom, amount, chain }) => {
        const ibcDenomData = unknownIBCDenoms[[denom, chain].join("*")]
        const { chainID, symbol, decimals, token, icon, isNonWhitelisted } =
          readNativeDenom(
            ibcDenomData?.baseDenom ?? denom,
            ibcDenomData?.chainID ?? chain
          )

        const nativeChain = chainID ?? ibcDenomData?.chainID ?? chain

        const tokenID = `${nativeChain}*${token}`

        let tokenIcon, tokenPrice, tokenChange, tokenWhitelisted
        if (symbol === "LUNC") {
          tokenIcon = "https://assets.terra.dev/icon/svg/LUNC.svg"
          tokenPrice = prices?.["uluna:classic"]?.price ?? 0
          tokenChange = prices?.["uluna:classic"]?.change ?? 0
          tokenWhitelisted = true
        } else {
          tokenIcon = icon
          tokenPrice = prices?.[token]?.price ?? 0
          tokenChange = prices?.[token]?.change ?? 0
          tokenWhitelisted = !(
            isNonWhitelisted ||
            ibcDenomData?.chainIDs.find((c: any) => !networks[c])
          )
        }

        const supported = chain
          ? !(
              ibcDenomData?.baseDenom === token &&
              ibcDenomData?.chainID === nativeChain
            )
          : ibcDenomData?.baseDenom === token

        const { name: chainName, icon: chainIcon } = networks[chain] || {}
        const chainTokenItem = {
          denom,
          id: `${token}*${chain}`,
          decimals,
          balance: parseInt(amount),
          tokenPrice,
          chainID: chain,
          chainName,
          chainIcon,
          tokenIcon,
          supported,
        }

        if (acc[tokenID]) {
          if (chainTokenItem.supported) {
            acc[tokenID].totalBalance = `${
              parseInt(acc[tokenID].totalBalance) + parseInt(amount)
            }`
            acc[tokenID].totalValue = acc[tokenID].totalValue +=
              toInput(amount, decimals) * tokenPrice
          }
          acc[tokenID].tokenChainInfo.push(chainTokenItem)
          return acc
        } else {
          const totalBalance = supported ? amount : "0"
          const totalValue = supported
            ? tokenPrice * toInput(amount, decimals)
            : 0

          const result: Record<string, AssetItem> = {
            ...acc,
            [tokenID]: {
              denom: token,
              id: tokenID,
              decimals,
              totalBalance,
              totalValue,
              icon: tokenIcon,
              symbol,
              price: tokenPrice,
              change: tokenChange,
              tokenChainInfo: [chainTokenItem],
              nativeChain: nativeChain,
              whitelisted: tokenWhitelisted,
            },
          }

          return result
        }
      }, {} as Record<string, AssetItem>) ?? {}
    )
  }, [coins, readNativeDenom, unknownIBCDenoms, prices, networks])
  return Object.values(list)
}
