import { HTMLAttributes } from "react"
import classNames from "classnames/bind"
import styles from "./Form.module.scss"

const cx = classNames.bind(styles)

export interface FormProps extends HTMLAttributes<HTMLFormElement> {
  fullHeight?: boolean
  spaceBetween?: boolean
}

const Form = ({
  fullHeight,
  spaceBetween,
  ...attrs
}: FormProps) => {
  return (
    <form
      {...attrs}
      className={
        cx(
          styles.form,
          attrs.className,
          {
            [styles.full__height]: fullHeight,
            [styles.space__between]: spaceBetween
          }
        )
      }
    />
  )
}

export default Form
