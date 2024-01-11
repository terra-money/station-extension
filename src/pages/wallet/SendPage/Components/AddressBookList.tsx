import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import classNames from "classnames/bind"
import { getChainIdFromAddress } from "data/queries/chains"
import { useNetwork } from "data/wallet"
import { truncate } from "@terra-money/terra-utils"
import { Grid, SectionHeader, WalletButton } from "@terra-money/station-ui"
import styles from "./LocalWalletList.module.scss"

const cx = classNames.bind(styles)

export const AddressBookList = ({
  items,
  title,
  icon,
  onClick,
}: {
  items: AddressBook[]
  title?: string
  icon?: ReactNode
  onClick?: (address: string, index: number) => void
}) => {
  const network = useNetwork()
  const { t } = useTranslation()
  if (!items.length) return null
  return (
    <Grid gap={8}>
      {title && (
        <SectionHeader
          icon={icon}
          indented
          title={t(title)}
          className={cx({ [styles.is__active]: title === "Favorites" })}
        />
      )}
      {items.map((i, index) => (
        <WalletButton
          variant="secondary"
          key={i.name + index}
          emoji={i.icon}
          walletName={i.name}
          walletAddress={truncate(i.recipient, [11, 6])}
          chainIcon={network[getChainIdFromAddress(i.recipient, network)]?.icon}
          onClick={() => onClick?.(i.recipient, index)}
        />
      ))}
    </Grid>
  )
}
