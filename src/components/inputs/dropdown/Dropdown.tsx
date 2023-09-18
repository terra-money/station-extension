import { useEffect, useRef, useState } from "react";
import { ReactComponent as DropdownArrowIcon } from 'assets/icon/DropdownArrow.svg';
import styles from "./Dropdown.module.scss";

export interface DropdownProps {
  options: { value: string; label: string; image?: string }[]
  onChange: (value: string) => void
  value: string
}

const Dropdown = ({
  options,
  onChange,
  value,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!options?.length) return null;

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  const optionsById = options.reduce((acc, option) => {
    acc[option.value] = option;
    return acc;
  }, {} as Record<string, { value: string; label: string; image?: string }>);

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
          {optionsById[value]?.image && (
            <img
              src={optionsById[value]?.image}
              alt={optionsById[value]?.label}
            />
          )}
          <span>{optionsById[value]?.label}</span>
        </span>
        <DropdownArrowIcon className={styles.caret} fill="var(--token-light-white)" />
      </button>
      {open && (
        <div className={styles.options}>
          <div className={styles.options__container}>
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

export default Dropdown;
