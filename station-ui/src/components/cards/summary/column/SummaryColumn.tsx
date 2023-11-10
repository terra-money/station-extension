import { ReactNode } from "react"
import classNames from "classnames/bind"
import styles from "./SummaryColumn.module.scss"

const cx = classNames.bind(styles)

export interface SummaryColumnProps {
  className?: string
  title: string
  extra?: ReactNode
  description: string
  noWordBreak?: boolean
}

const SummaryColumn = ({
  className,
  title,
  extra,
  description,
  noWordBreak,
}: SummaryColumnProps) => {
  return (
    <div className={cx(styles.summary__column__container, className)}>
      <div className={styles.title__row}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.extra}>{extra}</div>
      </div>
      <div className={cx(styles.description, { noWordBreak })}>
        {description}
      </div>
    </div>
  )
}

export default SummaryColumn
