import React from "react"
import { WalletListItem as StationWalletListItem } from "@terra-money/station-ui"
import { AccAddress } from "@terra-money/feather.js"
import { WalletName } from "types/network"

interface WalletListItemProps {
  emoji: string
  name: string
  address: AccAddress | WalletName | string
  smallText?: boolean
  onClick: () => void
}

const WalletListItem: React.FC<WalletListItemProps> = ({
  emoji,
  name,
  address,
  smallText = false,
  onClick,
}) => {
  return (
    <StationWalletListItem
      emoji={emoji}
      name={name}
      address={address}
      smallText={smallText}
      onClick={onClick}
    />
  )
}

export default WalletListItem
