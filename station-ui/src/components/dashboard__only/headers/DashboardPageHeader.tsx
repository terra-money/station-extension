import { ReactNode } from "react"
import styles from "./DashboardPageHeader.module.scss"

export interface DashboardPageHeaderProps {
  pageIcon: ReactNode
  title: string
  subtitle?: string
  secondaryNode?: ReactNode
}

const DashboardPageHeader = ({
  pageIcon,
  title,
  subtitle,
  secondaryNode,
}: DashboardPageHeaderProps) => {
  return (
    <div className={styles.page__header}>
      <div className={styles.left__side}>
        <div className={styles.page__icon}>
          {pageIcon}
        </div>
        <div className={styles.text__container}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
      </div>

      <div className={styles.right__side}>
        {secondaryNode}
      </div>
    </div>
  )
}

export default DashboardPageHeader
