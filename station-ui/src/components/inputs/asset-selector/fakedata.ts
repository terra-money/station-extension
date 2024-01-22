
interface IWalletBalance {
  [key: string]: string;
}

const walletBalance: IWalletBalance = {
  LUNA: "420.123456789",
  UST: "0.00",
  axlUSDC: "100.00",
}

interface ITokensBySymbol {
  [key: string]: {
    symbol: string;
    tokenIcon: string;
    chainIcon: string;
    chainName: string;
  }
}

const tokensBySymbol: ITokensBySymbol  = {
  "LUNA": {
    symbol: "LUNA",
    tokenIcon: "https://station-assets.terra.dev/img/coins/Luna.svg",
    chainIcon: "https://station-assets.terra.dev/img/chains/Terra.svg",
    chainName: "Terra",
  },
  "axlUSDC": {
    symbol: "axlUSDC",
    tokenIcon: "https://station-assets.terra.dev/img/coins/axlUSDC.svg",
    chainIcon: "https://station-assets.terra.dev/img/chains/Axelar.svg",
    chainName: "Axelar",
  },
  "OSMO": {
    symbol: "OSMO",
    tokenIcon: "https://station-assets.terra.dev/img/coins/Osmo.svg",
    chainIcon: "https://station-assets.terra.dev/img/chains/Cosmos.svg",
    chainName: "Cosmos",
  },
  "OSMO2": {
    symbol: "OSMO2",
    tokenIcon: "https://station-assets.terra.dev/img/coins/Osmo.svg",
    chainIcon: "https://station-assets.terra.dev/img/chains/Cosmos.svg",
    chainName: "Cosmos",
  },
  "OSMO3": {
    symbol: "OSMO3",
    tokenIcon: "https://station-assets.terra.dev/img/coins/Osmo.svg",
    chainIcon: "https://station-assets.terra.dev/img/chains/Cosmos.svg",
    chainName: "Cosmos",
  },
}

interface ITokenPrices {
  [key: string]: number;
}

const tokenPrices: ITokenPrices  = {
  "LUNA": 0.39144,
  "axlUSDC": 1,
  "OSMO": 0.325555,
}

export { walletBalance, tokensBySymbol, tokenPrices }
