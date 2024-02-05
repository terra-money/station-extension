export const networks = {
  mainnet: {
    "akashnet-2": {
      chainID: "akashnet-2",
      lcd: "https://lcd-akash.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { uakt: 0.0025 },
      prefix: "akash",
      coinType: "118",
      baseAsset: "uakt",
      name: "Akash",
      icon: "https://station-assets.terra.dev/img/chains/Akash.svg",
      channels: {
        "phoenix-1": "channel-116",
        "cosmoshub-4": "channel-17",
        "crescent-1": "channel-70",
        "juno-1": "channel-35",
        "kaiyo-1": "channel-63",
        "osmosis-1": "channel-9"
      },
      explorer: {
        address: "https://www.mintscan.io/akash/account/{}",
        tx: "https://www.mintscan.io/akash/txs/{}",
        validator: "https://www.mintscan.io/akash/validators/{}",
        block: "https://www.mintscan.io/akash/blocks/id/{}"
      }
    },
    "andromeda-1": {
      chainID: "andromeda-1",
      lcd: "https://andromeda.api.kjnodes.com",
      gasAdjustment: 1.75,
      gasPrices: { uandr: 0.25 },
      prefix: "andr",
      coinType: "118",
      baseAsset: "uandr",
      name: "Andromeda",
      icon: "https://station-assets.terra.dev/img/chains/Andromeda.png",
      channels: { "phoenix-1": "channel-12", "archway-1": "channel-11" },
      explorer: {
        address: "https://explorer.stavr.tech/Andromeda-Mainnet/account/{}",
        tx: "https://explorer.stavr.tech/Andromeda-Mainnet/tx/{}",
        validator:
          "https://explorer.stavr.tech/Andromeda-Mainnet/validators/{}",
        block: "https://explorer.stavr.tech/Andromeda-Mainnet/blocks/id/{}"
      }
    },
    "archway-1": {
      chainID: "archway-1",
      lcd: "https://lcd-archway.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { aarch: 1500000000000 },
      prefix: "archway",
      coinType: "118",
      baseAsset: "aarch",
      name: "Archway",
      icon: "https://station-assets.terra.dev/img/chains/Archway.png",
      channels: {
        "axelar-dojo-1": "channel-13",
        "cosmoshub-4": "channel-0",
        "kaiyo-1": "channel-11",
        "osmosis-1": "channel-1",
        "juno-1": "channel-15",
        "crescent-1": "channel-6",
        "andromeda-1": "channel-97"
      },
      explorer: {
        address: "https://www.mintscan.io/archway/account/{}",
        tx: "https://www.mintscan.io/archway/txs/{}",
        validator: "https://www.mintscan.io/archway/validators/{}",
        block: "https://www.mintscan.io/archway/blocks/id/{}"
      }
    },
    "axelar-dojo-1": {
      chainID: "axelar-dojo-1",
      lcd: "https://lcd-axelar.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { uaxl: 0.007 },
      prefix: "axelar",
      coinType: "118",
      baseAsset: "uaxl",
      name: "Axelar",
      icon: "https://station-assets.terra.dev/img/chains/Axelar.svg",
      channels: {
        "phoenix-1": "channel-11",
        "kaiyo-1": "channel-14",
        "crescent-1": "channel-7",
        "juno-1": "channel-4",
        "osmosis-1": "channel-3",
        "cosmoshub-4": "channel-2",
        "carbon-1": "channel-37",
        "comdex-1": "channel-31",
        "stride-1": "channel-64",
        "pacific-1": "channel-103",
        "archway-1": "channel-111",
        "neutron-1": "channel-78",
        "injective-1": "channel-10"
      },
      explorer: {
        address: "https://www.mintscan.io/axelar/account/{}",
        tx: "https://www.mintscan.io/axelar/txs/{}",
        validator: "https://www.mintscan.io/axelar/validators/{}",
        block: "https://www.mintscan.io/axelar/blocks/id/{}"
      }
    },
    "carbon-1": {
      chainID: "carbon-1",
      lcd: "https://lcd-carbon.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { swth: 1000 },
      prefix: "swth",
      coinType: "118",
      baseAsset: "swth",
      name: "Carbon",
      icon: "https://station-assets.terra.dev/img/chains/Carbon.svg",
      alliance: true,
      channels: {
        "phoenix-1": "channel-12",
        "axelar-dojo-1": "channel-7",
        "stride-1": "channel-8",
        "cosmoshub-4": "channel-3",
        "kaiyo-1": "channel-9",
        "osmosis-1": "channel-0",
        "stafihub-1": "channel-13",
        "stargaze-1": "channel-15"
      },
      explorer: {
        address: "https://scan.carbon.network/account/{}?net=main",
        tx: "https://scan.carbon.network/transaction/{}?net=main",
        validator: "https://scan.carbon.network/validator/{}?net=main",
        block: "https://scan.carbon.network/block/{}?net=main"
      }
    },
    celestia: {
      chainID: "celestia",
      lcd: "https://lcd-celestia.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { utia: 0.02 },
      prefix: "celestia",
      coinType: "118",
      baseAsset: "utia",
      name: "Celestia",
      icon: "https://station-assets.terra.dev/img/chains/Celestia.svg",
      channels: { "osmosis-1": "channel-2", "phoenix-1": "channel-15" },
      icsChannels: {},
      explorer: {
        address: "https://www.mintscan.io/celestia/account/{}",
        tx: "https://www.mintscan.io/celestia/txs/{}",
        validator: "https://www.mintscan.io/celestia/validators/{}",
        block: "https://www.mintscan.io/celestia/blocks/id/{}"
      }
    },
    "cheqd-mainnet-1": {
      chainID: "cheqd-mainnet-1",
      lcd: "https://lcd-cheqd.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { ncheq: 75 },
      prefix: "cheqd",
      coinType: "118",
      baseAsset: "ncheq",
      name: "Cheqd",
      icon: "https://station-assets.terra.dev/img/chains/Cheqd.svg",
      channels: { "phoenix-1": "channel-34", "osmosis-1": "channel-0" },
      explorer: {
        address: "https://explorer.cheqd.io/accounts/{}",
        tx: "https://explorer.cheqd.io/transactions/{}",
        validator: "https://explorer.cheqd.io/validators/{}",
        block: "https://explorer.cheqd.io/blocks/{}"
      }
    },
    "chihuahua-1": {
      chainID: "chihuahua-1",
      lcd: "https://api.chihuahua.wtf",
      gasAdjustment: 2,
      gasPrices: { uhuahua: 1250 },
      prefix: "chihuahua",
      coinType: "118",
      baseAsset: "uhuahua",
      name: "Chihuahua",
      icon: "https://station-assets.terra.dev/img/chains/Huahua.png",
      channels: {
        "phoenix-1": "channel-34",
        "juno-1": "channel-11",
        "migaloo-1": "channel-39",
        "osmosis-1": "channel-7",
        "stafihub-1": "channel-25"
      },
      explorer: {
        address: "https://www.mintscan.io/chihuahua/account/{}",
        tx: "https://www.mintscan.io/chihuahua/txs/{}",
        validator: "https://www.mintscan.io/chihuahua/validators/{}",
        block: "https://www.mintscan.io/chihuahua/blocks/id/{}"
      }
    },
    "comdex-1": {
      chainID: "comdex-1",
      lcd: "https://lcd-comdex.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { ucmdx: 0.025 },
      prefix: "comdex",
      coinType: "118",
      baseAsset: "ucmdx",
      name: "Comdex",
      icon: "https://station-assets.terra.dev/img/chains/Comdex.svg",
      channels: {
        "phoenix-1": "channel-51",
        "axelar-dojo-1": "channel-34",
        "crescent-1": "channel-26",
        "juno-1": "channel-18",
        "migaloo-1": "channel-63",
        "osmosis-1": "channel-1",
        "stride-1": "channel-45"
      },
      explorer: {
        address: "https://www.mintscan.io/comdex/account/{}",
        tx: "https://www.mintscan.io/comdex/txs/{}",
        validator: "https://www.mintscan.io/comdex/validators/{}",
        block: "https://www.mintscan.io/comdex/blocks/id/{}"
      }
    },
    "cosmoshub-4": {
      chainID: "cosmoshub-4",
      lcd: "https://lcd-cosmoshub.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { uatom: 0.025 },
      prefix: "cosmos",
      coinType: "118",
      baseAsset: "uatom",
      name: "Cosmos",
      icon: "https://station-assets.terra.dev/img/chains/Cosmos.svg",
      channels: {
        "phoenix-1": "channel-339",
        "axelar-dojo-1": "channel-293",
        "carbon-1": "channel-342",
        "akashnet-2": "channel-184",
        "crescent-1": "channel-326",
        "juno-1": "channel-207",
        "kaiyo-1": "channel-343",
        "osmosis-1": "channel-141",
        "stride-1": "channel-391",
        "pacific-1": "channel-584",
        "archway-1": "channel-623",
        "noble-1": "channel-536",
        "stafihub-1": "channel-369",
        "neutron-1": "channel-569",
        "injective-1": "channel-220"
      },
      explorer: {
        address: "https://www.mintscan.io/cosmos/account/{}",
        tx: "https://www.mintscan.io/cosmos/txs/{}",
        validator: "https://www.mintscan.io/cosmos/validators/{}",
        block: "https://www.mintscan.io/cosmos/blocks/id/{}"
      }
    },
    "crescent-1": {
      chainID: "crescent-1",
      lcd: "https://lcd-crescent.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { ucre: 0.025 },
      prefix: "cre",
      coinType: "118",
      baseAsset: "ucre",
      name: "Crescent",
      icon: "https://station-assets.terra.dev/img/chains/Crescent.svg",
      channels: {
        "phoenix-1": "channel-27",
        "axelar-dojo-1": "channel-4",
        "akashnet-2": "channel-44",
        "comdex-1": "channel-49",
        "cosmoshub-4": "channel-1",
        "juno-1": "channel-3",
        "kaiyo-1": "channel-42",
        "mars-1": "channel-35",
        "osmosis-1": "channel-9",
        "stride-1": "channel-29",
        "archway-1": "channel-65",
        "noble-1": "channel-38",
        "injective-1": "channel-23",
        "stargaze-1": "channel-21"
      },
      explorer: {
        address: "https://www.mintscan.io/crescent/account/{}",
        tx: "https://www.mintscan.io/crescent/txs/{}",
        validator: "https://www.mintscan.io/crescent/validators/{}",
        block: "https://www.mintscan.io/crescent/blocks/id/{}"
      }
    },
    "mainnet-3": {
      chainID: "mainnet-3",
      lcd: "https://lcd-decentr.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { udec: 0.025 },
      prefix: "decentr",
      coinType: "118",
      baseAsset: "udec",
      name: "Decentr",
      icon: "https://station-assets.terra.dev/img/chains/Decentr.svg",
      channels: { "phoenix-1": "channel-9", "osmosis-1": "channel-1" },
      explorer: {
        address: "https://ping.pub/decentr/account/{}",
        tx: "https://ping.pub/decentr/tx/{}",
        validator: "https://ping.pub/decentr/validators/{}",
        block: "https://ping.pub/decentr/blocks/id/{}"
      }
    },
    "dydx-mainnet-1": {
      chainID: "dydx-mainnet-1",
      lcd: "https://lcd-dydx.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { adydx: 12500000000 },
      prefix: "dydx",
      coinType: "118",
      baseAsset: "adydx",
      name: "dYdX Protocol",
      icon: "https://station-assets.terra.dev/img/chains/dydx.svg",
      channels: {
        "kaiyo-1": "channel-5",
        "noble-1": "channel-0",
        "osmosis-1": "channel-3",
        "stride-1": "channel-1",
        "phoenix-1": "channel-9"
      },
      icsChannels: {},
      explorer: {
        address: "https://www.mintscan.io/dydx/account/{}",
        tx: "https://www.mintscan.io/dydx/txs/{}",
        validator: "https://www.mintscan.io/dydx/validators/{}",
        block: "https://www.mintscan.io/dydx/blocks/id/{}"
      }
    },
    "injective-1": {
      chainID: "injective-1",
      lcd: "https://lcd-injective.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { inj: 1000000000 },
      prefix: "inj",
      coinType: "60",
      baseAsset: "inj",
      name: "Injective",
      icon: "https://station-assets.terra.dev/img/chains/Injective.svg",
      channels: {
        "phoenix-1": "channel-151",
        "axelar-dojo-1": "channel-84",
        "cosmoshub-4": "channel-1",
        "crescent-1": "channel-90",
        "migaloo-1": "channel-102",
        "osmosis-1": "channel-8",
        "stride-1": "channel-89",
        "kaiyo-1": "channel-98"
      },
      explorer: {
        address: "https://www.mintscan.io/injective/account/{}",
        tx: "https://www.mintscan.io/injective/txs/{}",
        validator: "https://www.mintscan.io/injective/validators/{}",
        block: "https://www.mintscan.io/injective/blocks/id/{}"
      }
    },
    "juno-1": {
      chainID: "juno-1",
      lcd: "https://lcd-juno.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { ujuno: 0.1 },
      prefix: "juno",
      coinType: "118",
      baseAsset: "ujuno",
      name: "Juno",
      icon: "https://station-assets.terra.dev/img/chains/Juno.svg",
      channels: {
        "phoenix-1": "channel-86",
        "axelar-dojo-1": "channel-71",
        "akashnet-2": "channel-29",
        "chihuahua-1": "channel-28",
        "comdex-1": "channel-36",
        "cosmoshub-4": "channel-1",
        "crescent-1": "channel-81",
        "osmosis-1": "channel-0",
        "stride-1": "channel-139",
        "archway-1": "channel-290",
        "noble-1": "channel-224",
        "stargaze-1": "channel-20"
      },
      ics20Channels: {
        "phoenix-1": [
          {
            contract:
              "juno1v4887y83d6g28puzvt8cl0f3cdhd3y6y9mpysnsp3k8krdm7l6jqgm0rkn",
            channel: "channel-154",
            otherChannel: "channel-33"
          }
        ],
        "osmosis-1": [
          {
            contract:
              "juno1v4887y83d6g28puzvt8cl0f3cdhd3y6y9mpysnsp3k8krdm7l6jqgm0rkn",
            channel: "channel-47",
            otherChannel: "channel-169"
          }
        ]
      },
      icsChannels: {
        "phoenix-1": {
          contract:
            "juno1v4887y83d6g28puzvt8cl0f3cdhd3y6y9mpysnsp3k8krdm7l6jqgm0rkn",
          channel: "channel-154",
          otherChannel: "channel-33"
        },
        "osmosis-1": {
          contract:
            "juno1v4887y83d6g28puzvt8cl0f3cdhd3y6y9mpysnsp3k8krdm7l6jqgm0rkn",
          channel: "channel-47",
          otherChannel: "channel-169"
        }
      },
      explorer: {
        address: "https://www.mintscan.io/juno/account/{}",
        tx: "https://www.mintscan.io/juno/txs/{}",
        validator: "https://www.mintscan.io/juno/validators/{}",
        block: "https://www.mintscan.io/juno/blocks/id/{}"
      }
    },
    "kaiyo-1": {
      version: "0.46",
      chainID: "kaiyo-1",
      lcd: "https://lcd-kujira.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: {
        ukuji: 0.0051,
        "ibc/DA59C009A0B3B95E0549E6BF7B075C8239285989FF457A8EDDBB56F10B2A6986": 0.02243,
        "ibc/295548A78785A1007F232DE286149A6FF512F180AF5657780FC89C009E2C348F": 0.01785,
        "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2": 0.00193,
        "ibc/47BD209179859CDE4A2806763D7189B6E6FE13A17880FE2B42DE1E6C1E329E23": 0.02692,
        "factory/kujira1643jxg8wasy5cfcn7xm8rd742yeazcksqlg4d7/umnta": 0.02711,
        "factory/kujira1qk00h5atutpsv900x202pxx42npjr9thg58dnqpa72f2p7m2luase444a7/uusk": 0.01779
      },
      prefix: "kujira",
      coinType: "118",
      baseAsset: "ukuji",
      name: "Kujira",
      icon: "https://station-assets.terra.dev/img/chains/Kujira.png",
      channels: {
        "phoenix-1": "channel-5",
        "axelar-dojo-1": "channel-9",
        "carbon-1": "channel-46",
        "akashnet-2": "channel-64",
        "cosmoshub-4": "channel-0",
        "crescent-1": "channel-67",
        "mars-1": "channel-55",
        "migaloo-1": "channel-58",
        "osmosis-1": "channel-3",
        "stride-1": "channel-35",
        "archway-1": "channel-99",
        "noble-1": "channel-62",
        "stafihub-1": "channel-63",
        "neutron-1": "channel-75",
        "injective-1": "channel-54",
        "dydx-mainnet-1": "channel-118",
        "stargaze-1": "channel-7"
      },
      alliance: true,
      explorer: {
        address: "https://finder.kujira.network/kaiyo-1/address/{}",
        tx: "https://finder.kujira.network/kaiyo-1/tx/{}",
        validator: "https://blue.kujira.network/stake/{}",
        block: "https://finder.kujira.network/kaiyo-1/block/{}"
      }
    },
    "mars-1": {
      chainID: "mars-1",
      lcd: "https://lcd-mars.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { umars: 0 },
      prefix: "mars",
      coinType: "330",
      baseAsset: "umars",
      name: "Mars",
      icon: "https://station-assets.terra.dev/img/chains/Mars.svg",
      version: "0.46",
      channels: {
        "phoenix-1": "channel-2",
        "crescent-1": "channel-5",
        "kaiyo-1": "channel-0",
        "osmosis-1": "channel-1",
        "neutron-1": "channel-37"
      },
      explorer: {
        address: "https://explorer.marsprotocol.io/accounts/{}",
        tx: "https://explorer.marsprotocol.io/transactions/{}",
        validator: "https://explorer.marsprotocol.io/validators/{}",
        block: "https://explorer.marsprotocol.io/blocks/{}"
      }
    },
    "migaloo-1": {
      chainID: "migaloo-1",
      lcd: "https://lcd-migaloo.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: { uwhale: 2 },
      prefix: "migaloo",
      coinType: "118",
      baseAsset: "uwhale",
      name: "Migaloo",
      icon: "https://station-assets.terra.dev/img/chains/Migaloo.svg",
      alliance: true,
      channels: {
        "phoenix-1": "channel-0",
        "chihuahua-1": "channel-10",
        "comdex-1": "channel-12",
        "kaiyo-1": "channel-8",
        "osmosis-1": "channel-5",
        "pacific-1": "channel-52",
        "injective-1": "channel-3",
        "noble-1": "channel-60"
      },
      explorer: {
        address: "https://ping.pub/Migaloo/account/{}",
        tx: "https://ping.pub/Migaloo/tx/{}",
        validator: "https://ping.pub/Migaloo/staking/{}",
        block: "https://ping.pub/Migaloo/block/{}"
      }
    },
    "neutron-1": {
      chainID: "neutron-1",
      lcd: "https://lcd-neutron.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: {
        untrn: 0.84,
        "ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9": 0.03,
        "ibc/F082B65C88E4B6D5EF1DB243CDA1D331D002759E938A0F5CD3FFDC5D53B3E349": 0.3
      },
      prefix: "neutron",
      coinType: "118",
      baseAsset: "untrn",
      name: "Neutron",
      icon: "https://station-assets.terra.dev/img/chains/Neutron.png",
      disabledModules: ["staking", "gov"],
      channels: {
        "osmosis-1": "channel-10",
        "stride-1": "channel-8",
        "axelar-dojo-1": "channel-2",
        "cosmoshub-4": "channel-1",
        "mars-1": "channel-16",
        "kaiyo-1": "channel-3",
        "phoenix-1": "channel-25",
        "stargaze-1": "channel-18"
      },
      icsChannels: {},
      explorer: {
        address: "https://www.mintscan.io/neutron/account/{}",
        tx: "https://www.mintscan.io/neutron/tx/{}",
        validator: "https://www.mintscan.io/neutron/validators/{}",
        block: "https://www.mintscan.io/neutron/blocks/id/{}"
      }
    },
    "noble-1": {
      chainID: "noble-1",
      lcd: "https://lcd-noble.tfl.foundation",
      gasAdjustment: 1.75,
      gasPrices: {
        uusdc: 0.1,
        "ibc/EF48E6B1A1A19F47ECAEA62F5670C37C0580E86A9E88498B7E393EB6F49F33C0": 0.01
      },
      prefix: "noble",
      coinType: "118",
      baseAsset: "uusdc",
      name: "Noble",
      disabledModules: ["staking", "gov"],
      icon: "https://station-assets.terra.dev/img/chains/Noble.svg",
      channels: {
        "phoenix-1": "channel-30",
        "migaloo-1": "channel-14",
        "cosmoshub-4": "channel-4",
        "crescent-1": "channel-0",
        "juno-1": "channel-3",
        "osmosis-1": "channel-1",
        "kaiyo-1": "channel-2",
        "dydx-mainnet-1": "channel-33",
        "stargaze-1": "channel-11"
      },
      explorer: {
        address: "https://www.mintscan.io/noble/account/{}",
        tx: "https://www.mintscan.io/noble/txs/{}",
        validator: "https://www.mintscan.io/noble/validators/{}",
        block: "https://www.mintscan.io/noble/blocks/id/{}"
      }
    },
    "pacific-1": {
      chainID: "pacific-1",
      lcd: "https://lcd-sei.tfl.foundation",
      gasAdjustment: 2,
      gasPrices: { usei: 0.1 },
      prefix: "sei",
      coinType: "118",
      baseAsset: "usei",
      name: "Sei",
      icon: "https://station-assets.terra.dev/img/chains/sei.svg",
      channels: {
        "osmosis-1": "channel-0",
        "axelar-dojo-1": "channel-2",
        "phoenix-1": "channel-3",
        "cosmoshub-4": "channel-1",
        "migaloo-1": "channel-10",
        "stride-1": "channel-11"
      },
      explorer: {
        address: "https://www.mintscan.io/sei/account/{}",
        tx: "https://www.mintscan.io/sei/txs/{}",
        validator: "https://www.mintscan.io/sei/validators/{}",
        block: "https://www.mintscan.io/sei/blocks/id/{}"
      }
    },
    "stafihub-1": {
      chainID: "stafihub-1",
      lcd: "https://public-rest-rpc1.stafihub.io",
      gasAdjustment: 1.75,
      gasPrices: { ufis: 0.025 },
      prefix: "stafi",
      coinType: "118",
      baseAsset: "ufis",
      name: "StaFiHub",
      disabledModules: ["staking"],
      icon: "https://station-assets.terra.dev/img/chains/StaFiHub.png",
      channels: {
        "phoenix-1": "channel-9",
        "cosmoshub-4": "channel-0",
        "chihuahua-1": "channel-4",
        "carbon-1": "channel-5",
        "kaiyo-1": "channel-6"
      },
      explorer: {
        address: "https://www.mintscan.io/stafi/accounts/{}",
        tx: "https://www.mintscan.io/stafi/transactions/{}",
        validator: "https://www.mintscan.io/stafi/validators/{}",
        block: "https://www.mintscan.io/stafi/blocks/{}"
      }
    },
    "stargaze-1": {
      chainID: "stargaze-1",
      lcd: "https://lcd-stargaze.tfl.foundation",
      gasAdjustment: 1.5,
      gasPrices: { ustars: 1.2 },
      prefix: "stars",
      coinType: "118",
      baseAsset: "ustars",
      name: "Stargaze",
      icon: "https://station-assets.terra.dev/img/chains/Stargaze.png",
      channels: {
        "phoenix-1": "channel-266",
        "carbon-1": "channel-123",
        "crescent-1": "channel-51",
        "juno-1": "channel-5",
        "kaiyo-1": "channel-49",
        "neutron-1": "channel-191",
        "noble-1": "channel-204",
        "osmosis-1": "channel-0",
        "stride-1": "channel-106"
      },
      explorer: {
        address: "https://www.mintscan.io/stargaze/account/{}",
        tx: "https://www.mintscan.io/stargaze/txs/{}",
        validator: "https://www.mintscan.io/stargaze/validators/{}",
        block: "https://www.mintscan.io/stargaze/blocks/id/{}"
      }
    },
    "stride-1": {
      chainID: "stride-1",
      lcd: "https://stride-fleet.main.stridenet.co/api",
      gasAdjustment: 1.75,
      gasPrices: { ustrd: 0.005 },
      prefix: "stride",
      coinType: "118",
      baseAsset: "ustrd",
      name: "Stride",
      icon: "https://station-assets.terra.dev/img/chains/Stride.png",
      channels: {
        "phoenix-1": "channel-52",
        "axelar-dojo-1": "channel-69",
        "carbon-1": "channel-47",
        "comdex-1": "channel-49",
        "cosmoshub-4": "channel-0",
        "crescent-1": "channel-51",
        "juno-1": "channel-24",
        "kaiyo-1": "channel-18",
        "osmosis-1": "channel-5",
        "neutron-1": "channel-123",
        "pacific-1": "channel-149",
        "injective-1": "channel-6",
        "dydx-mainnet-1": "channel-160",
        "stargaze-1": "channel-19"
      },
      explorer: {
        address: "https://www.mintscan.io/stride/account/{}",
        tx: "https://www.mintscan.io/stride/txs/{}",
        validator: "https://www.mintscan.io/stride/validators/{}",
        block: "https://www.mintscan.io/stride/blocks/id/{}"
      }
    },
    "phoenix-1": {
      chainID: "phoenix-1",
      lcd: "https://phoenix-lcd.terra.dev",
      gasAdjustment: 1.75,
      gasPrices: { uluna: 0.015 },
      prefix: "terra",
      coinType: "330",
      baseAsset: "uluna",
      name: "Terra",
      icon: "https://station-assets.terra.dev/img/chains/Terra.svg",
      alliance: true,
      channels: {
        "akashnet-2": "channel-273",
        "axelar-dojo-1": "channel-6",
        "carbon-1": "channel-36",
        "cheqd-mainnet-1": "channel-301",
        "chihuahua-1": "channel-44",
        "comdex-1": "channel-39",
        "cosmoshub-4": "channel-0",
        "crescent-1": "channel-37",
        "mainnet-3": "channel-315",
        "juno-1": "channel-2",
        "kaiyo-1": "channel-10",
        "mars-1": "channel-78",
        "migaloo-1": "channel-86",
        "osmosis-1": "channel-1",
        "stride-1": "channel-46",
        "pacific-1": "channel-158",
        "noble-1": "channel-253",
        "stafihub-1": "channel-204",
        "neutron-1": "channel-229",
        "injective-1": "channel-255",
        "dydx-mainnet-1": "channel-299",
        celestia: "channel-300",
        "stargaze-1": "channel-324",
        "andromeda-1": "channel-351"
      },
      ics20Channels: {
        "carbon-1": [
          {
            contract:
              "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
            channel: "channel-41",
            otherChannel: "channel-16"
          }
        ],
        "juno-1": [
          {
            contract:
              "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
            channel: "channel-32",
            otherChannel: "channel-153"
          }
        ],
        "kaiyo-1": [
          {
            contract:
              "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
            channel: "channel-28",
            otherChannel: "channel-36"
          }
        ],
        "migaloo-1": [
          {
            contract:
              "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
            channel: "channel-87",
            otherChannel: "channel-2"
          }
        ],
        "osmosis-1": [
          {
            contract:
              "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
            channel: "channel-26",
            otherChannel: "channel-341"
          }
        ],
        "chihuahua-1": [
          {
            contract:
              "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
            channel: "channel-114",
            otherChannel: "channel-42"
          }
        ],
        "pacific-1": [
          {
            contract:
              "terra1jhfjnm39y3nn9l4520mdn4k5mw23nz0674c4gsvyrcr90z9tqcvst22fce",
            channel: "channel-171",
            otherChannel: "channel-8",
            tokens: [
              "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26"
            ]
          }
        ],
        "neutron-1": [
          {
            contract:
              "terra1jhfjnm39y3nn9l4520mdn4k5mw23nz0674c4gsvyrcr90z9tqcvst22fce",
            channel: "channel-167",
            otherChannel: "channel-5",
            tokens: [
              "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26"
            ]
          }
        ],
        "injective-1": [
          {
            contract:
              "terra1jhfjnm39y3nn9l4520mdn4k5mw23nz0674c4gsvyrcr90z9tqcvst22fce",
            channel: "channel-91",
            otherChannel: "channel-104",
            tokens: [
              "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26"
            ]
          },
          {
            contract:
              "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
            channel: "channel-116",
            otherChannel: "channel-118"
          }
        ]
      },
      icsChannels: {
        "carbon-1": {
          contract:
            "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
          channel: "channel-41",
          otherChannel: "channel-16"
        },
        "juno-1": {
          contract:
            "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
          channel: "channel-32",
          otherChannel: "channel-153"
        },
        "kaiyo-1": {
          contract:
            "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
          channel: "channel-28",
          otherChannel: "channel-36"
        },
        "migaloo-1": {
          contract:
            "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
          channel: "channel-87",
          otherChannel: "channel-2"
        },
        "osmosis-1": {
          contract:
            "terra1e0mrzy8077druuu42vs0hu7ugguade0cj65dgtauyaw4gsl4kv0qtdf2au",
          channel: "channel-26",
          otherChannel: "channel-341"
        }
      },
      explorer: {
        address: "https://terrasco.pe/mainnet/address/{}",
        tx: "https://terrasco.pe/mainnet/tx/{}",
        validator: "https://terrasco.pe/mainnet/validator/{}",
        block: "https://terrasco.pe/mainnet/block/{}"
      }
    },
    "osmosis-1": {
      chainID: "osmosis-1",
      lcd: "https://lcd-osmosis.tfl.foundation",
      gasAdjustment: 1.5,
      gasPrices: { uosmo: 0.025 },
      prefix: "osmo",
      coinType: "118",
      baseAsset: "uosmo",
      name: "Osmosis",
      icon: "https://station-assets.terra.dev/img/chains/Osmosis.svg",
      channels: {
        "phoenix-1": "channel-251",
        "axelar-dojo-1": "channel-208",
        "carbon-1": "channel-188",
        "akashnet-2": "channel-1",
        "cheqd-mainnet-1": "channel-108",
        "chihuahua-1": "channel-113",
        "comdex-1": "channel-87",
        "cosmoshub-4": "channel-0",
        "crescent-1": "channel-297",
        "mainnet-3": "channel-181",
        "juno-1": "channel-42",
        "kaiyo-1": "channel-259",
        "mars-1": "channel-557",
        "migaloo-1": "channel-642",
        "stride-1": "channel-326",
        "archway-1": "channel-1429",
        "neutron-1": "channel-874",
        "noble-1": "channel-750",
        "pacific-1": "channel-782",
        "injective-1": "channel-122",
        celestia: "channel-6994",
        "dydx-mainnet-1": "channel-6787",
        "stargaze-1": "channel-75"
      },
      explorer: {
        address: "https://www.mintscan.io/osmosis/account/{}",
        tx: "https://www.mintscan.io/osmosis/txs/{}",
        validator: "https://www.mintscan.io/osmosis/validators/{}",
        block: "https://www.mintscan.io/osmosis/blocks/id/{}"
      }
    }
  }
}
