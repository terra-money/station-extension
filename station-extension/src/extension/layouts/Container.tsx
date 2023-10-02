import { PropsWithChildren } from "react"
import classNames from "classnames"
import styles from "./Container.module.scss"

const cx = classNames.bind(styles)

interface Props {
  className?: string
}

const Container = ({ children, className }: PropsWithChildren<Props>) => {
  return <div className={cx(styles.container, className)}>{children}</div>
}

export default Container
