import { Link, LinkProps } from "react-router-dom"
import classNames from "classnames"
import { ReactNode } from "react"
import styles from "./LinkButton.module.scss"

const cx = classNames.bind({})
interface ButtonConfig {
  icon?: ReactNode
  size?: "small"
  color?: "default" | "primary" | "danger"
  outline?: boolean
  block?: boolean
  loading?: boolean
  disabled?: boolean
}

type Props = ButtonConfig & LinkProps

const LinkButton = (props: Props) => {
  const { icon, size, color, outline, block, children, ...attrs } = props
  const className = cx(getClassName(props), props.className)

  return attrs.disabled ? (
    <span {...attrs} className={className}>
      {icon}
      {children}
    </span>
  ) : (
    <Link {...attrs} className={className}>
      {icon}
      {children}
    </Link>
  )
}

export default LinkButton

export const getClassName = (props: ButtonConfig) => {
  const { size, outline, block, disabled, loading } = props
  const color = props.color ?? (!outline && "default")
  return cx(styles.button, size, color, { outline, block, disabled, loading })
}
