
interface IWalletBalance {
  [key: string]: string;
}

const walletBalance: IWalletBalance = {
  LUNA: '420.00',
  UST: '0.00',
  ANC: '0.00',
  MIR: '0.00',
  axlUSDC: '0.00',
};

interface ITokensBySymbol {
  [key: string]: {
    symbol: string;
    tokenIcon: string;
    chainIcon: string;
    chainName: string;
  };
}

const tokensBySymbol: ITokensBySymbol  = {
  'LUNA': {
    symbol: 'LUNA',
    tokenIcon: 'https://74bdae33.station-assets.pages.dev/img/coins/Luna.svg',
    chainIcon: 'https://d63be712.station-assets.pages.dev/img/chains/Terra.svg',
    chainName: 'Terra',
  },
  'axlUSDC': {
    symbol: 'axlUSDC',
    tokenIcon: 'https://74bdae33.station-assets.pages.dev/img/coins/axlUSDC.svg',
    chainIcon: 'https://d63be712.station-assets.pages.dev/img/chains/Axelar.svg',
    chainName: 'Axelar',
  },
  'OSMO': {
    symbol: 'OSMO',
    tokenIcon: 'https://74bdae33.station-assets.pages.dev/img/coins/Osmo.svg',
    chainIcon: 'https://d63be712.station-assets.pages.dev/img/chains/Cosmos.svg',
    chainName: 'Cosmos',
  },
};
interface ITokenPrices {
  [key: string]: number;
}

const tokenPrices: ITokenPrices  = {
  'LUNA': 0.0001,
  'axlUSDC': 1,
  'ANC': 0.0001,
  'MIR': 0.0001,
};

export { walletBalance, tokensBySymbol, tokenPrices };