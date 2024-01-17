import { ReactNode, useEffect, useRef, useState } from "react"
import classNames from "classnames/bind"
import { SmallCircleCheckIcon, SearchIcon, DropdownArrowIcon } from "assets"
import styles from "./Dropdown.module.scss"

const cx = classNames.bind(styles)

interface Option {
  value: string
  label: string
  image?: string
}
export interface DropdownProps {
  options: Option[]
  onChange: (value: string) => void
  values: string[]
  children?: ReactNode
  withSearch?: boolean
  setSearchValue?: (value: string) => void
}

const MultiSelectDropdown = ({
  options,
  onChange,
  values,
  children,
  withSearch,
  setSearchValue,
}: DropdownProps) => {
  const [open, setOpen] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const ref = useRef<HTMLDivElement>(null)

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

  const optionsById = options?.reduce((acc, option) => {
    acc[option.value] = option
    return acc
  }, {} as Record<string, Option>)

  const searchTokens = (searchTerm: string) => {
    setSearchValue && setSearchValue(searchTerm)
    const filteredOptions = options.filter(token => {
      return token.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.label.toLowerCase().includes(searchTerm.toLowerCase())
    })

    setFilteredOptions(filteredOptions)
  }

  let displayValue = values?.length > 1 ? `${values.length} Selected` : values[0]
  if (values?.length === 0) displayValue = "Select an option"

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
          {values?.length === 1 ? (
            <>
              {optionsById[values[0]]?.image && (
                <img
                  src={optionsById[values[0]]?.image}
                  alt={optionsById[values[0]]?.label}
                />
              )}
              <span>{optionsById[values[0]]?.label}</span>
            </>
          ) : (
            <span className={styles.placeholder}>{displayValue}</span>
          )}
        </span>
        <DropdownArrowIcon className={styles.caret} fill="var(--token-light-white)" />
      </button>
      {open && (
        <div className={cx(styles.options, { withSearch } )}>
          {withSearch && (
            <div className={styles.search__container}>
              <input
                type="text"
                placeholder="Search"
                autoFocus
                className={styles.search}
                onChange={(e) => searchTokens(e.target.value)}
              />
              <SearchIcon fill="var(--token-dark-900)" />
            </div>
          )}
          <div className={cx(styles.options__container, { notChildren: !children })}>
            {filteredOptions.map((option) => (
              <button
                className={values.includes(option.value) ? styles.active : ""}
                key={option.value}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onChange(option.value)
                  setFilteredOptions(options)
                  setSearchValue && setSearchValue("")
                }}
              >
                <span className={styles.selected__wrapper}>
                  <div className={styles.checkbox__image__wrapper}>
                    <div className={cx(styles.checkbox__container)}>
                      <input type="checkbox" hidden />
                      {values.includes(option.value) ? (
                        <SmallCircleCheckIcon fill="var(--token-light-white)" />
                      ) : (
                        <span className={styles.track} />
                      )}
                    </div>
                    {option.image && (
                      <img
                        src={option.image}
                        alt={option.label}
                      />
                    )}
                  </div>
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

export default MultiSelectDropdown
