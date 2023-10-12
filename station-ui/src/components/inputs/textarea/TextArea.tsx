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
    const { readOnly, className } = attrs

    let displayValue = attrs.value

    try {
      if (attrs.value !== undefined) {
        const parsedValue = JSON.parse(attrs.value as string)
        if (typeof parsedValue === "object" && parsedValue !== null) {
          displayValue = JSON.stringify(parsedValue, null, 6)
        }
      }
    } catch (e) {
      // ignore
      console.log("TextArea displayValue error: ", e)
    }

    return (
      <textarea
        {...attrs}
        className={cx(styles.textarea, className)}
        rows={4}
        readOnly={readOnly}
        ref={ref}
        value={displayValue}
      />
    )
  },
)

export default TextArea
