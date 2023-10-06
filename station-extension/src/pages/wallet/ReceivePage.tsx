import { useMemo } from "react"
import { getChainNamefromID } from "data/queries/chains"
import { useNetwork } from "data/wallet"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import WithSearchInput from "pages/custom/WithSearchInput"
import { AddressSelectableListItem } from "station-ui"
import { truncate } from "@terra-money/terra-utils"
import { capitalize } from "@mui/material"
import styles from "./ReceivePage.module.scss"
import { useWalletRoute, Page } from "./Wallet"

const ReceivePage = () => {
  const addresses = useInterchainAddresses()
  const networks = useNetwork()
  const { setRoute } = useWalletRoute()

  const data = useMemo(() => {
    if (!addresses) return []
    return Object.keys(addresses ?? {}).map((key) => ({
      address: addresses[key],
      name: getChainNamefromID(key, networks) ?? key,
      id: key,
    }))
  }, [addresses, networks])

  if (!data.length) return null

  return (
    <WithSearchInput label="Search Chains" className={styles.receive}>
      {(input) => {
        return data
          .filter((item) =>
            item.name.toLowerCase().includes(input.toLowerCase())
          )
          .map((item) => (
            <AddressSelectableListItem
              key={item.id}
              label={capitalize(item.name)}
              chain={{
                icon: networks[item.id].icon,
                label: item.name,
              }}
              subLabel={truncate(item.address)}
              onClick={() => {
                setRoute({
                  page: Page.address,
                  address: item.address,
                  previous: { page: Page.receive },
                })
              }}
            />
          ))
      }}
    </WithSearchInput>
  )
}

export default ReceivePage
