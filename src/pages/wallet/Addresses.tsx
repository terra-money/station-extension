import { useMemo } from "react"
import { getChainNamefromID } from "data/queries/chains"
import { useNetwork } from "data/wallet"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import WithSearchInput from "pages/custom/WithSearchInput"
import { ModalButton, AddressSelectableListItem } from "station-ui"
import AddressChain from "pages/wallet/AddressChain"

const Addresses = () => {
  const addresses = useInterchainAddresses()
  const networks = useNetwork()

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
    <WithSearchInput>
      {(input) => {
        return data
          .filter((item) =>
            item.name.toLowerCase().includes(input.toLowerCase())
          )
          .map((item) => (
            <ModalButton
              renderButton={(open) => (
                <AddressSelectableListItem
                  key={item.id}
                  label={item.name}
                  subLabel={item.address}
                  onClick={open}
                />
              )}
            >
              <AddressChain address={item.address} />
            </ModalButton>
          ))
      }}
    </WithSearchInput>
  )
}

export default Addresses
