import { ReactNode } from "react"
import classNames from "classnames/bind"
import styles from "./SummaryTable.module.scss"

const cx = classNames.bind(styles)

export interface SummaryTableProps {
  rows: {
    label: string
    value: string | ReactNode
  }[]
  className?: string
}

const SummaryTable = ({ className, rows }: SummaryTableProps) => {
  return (
    <div className={cx(styles.summary__table, className)}>
      {rows.map((row, i) => (
        <div key={i} className={styles.row}>
          <div className={styles.label}>{row.label}</div>
          <div className={styles.value}>{row.value}</div>
        </div>
      ))}
    </div>
  )
}

export default SummaryTable
