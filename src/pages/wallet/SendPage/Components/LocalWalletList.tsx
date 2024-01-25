import { ReactNode } from "react"
import classNames from "classnames/bind"
import { Grid, SectionHeader, WalletButton } from "@terra-money/station-ui"
import { useTranslation } from "react-i18next"
import styles from "./LocalWalletList.module.scss"

const cx = classNames.bind(styles)

export const LocalWalletList = ({
  items,
  title,
  icon,
  onClick,
}: {
  items: (LocalWallet | ResultStoredWallet)[]
  title?: string
  icon?: ReactNode
  onClick?: (address: string, index: number) => void
}) => {
  const { t } = useTranslation()
  if (!items.length) return null
  return (
    <Grid gap={8}>
      {title && (
        <SectionHeader
          icon={icon}
          indented
          title={t(title)}
          className={cx({ [styles.is__active]: title === "Active" })}
        />
      )}
      {items.map((i, index) => (
        <WalletButton
          key={i.name + index}
          emoji={i.icon}
          walletName={i.name}
          walletAddress={t("Multiple Addresses")}
          onClick={() => onClick?.(i.name, index)}
        />
      ))}
    </Grid>
  )
}
