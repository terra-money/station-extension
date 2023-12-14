import { ReactNode } from "react"
import classNames from "classnames/bind"
import { LoadingIcon, AlertIcon, SmallCircleCheckIcon } from "components"
import Pill from "components/general/pill/Pill"
import styles from "./ActivityListItem.module.scss"
import { ChainImage } from '../token/utils'

const cx = classNames.bind(styles)

export interface ActivityListItemProps {
  variant?: "success" | "failed" | "loading"
  chain: { icon: string, label: string }
  msg: ReactNode
  type: string
  secondaryPill?: ReactNode
  time?: string
  msgCount?: number
  hasTimeline?: boolean
  onClick?: () => void
  progressTracker?: ReactNode
}

const ActivityListItem = ({
  variant,
  chain,
  msg,
  type,
  time,
  msgCount,
  hasTimeline,
  secondaryPill,
  onClick,
  progressTracker,
}: ActivityListItemProps) => {
  const messageText = msgCount === 1 ? "Message" : "Messages"

  let statusIcon = <LoadingIcon fill="var(--token-warning-500)" />

  if (variant === "success") {
    statusIcon = <SmallCircleCheckIcon fill="var(--token-success-500)" />
  } else if (variant === "failed") {
    statusIcon = <AlertIcon fill="var(--token-error-500)" />
  }

  return (
    <div className={styles.activity__li__container} onClick={onClick}>
      <div className={cx(styles.activity__li, { has__timeline: hasTimeline })}>
        <div className={styles.activity__icon__container}>
          {hasTimeline ? <span className={styles.dashed__line} /> : null}
          <ChainImage
            chainImg={chain.icon}
            chainName={chain.label}
            className={styles.activity__icon}
          />
          {variant && (
            <span className={styles.status__icon}>
              {statusIcon}
            </span>
          )}
        </div>
        <div className={styles.activity__details__container}>
          <div className={styles.pill__container}>
            <Pill
              variant={variant === "failed" ? "danger" : "secondary"}
              text={type}
            />
            {secondaryPill}
          </div>
          <h3 className={styles.activity__msg}>
            {msg}
          </h3>
          {msgCount ? (
            <h6 className={styles.activity__time}>
              +{msgCount} {messageText}
            </h6>
          ) : (
            time ? (
              <h6 className={styles.activity__time}>
                {time}
              </h6>
            ) : null
          )}
          {progressTracker && (
            <div className={styles.progress__tracker}>
              {progressTracker}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActivityListItem
