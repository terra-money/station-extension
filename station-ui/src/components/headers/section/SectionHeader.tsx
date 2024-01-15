import styles from "./SectionHeader.module.scss"
import { ReactNode, useState } from "react"
import { DropdownArrowIcon } from "assets"
import classNames from "classnames/bind"

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
      className={cx(styles.section__header, className, { pointer: !!onClick })}
      onClick={handleClick}
    >
      <div className={cx(styles.header, { indented, has__line: withLine })}>
        <div className={cx(styles.title__wrapper, { has__line: withLine })}>
          {icon && <div className={styles.icon}>{icon}</div>}

          {withLine && <div className={styles.line} />}

          {title && title.length > 0 && (
            <h3 className={cx(styles.title, { indented })}>
              {title}
              {withArrow && (
                <DropdownArrowIcon
                  className={cx(styles.arrow__icon)}
                  style={{
                    transform: `rotate(${rotateArrow ? 180 : 0}deg)`,
                    transition: "transform 0.5s ease",
                  }}
                />
              )}
            </h3>
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
