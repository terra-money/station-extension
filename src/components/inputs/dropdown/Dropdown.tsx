import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { ReactComponent as DropdownArrowIcon } from 'assets/icon/DropdownArrow.svg';
import styles from "./Dropdown.module.scss";

export interface StandardDropdownProps {
  options: { id: string; label: string; image?: string }[]
  onChange: (id: string) => void
  selectedId: string
}

const StandardDropdown = ({
  options,
  onChange,
  selectedId,
}: StandardDropdownProps) => {
  const [open, setOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false)
    }
  }
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const optionsById = options.reduce((acc, option) => {
    acc[option.id] = option
    return acc
  }, {} as Record<string, { id: string; label: string; image?: string }>)

  return (
    <div className={styles.container} ref={ref}>
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
          {optionsById[selectedId].image && (
            <img
              src={optionsById[selectedId].image}
              alt={optionsById[selectedId].label}
            />
          )}
          <span>{optionsById[selectedId].label}</span>
        </span>
        <DropdownArrowIcon className={styles.caret} fill="var(--token-light-white)" />
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
                className={option.id === selectedId ? styles.active : ""}
                key={option.id}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onChange(option.id)
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
