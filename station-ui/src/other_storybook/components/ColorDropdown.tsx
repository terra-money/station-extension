import { useEffect, useRef, useState } from "react"
import classNames from "classnames/bind"
import { ReactComponent as DropdownArrowIcon } from "assets/icon/DropdownArrow.svg"
import styles from "./ColorDropdown.module.scss"

const cx = classNames.bind(styles)

export interface ColorDropdownProps {
  onChange: (value: string) => void
  value: string
}

const ColorDropdown = ({
  onChange,
  value,
}: ColorDropdownProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const colorOptions = [
    { value: "--token-light-white", label: "--token-light-white" },
    { value: "--token-light-100", label: "--token-light-100" },
    { value: "--token-dark-900", label: "--token-dark-900" },
    { value: "--token-primary-500", label: "--token-primary-500" },
    { value: "--token-success-500", label: "--token-success-500" },
    { value: "--token-warning-500", label: "--token-warning-500" },
    { value: "--token-error-500", label: "--token-error-500" }
  ]

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false)
    }
  }

  return (
    <div className={styles.container} ref={ref}>
      <button
        type="button"
        className={cx(styles.selector, { open })}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((o) => !o)
        }}
      >
        <span className={styles.selected__wrapper}>
          <div style={{ backgroundColor: `var(${value})`, width: "18px", height: "18px", borderRadius: "50px" }} />
          <span>{value}</span>
        </span>
        <DropdownArrowIcon className={styles.caret} fill="var(--token-light-white)" />
      </button>
      {open && (
        <div className={cx(styles.options)}>
          <div className={cx(styles.options__container)}>
              {colorOptions.map((option) => (
                <button
                  className={option.value === value ? styles.active : ""}
                  key={option.value}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  <span className={styles.selected__wrapper}>
                    <div style={{ backgroundColor: `var(${option.value})`, width: "14px", height: "14px", borderRadius: "8px" }} />
                    <span>{option.label}</span>
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorDropdown
