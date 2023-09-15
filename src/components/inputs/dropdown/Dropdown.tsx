import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import classNames from "classnames";
import styles from "./Dropdown.module.scss";

export interface StandardDropdownProps {
  options: { value: string; label: string; image?: string }[]
  onChange: (value: string) => void
  value: string
}

const StandardDropdown = ({
  options,
  onChange,
  value,
}: StandardDropdownProps) => {
  const [open, setOpen] = useState(false)
  if (!options.length) return null

  const optionsById = options.reduce((acc, option) => {
    acc[option.value] = option
    return acc
  }, {} as Record<string, { value: string; label: string; image?: string }>)

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.selector}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen((o) => !o)
        }}
      >
        <span className={styles.selected__wrapper}>
          {optionsById[value]?.image && (
            <img
              src={optionsById[value]?.image}
              alt={optionsById[value]?.label}
            />
          )}
          <span>{optionsById[value]?.label}</span>
        </span>
        <ArrowDropDownIcon style={{ fontSize: 20 }} className={styles.caret} />
      </button>
      {open && (
        <div className={styles.options}>
          <div
            className={classNames(
              styles.options__container
            )}
          >
            {options.map((option) => (
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
                  {option.image && (
                    <img
                      src={option.image}
                      alt={option.label}
                    />
                  )}
                  <span>{option.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StandardDropdown;
