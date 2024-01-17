import { getChainIdFromAddress } from "data/queries/chains"
import { ReactNode } from "react"
import { Grid, SectionHeader, WalletButton } from "@terra-money/station-ui"
import { useNetwork } from "data/wallet"
import { truncate } from "@terra-money/terra-utils"
import { useTranslation } from "react-i18next"
export const AddressBookList = ({
  items,
  title,
  icon,
  onClick,
}: {
  items: AddressBook[]
  title?: string
  icon?: ReactNode
  onClick?: (address: string, index: number, memo?: string) => void
}) => {
  const network = useNetwork()
  const { t } = useTranslation()
  if (!items.length) return null
  return (
    <Grid gap={8}>
      {title && <SectionHeader icon={icon} indented title={t(title)} />}
      {items.map((i, index) => (
        <WalletButton
          variant="secondary"
          key={i.name + index}
          emoji={i.icon}
          walletName={i.name}
          walletAddress={truncate(i.recipient, [11, 6])}
          chainIcon={network[getChainIdFromAddress(i.recipient, network)]?.icon}
          onClick={() => onClick?.(i.recipient, index, i.memo)}
        />
      ))}
    </Grid>
  )
}
