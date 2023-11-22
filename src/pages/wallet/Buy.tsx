import qs from "qs"
import { useCallback } from "react"
import { useNetwork } from "data/wallet"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { FIAT_RAMP } from "config/constants"
import { KADO_API_KEY } from "config/constants"

export const useKado = () => {
  const addresses = useInterchainAddresses()
  const network = useNetwork()

  const onToAddressMulti =
    addresses &&
    Object.keys(addresses)
      .map((key) => `${network[key].name}:${addresses[key]}`)
      .join(",")

  const rampParams = {
    network: "Terra",
    apiKey: KADO_API_KEY,
    product: "BUY",
    onRevCurrency: "USDC",
    networkList: ["TERRA", "OSMOSIS", "KUJIRA", "JUNO"].join(","),
    productList: ["BUY", "SELL"].join(","),
    cryptoList: ["USDC"].join(","),
    onToAddressMulti,
  }

  const kadoUrlParams = qs.stringify(rampParams)

  const openModal = useCallback(() => {
    const url = `${FIAT_RAMP}?${kadoUrlParams}`
    window.open(
      url,
      "_blank",
      "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width=420,height=680"
    )
  }, [kadoUrlParams])

  return { openModal }
}
