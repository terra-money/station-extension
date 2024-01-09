import { DEFAULT_GAS_ADJUSTMENT } from "config/constants"
import themes from "styles/themes/themes"
import { useCallback, useEffect, useState } from "react"
import { atom, useRecoilState } from "recoil"
import { CustomNetwork, InterchainNetwork } from "types/network"
import { AccAddress } from "@terra-money/feather.js"
import browser from "webextension-polyfill"

export enum SettingKey {
  Theme = "Theme",
  Currency = "FiatCurrency",
  SwapSlippage = "SwapSlippage",
  CustomNetworks = "CustomNetworks",
  CustomChains = "CustomChains",
  GasAdjustment = "GasAdjust", // Tx
  AddressBook = "AddressBook", // Send
  OnlyShowWhitelist = "OnlyShowWhitelist",
  Network = "Network",
  CustomLCD = "CustomLCD",
  HideLowBalTokens = "HideLowBalTokens",
  CustomTokens = "CustomTokensInterchain", // Wallet
  MinimumValue = "MinimumValue", // Wallet (UST value to show on the list)
  WithdrawAs = "WithdrawAs", // Rewards (Preferred denom to withdraw rewards)
  EnabledNetworks = "EnabledNetworks",
  NetworkCacheTime = "NetworkCacheTime",
  DevMode = "DevMode",
  RecentRecipients = "RecentRecipients",
}

//const isSystemDarkMode =
//  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches

export const DefaultTheme = themes[1]

export const DefaultCustomTokensItem = (chainID: string) => ({
  cw20: [],
  cw721: [],
  native: [
    {
      denom: "uluna",
      id: `${chainID}:uluna`,
    },
  ],
})

const DefaultCustomTokens = { mainnet: DefaultCustomTokensItem("phoenix-1") }

export const DefaultSettings = {
  [SettingKey.Theme]: DefaultTheme,
  [SettingKey.Currency]: {
    id: "USD",
    name: "United States Dollar",
    symbol: "$",
  },
  [SettingKey.CustomNetworks]: [] as CustomNetwork[],
  [SettingKey.CustomChains]: {
    mainnet: {},
    testnet: {},
    classic: {},
  } as Record<string, Record<string, InterchainNetwork>>,
  [SettingKey.GasAdjustment]: DEFAULT_GAS_ADJUSTMENT,
  [SettingKey.AddressBook]: [] as AddressBook[],
  [SettingKey.RecentRecipients]: [] as AccAddress[],
  [SettingKey.CustomTokens]: DefaultCustomTokens as CustomTokens,
  [SettingKey.MinimumValue]: 0,
  [SettingKey.NetworkCacheTime]: 0,
  [SettingKey.SwapSlippage]: "0.5",
  [SettingKey.OnlyShowWhitelist]: true,
  [SettingKey.HideLowBalTokens]: true,
  [SettingKey.WithdrawAs]: "",
  [SettingKey.Network]: "",
  [SettingKey.EnabledNetworks]: { time: 0, networks: [] as string[] },
  [SettingKey.CustomLCD]: {},
  [SettingKey.DevMode]: false,
}

export const getLocalSetting = <T>(key: SettingKey): T => {
  const localItem = localStorage.getItem(key)

  if (!localItem) return DefaultSettings[key] as unknown as T

  try {
    return JSON.parse(localItem)
  } catch {
    return localItem as unknown as T
  }
}

export const setLocalSetting = <T>(key: SettingKey, value: T) => {
  const item = typeof value === "string" ? value : JSON.stringify(value)
  localStorage.setItem(key, item)
}

export const onlyShowWhitelistState = atom({
  key: "onlyShowWhitelist",
  default: !!getLocalSetting(SettingKey.OnlyShowWhitelist),
})

export const hideLowBalTokenState = atom({
  key: "hideLowBalTokenState",
  default: !!getLocalSetting(SettingKey.HideLowBalTokens),
})

export const savedNetworkState = atom({
  key: "savedNetwork",
  default: getLocalSetting(SettingKey.Network) as string | undefined,
})

export const recentRecipients = atom({
  key: "recentRecipients",
  default: getLocalSetting(SettingKey.RecentRecipients) as AddressBook[],
})

export const customLCDState = atom({
  key: "customLCD",
  default: getLocalSetting<Record<string, string | undefined>>(
    SettingKey.CustomLCD
  ),
})

export const customChainsState = atom({
  key: "customChains",
  default: getLocalSetting<Record<string, Record<string, InterchainNetwork>>>(
    SettingKey.CustomChains
  ),
})

export const devModeState = atom({
  key: "devModeState",
  default: !!getLocalSetting(SettingKey.DevMode),
})

export const swapSlippageState = atom({
  key: "swapSlippageState",
  default: getLocalSetting(SettingKey.SwapSlippage) as string,
})

