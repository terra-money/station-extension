import { useAllNetworks } from "data/wallet"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import WithSearchInput from "pages/custom/WithSearchInput"
import {
  AddressSelectableListItem,
  Button,
  FlexColumn,
  WalletSelectableListItem,
} from "@terra-money/station-ui"
import { truncate } from "@terra-money/terra-utils"
import styles from "./ReceivePage.module.scss"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

interface SearchChainsProps {
  data: {
    chainID: string
    address: string
    onClick?: (param?: any) => void
  }[]
}

export const SearchChains = ({ data }: SearchChainsProps) => {
  const networks = useAllNetworks()
  return (
    <WithSearchInput label="Search Chains" className={styles.receive}>
      {(input) =>
        data
          .filter(
            (item) =>
              networks[item.chainID]?.name
                .toLowerCase()
                .includes(input.toLowerCase()) ||
              item.address.toLowerCase().includes(input.toLowerCase())
          )
          .map(({ address, chainID, onClick }) => {
            return onClick ? (
              <AddressSelectableListItem
                label={networks[chainID]?.name || chainID}
                subLabel={truncate(address)}
                active={true}
                chain={{
                  icon: networks[chainID]?.icon,
                  label: networks[chainID]?.name || chainID,
                }}
                onClick={onClick}
              />
            ) : (
              <WalletSelectableListItem
                icon={networks[chainID]?.icon}
                key={`${chainID}-${address}`}
                walletName={networks[chainID]?.name || chainID}
                label={networks[chainID]?.name || chainID}
                subLabel={truncate(address, [11, 6])}
                copyValue={address}
                active={true}
              />
            )
          })
      }
    </WithSearchInput>
  )
}

const ReceivePage = () => {
  const addresses = useInterchainAddresses()
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <FlexColumn gap={24} justify="space-between">
      <SearchChains
        data={Object.entries(addresses ?? {}).map(([chainID, address]) => ({
          chainID,
          address,
        }))}
      />
      <Button
        label={t("Back")}
        className={styles.back}
        onClick={() => navigate("/")}
        variant="secondary"
      />
    </FlexColumn>
  )
}

export default ReceivePage
