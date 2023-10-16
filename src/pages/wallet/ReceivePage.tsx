import { useMemo } from "react"
import { getChainNamefromID } from "data/queries/chains"
import { useNetwork } from "data/wallet"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import WithSearchInput from "pages/custom/WithSearchInput"
import { AddressSelectableListItem, Button } from "station-ui"
import { truncate } from "@terra-money/terra-utils"
import { capitalize } from "@mui/material"
import styles from "./ReceivePage.module.scss"
import { useWalletRoute, Page } from "./Wallet"
import { useTranslation } from "react-i18next"

interface SearchChainsProps {
  data: {
    name: string
    id: string
    address: string
    onClick: (param?: any) => void
  }[]
}

export const SearchChains = ({ data }: SearchChainsProps) => {
  const networks = useNetwork()
  return (
    <>
      <WithSearchInput label="Search Chains" className={styles.receive}>
        {(input) =>
          data
            .filter((item) =>
              item.name.toLowerCase().includes(input.toLowerCase())
            )
            .map(({ address, id, name, onClick }) => (
              <AddressSelectableListItem
                key={id}
                label={capitalize(name)}
                chain={{
                  icon: networks[id].icon,
                  label: name,
                }}
                subLabel={truncate(address)}
                onClick={onClick}
              />
            ))
        }
      </WithSearchInput>
    </>
  )
}

const ReceivePage = () => {
  const addresses = useInterchainAddresses()
  const { setRoute } = useWalletRoute()
  const networks = useNetwork()
  const { t } = useTranslation()

  const data = useMemo(() => {
    if (!addresses) return []
    return Object.keys(addresses ?? {}).map((key) => ({
      address: addresses[key],
      name: getChainNamefromID(key, networks) ?? key,
      id: key,
      onClick: () => {
        setRoute({
          page: Page.address,
          address: addresses[key],
        })
      },
    }))
  }, [addresses, networks, setRoute])

  if (!data.length) return null

  return (
    <>
      <SearchChains data={data} />
      <Button
        label={t("Back")}
        className={styles.back}
        onClick={() => setRoute({ page: Page.wallet })}
        variant="secondary"
      />
    </>
  )
}

export default ReceivePage
