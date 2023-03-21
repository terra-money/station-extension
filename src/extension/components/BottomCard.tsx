import { Grid } from "components/layout"
import { PropsWithChildren } from "react"
import styles from "./BottomCard.module.scss"

const BottomCard = ({ children }: PropsWithChildren<{}>) => {
  return (
    <section className={styles.bottom__card}>
      <Grid gap={20}>{children}</Grid>
    </section>
  )
}

export default BottomCard
