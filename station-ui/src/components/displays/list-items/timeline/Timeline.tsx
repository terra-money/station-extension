import { ReactNode } from "react"
import classNames from "classnames/bind"
import { ReactComponent as CircleCheck } from "assets/icon/SmallCircleCheck.svg"
import { ReactComponent as Alert } from "assets/icon/Alert.svg"
import Pill from "components/general/pill/Pill"
import styles from "./Timeline.module.scss"

const cx = classNames.bind(styles)

export interface TimelineProps {
  startItem?: {
    chain: { icon: string, label: string }
    coin: { icon: string, label: string }
    msg: ReactNode
  }
  middleItems?: {
    variant: "default" | "success" | "warning"
    msg: ReactNode
    warningPillText?: string
  }[]
  endItem?: {
    chain: { icon: string, label: string }
    coin: { icon: string, label: string }
    msg: ReactNode
  }
}

const Timeline = ({
  startItem,
  middleItems,
  endItem,
}: TimelineProps) => {
  return (
    <div className={styles.timeline__container}>
      {startItem && (
        <div className={styles.start__item}>
          <div className={styles.img__wrapper}>
            <img
              src={startItem.coin.icon}
              alt={startItem.coin.label}
              className={styles.item__coin}
            />
            <span className={styles.dashed__line} />
          </div>
          <div className={styles.details__wrapper}>
            <h3>{startItem.msg}</h3>
            <div className={styles.item__chain}>
              <img
                src={startItem.chain.icon}
                alt={startItem.chain.label}
              />
              <h6 className={styles.details__msg}>
                {startItem.chain.label}
              </h6>
            </div>
          </div>
        </div>
      )}

      {middleItems && (
        <div className={styles.middle__items__container}>
          {middleItems.map((item, i) => (
            <div className={styles.middle__item} key={i}>
              <div className={styles.img__wrapper}>
                {item.variant === "success" ? (
                  <CircleCheck fill="var(--token-success-500)" />
                ) : (
                  item.variant === "warning" ? (
                    <Alert fill="var(--token-warning-500)" />
                  ) : (
                    <span className={styles.grey__circle} />
                  )
                )}
                {middleItems.length - 1 !== 0 && (
                  <span className={styles.dashed__line} />
                )}
              </div>
              <div className={cx(styles.details__wrapper, { hasPill: item.warningPillText } )}>
                {item.warningPillText && (
                  <Pill
                    variant={"warning"}
                    text={item.warningPillText}
                  />
                )}
                <h4>{item.msg}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {endItem && (
        <div className={styles.end__item}>
          <div className={styles.img__wrapper}>
            <img
              src={endItem.coin.icon}
              alt={endItem.coin.label}
              className={styles.item__coin}
            />
          </div>
          <div className={styles.details__wrapper}>
            <h3>{endItem.msg}</h3>
            <div className={styles.item__chain}>
              <img
                src={endItem.chain.icon}
                alt={endItem.chain.label}
              />
              <h6 className={styles.details__msg}>
                {endItem.chain.label}
              </h6>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Timeline
