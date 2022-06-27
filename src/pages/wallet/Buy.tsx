import { useTranslation } from "react-i18next"
import qs from "qs"
import { readDenom } from "@terra-rebels/kitchen-utils"
import { ReactComponent as Binance } from "styles/images/exchanges/Binance.svg"
import { ReactComponent as KuCoin } from "styles/images/exchanges/KuCoin.svg"
import { ReactComponent as Huobi } from "styles/images/exchanges/Huobi.svg"
import { ReactComponent as Bitfinex } from "styles/images/exchanges/Bitfinex.svg"
import { ReactComponent as Kraken } from "styles/images/exchanges/Kraken.svg"
import Transak from "styles/images/exchanges/Transak.png"
import Kado from "styles/images/exchanges/Kado.svg"
import Ramp from "styles/images/exchanges/Ramp.svg"
import { ListGroup } from "components/display"

export const exchanges = {
  uluna: [
    {
      children: "Binance",
      href: "https://www.binance.com/en/trade/LUNA_USDT",
      icon: <Binance width={24} height={24} />,
    },
    {
      children: "Huobi",
      href: "https://www.huobi.com/en-us/exchange/luna_usdt/",
      icon: <Huobi width={24} height={24} />,
    },
    {
      children: "KuCoin",
      href: "https://trade.kucoin.com/LUNA-USDT",
      icon: <KuCoin width={24} height={24} />,
    },
    {
      children: "Bitfinex",
      href: "https://trading.bitfinex.com/t/LUNA:USD",
      icon: <Bitfinex width={24} height={24} />,
    },
  ],
  uusd: [
    {
      children: "Binance",
      href: "https://www.binance.com/en/trade/UST_USDT",
      icon: <Binance width={24} height={24} />,
    },
    {
      children: "Huobi",
      href: "https://www.huobi.com/en-us/exchange/ust_usdt/",
      icon: <Huobi width={24} height={24} />,
    },
    {
      children: "KuCoin",
      href: "https://trade.kucoin.com/USDT-UST",
      icon: <KuCoin width={24} height={24} />,
    },
    {
      children: "Bitfinex",
      href: "https://trading.bitfinex.com/t/TERRAUST:USD",
      icon: <Bitfinex width={24} height={24} />,
    },
    {
      children: "Kraken",
      href: "https://trade.kraken.com/charts/KRAKEN:UST-USD",
      icon: <Kraken width={24} height={24} />,
    },
  ],
}

const TRANSAK_URL = "https://global.transak.com"
const TRANSAK_API_KEY = "f619d86d-48e0-4f2f-99a1-f827b719ac0b"
const KADO_URL = "https://ramp.kado.money"
const RAMP_URL = "https://ramp.network/buy"

const getTransakLink = (denom: "uluna" | "uusd") => {
  const queryString = qs.stringify(
    {
      apiKey: TRANSAK_API_KEY,
      cryptoCurrencyList: "UST,LUNA",
      defaultCryptoCurrency: readDenom(denom).toUpperCase(),
      networks: "terra",
    },
    { skipNulls: true, encode: false }
  )

  return `${TRANSAK_URL}/?${queryString}`
}

const getRampLink = (denom: "uluna" | "uusd") => {
  const defaultAsset = `TERRA_${readDenom(denom).toUpperCase()}`
  const queryString = qs.stringify({ defaultAsset })
  return `${RAMP_URL}/?${queryString}`
}

const Buy = ({ token }: { token: "uluna" | "uusd" }) => {
  const { t } = useTranslation()
  const TRANSAK = {
    children: "Transak",
    href: getTransakLink(token),
    icon: <img src={Transak} alt="" width={24} height={24} />,
  }

  const KADO = {
    children: "Kado Ramp",
    href: KADO_URL,
    icon: <img src={Kado} alt="Kado Ramp" width={24} height={24} />,
  }

  const RAMP = {
    children: "Ramp",
    href: getRampLink(token),
    icon: <img src={Ramp} alt="Ramp" width={24} height={24} />,
  }

  return (
    <ListGroup
      groups={[
        {
          title: t("Exchanges"),
          list: exchanges[token],
        },
        {
          title: t("Fiat"),
          list: token === "uusd" ? [TRANSAK, KADO, RAMP] : [TRANSAK, RAMP],
        },
      ]}
    />
  )
}

export default Buy
