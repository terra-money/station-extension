import { ForwardedRef, TextareaHTMLAttributes, forwardRef } from "react"
import classNames from "classnames/bind"
import styles from "./TextArea.module.scss"

const cx = classNames.bind(styles)

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = forwardRef(
  (
    attrs: TextAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    try {
      const parsedValue = JSON.parse(attrs.value as string)
      if (typeof parsedValue === "object" && parsedValue !== null) {
        attrs.value = JSON.stringify(parsedValue, null, 6)
      }
    } catch (e) {
      // Do nothing
    }

    return (
      <textarea
        {...attrs}
        className={cx(styles.textarea, attrs.className)}
        rows={4}
        ref={ref}
      />
    )
  },
)

export default TextArea
