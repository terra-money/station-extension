import classNames from "classnames/bind"
import styles from "./GasHelperCard.module.scss"
import { PropsWithChildren } from "react"

const cx = classNames.bind(styles)

type ProgressBarColor = "yellow" | "gray"

export type GasHelperCardProps = PropsWithChildren<{
  progressColor?: ProgressBarColor
  className?: string
}>

const GasHelperCard = ({
  className,
  progressColor,
  children,
}: GasHelperCardProps) => {
  return (
    <div className={cx(styles.gashelper__card__container, className)}>
      <div className={cx(styles.gashelper__card, progressColor)}>{children}</div>
    </div>
  )
}

export default GasHelperCard
