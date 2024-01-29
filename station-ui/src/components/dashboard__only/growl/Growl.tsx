import { useEffect, useState } from "react"
import classNames from "classnames/bind"
import { AlertIcon, LoadingV2Icon, SmallCircleCheckIcon, CloseIcon } from "assets"
import styles from "./Growl.module.scss"

const cx = classNames.bind(styles)

export interface GrowlProps {
  title: string
  message: string
  variant: "loading" | "success" | "warning" | "error"
  date: Date
  txHash: string
  onClose: () => void
  className?: string
}

const Growl = ({ title, message, variant = "loading", date, txHash, onClose, className }: GrowlProps) => {
  const [expanded, setExpanded] = useState(false)
  const [showClose, setShowClose] = useState(false)

  let statusIcon = <LoadingV2Icon height={40} width={40} />
  if (variant === "success") {
    statusIcon = <SmallCircleCheckIcon fill="var(--token-success-500)" height={40} width={40} />
  } else if (variant === "warning") {
    statusIcon = <AlertIcon fill="var(--token-warning-500)" height={40} width={40} />
  } else if (variant === "error") {
    statusIcon = <AlertIcon fill="var(--token-error-500)" height={40} width={40} />
  }

  const [timeString, setTimeString] = useState("00:00")

  useEffect(() => {
    const buildTimeString = () => {
      const currentTime = new Date()
      const totalSecondsElapsed = Math.floor((currentTime.getTime() - date.getTime()) / 1000)

      const minutes = Math.floor(totalSecondsElapsed / 60)
      const seconds = totalSecondsElapsed % 60

      // Format time as MM:SS
      const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      setTimeString(formattedTime)
    }

    if (variant === "success" || variant === "warning" || variant === "error") {
      buildTimeString()
    } else {
      const interval = setInterval(() => {
        buildTimeString()
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [date, variant])

  const iconMouseEnter = () => {
    setShowClose(true)
  }

  const iconMouseLeave = () => {
    setShowClose(false)
  }

  const handleClose = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    if (expanded) {
      setExpanded(false)
      setTimeout(() => {
        onClose()
      }, 300)
    } else {
      onClose()
    }
  }

  return (
    <div className={cx(styles.growl, styles[variant], className, { expanded })}>
      <div className={cx(styles.details, { expanded })}>
        <CloseIcon
          height={12}
          width={12}
          stroke="var(--token-dark-900)"
          className={styles.close__icon}
          onClick={handleClose}
        />
        <div className={styles.icon}>{statusIcon}</div>
        <div className={styles.text__container}>
          <div className={styles.title}>{title}</div>
          <div className={styles.message}>{message}</div>
        </div>
      </div>

      <div className={cx(styles.collapsed, { expanded })} onClick={() => setExpanded(!expanded)}>
        <div className={styles.text__wrapper}>
          <div className={styles.time}>{timeString}</div>
          <div className={styles.hash}>{txHash}</div>
        </div>
        <div
          className={styles.small__icon}
          onMouseEnter={iconMouseEnter}
          onMouseLeave={iconMouseLeave}
        >
          <CloseIcon
            height={12}
            width={12}
            stroke="var(--token-dark-900)"
            className={cx(styles.close__icon, { [styles.display__close]: showClose })}
            onClick={handleClose}
          />
          <div className={cx(styles.status__icon, { [styles.no__close]: !showClose })}>
            {statusIcon}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Growl
