import {
  Grid,
  WalletSelectableListItem,
  SectionHeader,
} from "@terra-money/station-ui"
import { truncate } from "@terra-money/terra-utils"

const AddressWalletList = ({
  items,
  title,
  onClick,
}: {
  items: AddressBook[]
  title?: string
  onClick?: (item: AddressBook) => void
}) => {
  if (!items.length) return null
  return (
    <Grid gap={16} data-testid="address-wallet-list">
      {title && (
        <SectionHeader
          withLine
          title={title}
          data-testid="address-wallet-header"
        />
      )}
      <Grid gap={8}>
        {items.map((item, index) => (
          <WalletSelectableListItem
            copyValue={item.recipient}
            walletName={item.name}
            active
            emoji={item.icon}
            key={item.name}
            settingsOnClick={onClick ? () => onClick?.(item) : undefined}
            label={item.name}
            subLabel={truncate(item.recipient, [11, 6])}
            data-testid={`wallet-item-${index}`}
          />
        ))}
      </Grid>
    </Grid>
  )
}

export default AddressWalletList
