import Growl, { GrowlProps } from "./Growl"
import styles from "./GrowlContainer.module.scss"

export interface GrowlContainerProps {
  growls: GrowlProps[]
}

const GrowlContainer = ({ growls }: GrowlContainerProps) => {
  return (
    <div className={styles.growl__container}>
      {growls.map((growl, index) => (
        <Growl key={index} {...growl} />
      ))}
    </div>
  )
}

export default GrowlContainer
