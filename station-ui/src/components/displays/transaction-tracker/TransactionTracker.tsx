import classNames from "classnames/bind"
import { ReactComponent as CircleCheckIcon } from "assets/icon/SmallCircleCheck.svg"
import { ReactComponent as CloseIcon } from "assets/icon/Close.svg"
import styles from "./TransactionTracker.module.scss"

const cx = classNames.bind(styles)

export type StepStatus = "incomplete" | "completed" | "inProgress" | "failed"

export interface TransactionTrackerProps {
  steps: StepStatus[];
  stepLabels?: string[];
}

const TransactionTracker = ({ steps, stepLabels }: TransactionTrackerProps) => {
  const areAllStepsCompleted = steps.every((step) => step === "completed")

  const getStatusColor = (status: StepStatus): string => {
    switch (status) {
      case "completed":
        return "var(--token-success-500)"
      case "inProgress":
        return "var(--token-warning-500)"
      case "failed":
        return "var(--token-error-500)"
      default:
        return "var(--token-dark-900)"
    }
  }

  const getStatusLineColor = () => {
    if (areAllStepsCompleted) return "var(--token-success-500)"
    if (steps.includes("failed")) return "var(--token-error-500)"

    return "var(--token-warning-500)"
  }

  return (
    <div className={styles.progress__container}>
      <div className={styles.progress__tracker}>
        {steps.map((status, index) => (
          <div key={index} className={styles.step__container}>
            {status === "failed" ? (
              <CloseIcon stroke={getStatusColor(status)} width={12} height={12} />
            ) : (
              status === "completed" ? (
                <CircleCheckIcon fill={getStatusLineColor()} width={16} height={16} />
              ) : (
                <div className={styles.circle} style={{ borderColor: getStatusColor(status) }} />
              )
            )}
            {index < steps.length - 1 && (
              <div className={cx(
                styles.dashed__line,
                status === "completed" && steps[index + 1] === "failed",
                { [styles.has__failed]: steps[index + 1] === "failed" }
              )}>
                {status === "completed" && (
                  steps[index + 1] === "failed" ? (
                    <div
                      className={styles.failed__line}
                      style={{ backgroundColor: getStatusColor(steps[index + 1]) }}
                    />
                  ) : (
                    steps[index + 1] === "incomplete" ? (
                      <div
                        className={styles.filled__line__half}
                        style={{ backgroundColor: getStatusLineColor() }}
                      />
                    ) : (
                      (steps[index + 1] === "inProgress" || steps[index + 1] === "completed") && (
                        <div
                          className={styles.filled__line}
                          style={{ backgroundColor: getStatusLineColor() }}
                        />
                      )
                    )
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {stepLabels && (
        <div className={styles.text}>
          {stepLabels?.map((label: string, index: React.Key | null | undefined) => (
            <div key={index} className={styles.label}>
              <span className={cx({ [styles.first]: index === 0, [styles.last]: index === stepLabels.length - 1 })}>{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TransactionTracker
