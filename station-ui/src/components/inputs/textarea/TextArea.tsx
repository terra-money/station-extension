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
    const { className } = attrs

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
        rows={4}
        className={cx(styles.textarea, className)}
        ref={ref}
        value={displayValue}
        {...attrs}
      />
    )
  },
)

export default TextArea
