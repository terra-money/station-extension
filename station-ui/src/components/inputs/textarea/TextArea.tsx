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
    const { className, value, ...otherProps } = attrs;
    const [displayValue, setDisplayValue] = useState<string>("");

    useEffect(() => {
      if (typeof value === 'string') {
        try {
          // Try to parse the string as JSON
          const parsed = JSON.parse(value);
          // If parsing is successful, format the string
          setDisplayValue(JSON.stringify(parsed, null, 6));
        } catch (e) {
          // If parsing fails, just use the original string
          console.log("TextArea displayValue error: ", e)
          setDisplayValue(value);
        }
      } else if (value && typeof value === 'object') {
        // Handle the case where value is already an object
        setDisplayValue(JSON.stringify(value, null, 2));
      }
    }, [value]);

    return (
      <textarea
        rows={4}
        className={cx(styles.textarea, className)}
        ref={ref}
        value={displayValue}
        {...otherProps}
      />
    )
  },
)

export default TextArea
