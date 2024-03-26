import React from "react"
import { Grid, SectionHeader } from "@terra-money/station-ui"
import { useTranslation } from "react-i18next"
import WalletListItem from "./WalletListItem"
import { AccAddress } from "@terra-money/feather.js"
import { WalletName } from "types/network"

interface WalletListProps {
  title: string
  items: {
    emoji: string
    name: string
    address: AccAddress | WalletName | string
  }[]
  onItemClick: (address: AccAddress | WalletName) => void
  filter: string
}

const WalletList: React.FC<WalletListProps> = ({
  title,
  items,
  onItemClick,
  filter,
}) => {
  const { t } = useTranslation()

  const filteredItems = items.filter((item) => item.name.includes(filter ?? ""))

  if (filteredItems.length === 0) return null

  return (
    <Grid gap={16}>
      <SectionHeader extraSmallText title={t(title)} />
      {filteredItems.map((item) => (
        <WalletListItem
          key={item.name}
          emoji={item.emoji}
          name={item.name}
          address={item.address}
          smallText
          onClick={() => onItemClick(item.address)}
        />
      ))}
    </Grid>
  )
}

export default WalletList
