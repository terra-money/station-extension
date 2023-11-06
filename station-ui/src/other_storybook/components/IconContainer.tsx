import { ReactNode } from "react"
import { Copy } from "components"
import styles from "./IconContainer.module.scss"

interface IconContainerProps {
  iconName: string
  icon: ReactNode
  iconCopy: string
}

const IconContainer = ({ iconName, icon, iconCopy }: IconContainerProps) => {
  return (
    <div className={styles.icon__container}>
      <div className={styles.top}>
        <div className={styles.text}>{iconName}</div>
        <Copy
          iconOnly
          iconOnlySize={16}
          fillColor="var(--token-light-100)"
          copyText={iconCopy}
        />
      </div>
      <div className={styles.actual__icon__wrapper}>
        <div className={styles.icon}>{icon}</div>
      </div>
    </div>
  )
}

export default IconContainer
