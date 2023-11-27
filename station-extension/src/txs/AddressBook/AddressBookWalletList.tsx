import { Grid, WalletSelectableListItem, SectionHeader } from "station-ui"
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
    <Grid gap={12}>
      {title && <SectionHeader withLine title={title} />}
      {items.map((item) => (
        <WalletSelectableListItem
          copyValue={item.recipient}
          walletName={item.name}
          emoji={item.icon}
          key={item.name}
          settingsOnClick={onClick ? () => onClick?.(item) : undefined}
          label={item.name}
          subLabel={truncate(item.recipient)}
        />
      ))}
    </Grid>
  )
}

export default AddressWalletList
