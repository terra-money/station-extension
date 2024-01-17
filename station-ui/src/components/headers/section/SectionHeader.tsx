import { ReactNode, useState } from "react"
import classNames from "classnames/bind"
import { DropdownArrowIcon } from "assets"
import styles from "./SectionHeader.module.scss"

const cx = classNames.bind(styles)

export interface SectionHeaderProps {
  title?: string
  extra?: ReactNode
  withLine?: boolean
  withArrow?: boolean
  indented?: boolean
  icon?: ReactNode
  className?: string
  onClick?: () => void
}

const SectionHeader = ({
  title,
  extra,
  withLine,
  withArrow,
  indented,
  icon,
  className,
  onClick,
}: SectionHeaderProps) => {
  const [rotateArrow, setRotateArrow] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick()
    }
    setRotateArrow(!rotateArrow)
  }

  return (
    <div
      className={cx(styles.section__header, className, { [styles.pointer]: !!onClick })}
      onClick={handleClick}
    >
      <div className={cx(styles.header, { indented, has__line: withLine })}>
        <div className={cx(styles.full__wrapper, { has__line: withLine })}>
          {icon && <div className={styles.icon}>{icon}</div>}

          {withLine && <div className={styles.line} />}

          {title && title.length > 0 && (
            <div className={styles.title__wrapper}>
              <h3 className={cx(styles.title, { indented })}>
                {title}
              </h3>
              {withArrow && (
                <DropdownArrowIcon
                  className={cx(styles.arrow__icon, { [styles.arrow__rotated]: rotateArrow })}
                  fill={"var(--token-dark-900)"}
                  width={10}
                  height={6}
                />
              )}
            </div>
          )}

          {withLine && title && title.length > 0 && (
            <div className={styles.line} />
          )}
        </div>
        {extra}
      </div>
    </div>
  )
}

export default SectionHeader