export const useShowWelcomeModal = () => {
  return localStorage.getItem("welcomeModal") === null
}

export const useSavedNetwork = () => {
  const [savedNetwork, setSavedNetwork] = useRecoilState(savedNetworkState)
  const changeSavedNetwork = useCallback(
    (newNetwork: string | undefined) => {
      setLocalSetting(SettingKey.Network, newNetwork)
      setSavedNetwork(newNetwork)
    },
    [setSavedNetwork]
  )
  return { savedNetwork, changeSavedNetwork }
}

export const useCustomLCDs = () => {
  const [customLCDs, setCustomLCDs] = useRecoilState(customLCDState)
  const changeCustomLCDs = (chainID: string, lcd: string | undefined) => {
    const newLCDs = { ...customLCDs, [chainID]: lcd }
    setLocalSetting(SettingKey.CustomLCD, newLCDs)
    setCustomLCDs(newLCDs)
  }
  return { customLCDs, changeCustomLCDs }
}

export const useCustomChains = () => {
  const [customChains, setCustomChains] = useRecoilState(customChainsState)
  return {
    customChains,
    setCustomChains: (
      chains: Record<string, Record<string, InterchainNetwork>>
    ) => {
      setLocalSetting(SettingKey.CustomChains, chains)
      setCustomChains(chains)
    },
    deleteCustomChain: (chainID: string) => {
      const newChains = Object.fromEntries(
        Object.entries(customChains ?? {}).map(([key, value]) => [
          key,
          Object.fromEntries(
            Object.entries(value ?? {}).filter(([key]) => key !== chainID) ?? {}
          ),
        ]) ?? {}
      )
      setLocalSetting(SettingKey.CustomChains, newChains)
      setCustomChains(newChains)
    },
  }
}

export const useSwapSlippage = () => {
  const [slippage, setSlippage] = useRecoilState(swapSlippageState)

  const changeSlippage = useCallback(
    (slippage: string) => {
      setLocalSetting(SettingKey.SwapSlippage, slippage)
      setSlippage(slippage)
    },
    [setSlippage]
  )

  return {
    slippage,
    changeSlippage,
  }
}

export const useTokenFilters = () => {
  const [onlyShowWhitelist, setOnlyShowWhitelist] = useRecoilState(
    onlyShowWhitelistState
  )
  const toggleOnlyShowWhitelist = useCallback(() => {
    setLocalSetting(SettingKey.OnlyShowWhitelist, !onlyShowWhitelist)
    setOnlyShowWhitelist(!onlyShowWhitelist)
  }, [onlyShowWhitelist, setOnlyShowWhitelist])

  const [hideLowBal, setHideLowBal] = useRecoilState(hideLowBalTokenState)
  const toggleHideLowBal = useCallback(() => {
    setLocalSetting(SettingKey.HideLowBalTokens, !hideLowBal)
    setHideLowBal(!hideLowBal)
  }, [hideLowBal, setHideLowBal])

  return {
    onlyShowWhitelist,
    toggleOnlyShowWhitelist,
    toggleHideLowBal,
    hideLowBal,
  }
}

export const useRecentRecipients = () => {
  const [recipients, setRecipients] = useRecoilState(recentRecipients)
  const addRecipient = useCallback(
    (recipient: AddressBook) => {
      if (recipients.find((r) => r.recipient === recipient.recipient)) return
      const newRecipients = [recipient, ...recipients].splice(0, 2)
      setLocalSetting(SettingKey.RecentRecipients, newRecipients)
      setRecipients(newRecipients)
    },
    [recipients, setRecipients]
  )

  return { recipients, addRecipient }
}

const toggleSetting = (
  key: SettingKey,
  state: boolean,
  setState: (state: boolean) => void
) => {
  setLocalSetting(key, !state)
  setState(!state)
}

export const useDevMode = () => {
  const [devMode, setDevMode] = useRecoilState(devModeState)
  const changeDevMode = () =>
    toggleSetting(SettingKey.DevMode, devMode, setDevMode)

  return { changeDevMode, devMode }
}

export const useReplaceKeplr = () => {
  const [replaceKeplr, setReplaceKeplr] = useState(false)

  useEffect(() => {
    // if extension env
    if (browser?.storage?.local?.get) {
      browser.storage.local.get(["replaceKeplr"]).then(({ replaceKeplr }) => {
        setReplaceKeplr(!!replaceKeplr)
      })
    }
    // test env
    else {
      setReplaceKeplr(localStorage.getItem("replaceKeplr") === "true")
    }
  }, [])

  return {
    setReplaceKeplr: (state: boolean) => {
      setReplaceKeplr(state)
      // if extension env
      if (browser?.storage?.local?.set) {
        browser.storage.local.set({ replaceKeplr: state })
      }
      // test env
      else {
        localStorage.setItem("replaceKeplr", `${state}`)
      }
    },
    replaceKeplr,
  }
}
