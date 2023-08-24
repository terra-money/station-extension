import { useState } from "react"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import classNames from "classnames"
import styles from "./Dropdown.module.scss"

// interface StandardDropdownProps {
//   onChange: (chain: string) => void
//   setNetworkIndex: (index: number) => void
//   value: string
//   small?: boolean
//   networkOptions: { value: string; label: string }[]
//   networkIndex: number
// }

export interface StandardDropdownProps {
  options: { id: string; label: string; image: string }[]
  onChange: (id: string) => void
  selectedId: string
}

const StandardDropdown = ({
  // networkOptions,
  // onChange,
  // value,
  // small,
  // networkIndex,
  // setNetworkIndex,
  options,
  onChange,
  selectedId,
}: StandardDropdownProps) => {
  const [open, setOpen] = useState(false)

  const optionsById = options.reduce((acc, option) => {
    acc[option.id] = option
    return acc
  }, {} as Record<string, { id: string; label: string; image: string }>)
  console.log("🚀 ~ file: Dropdown.tsx:25 ~ optionsById ~ optionsById:", optionsById)

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
        <span>{optionsById[selectedId].label}</span>{" "}
        <ArrowDropDownIcon style={{ fontSize: 20 }} className={styles.caret} />
      </button>
      {open && (
        <div className={styles.options}>
          <div
            className={classNames(
              styles.options__container
            )}
          >
            {/* {networkOptions.map((option, index) => (
              <button
                className={option.value === value ? styles.active : ""}
                key={option.value}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onChange(option.value)
                  setNetworkIndex(index)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            ))} */}

            {options.map((option) => (
              <button
                className={option.id === selectedId ? styles.active : ""}
                key={option.id}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onChange(option.id)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StandardDropdown;
