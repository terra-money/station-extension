import { ReactNode } from "react"
import classNames from "classnames/bind"
import styles from "./SummaryColumn.module.scss"

const cx = classNames.bind(styles)

export interface SummaryColumnProps {
  className?: string
  title: string
  extra?: ReactNode
  description: string
}

const SummaryColumn = ({
  className,
  title,
  extra,
  description,
}: SummaryColumnProps) => {
  return (
    <div className={cx(styles.summary__column__container, className)}>
      <div className={styles.title__row}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.extra}>{extra}</div>
      </div>
      <div className={styles.description}>
        {description}
      </div>
    </div>
  )
}

export default SummaryColumn
