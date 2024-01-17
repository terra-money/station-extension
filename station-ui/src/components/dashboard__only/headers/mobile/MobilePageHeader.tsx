import { ReactNode } from "react"
import styles from "./MobilePageHeader.module.scss"

export interface MobilePageHeaderProps {
  pageIcon: ReactNode
  title: string
  subtitle?: string
  secondaryNode?: ReactNode
}

const PageHeader = ({
  pageIcon,
  title,
  subtitle,
  secondaryNode,
}: MobilePageHeaderProps) => {
  return (
    <div className={styles.page__header}>
      <div className={styles.top}>
        <div className={styles.page__icon__title}>
          {pageIcon}
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.subtitle}>{subtitle}</div>
      </div>

      <div className={styles.right__side}>
        {secondaryNode}
      </div>
    </div>
  )
}

export default PageHeader
