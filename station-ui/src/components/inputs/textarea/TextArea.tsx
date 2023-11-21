import { ForwardedRef, TextareaHTMLAttributes, forwardRef, useEffect, useState } from "react"
import classNames from "classnames/bind"
import styles from "./TextArea.module.scss"

const cx = classNames.bind(styles)

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "value"> {
  value?: string | object
}

const TextArea = forwardRef(
  (
    attrs: TextAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    const { className, value, onChange, ...otherProps } = attrs
    const [displayValue, setDisplayValue] = useState<string>("")

    const handleFormat = (value: string) => {
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value)
          return JSON.stringify(parsed, null, 6)
        } catch (e) {
          return value
        }
      } else if (value && typeof value === "object") {
        return JSON.stringify(value, null, 6)
      }
    }

    useEffect(() => {
      const formatted = handleFormat(value as string || "")
      setDisplayValue(formatted || '')
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const formatted = handleFormat(e.target.value)
      setDisplayValue(formatted || '')
      if (onChange) {
        onChange(e)
      }
    }

    return (
      <textarea
        rows={4}
        className={cx(styles.textarea, className)}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        {...otherProps}
      />
    )
  },
)

export default TextArea
