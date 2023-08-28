import { PropsWithChildren } from "react"
import classNames from "classnames"
import styles from "./Container.module.scss"

interface Props {
  className?: string
}
const cx = classNames.bind(styles)

const Container = ({ className, children }: PropsWithChildren<Props>) => {
  return <div className={cx(styles.container, className)}>{children}</div>
}

export default Container
