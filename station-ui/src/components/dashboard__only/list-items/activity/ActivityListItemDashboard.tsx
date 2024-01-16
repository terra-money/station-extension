import { ReactNode } from "react"
import classNames from "classnames/bind"
import styles from "./ActivityListItemDashboard.module.scss"
import { AlertIcon, LoadingIcon, RightArrowIcon, SmallCircleCheckIcon } from "assets"
import { ChainImage } from "components/displays/list-items/token/utils"
import { Pill } from "components"

const cx = classNames.bind(styles)

export interface ActivityListItemDashboardProps {
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

const ActivityListItemDashboard = ({
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
}: ActivityListItemDashboardProps) => {
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
          <div className={styles.activity__line}>
            <div className={styles.activity__msg}>
              {msg}
            </div>
            <div className={styles.pill__container}>
              <Pill
                variant={variant === "failed" ? "danger" : "secondary"}
                text={type}
              />
              {secondaryPill}
            </div>
          </div>
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
        </div>
      </div>

      {progressTracker && (
        <div className={styles.progress__tracker}>
          {progressTracker}
        </div>
      )}
      <RightArrowIcon fill={"var(--token-dark-900)"} width={9} height={14} />
    </div>
  )
}

export default ActivityListItemDashboard
