/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useState } from "react"
import classNames from "classnames/bind"
import { BuyIcon, AlertIcon, SmallCircleCheckIcon, Pill } from "components"
import { ChainImage, TokenImage } from "../token/utils"
import styles from "./Timeline.module.scss"

const cx = classNames.bind(styles)

export interface TimelineProps {
  startOverride?: ReactNode
  startItem?: {
    chain: { icon: string; label: string }
    coin: { icon: string; label: string }
    msg: ReactNode
  }
  middleItems?:
    | {
        variant: "default" | "success" | "warning"
        msg: ReactNode
        warningPillText?: string
        transactionButton?: ReactNode
        disabled?: boolean
      }[]
    | undefined
  endItem?: {
    chain: { icon: string; label: string }
    coin: { icon: string; label: string }
    msg: ReactNode
  }
  forceShowAll?: boolean
  hasNextElement?: boolean
}

const Timeline = ({
  startOverride,
  startItem,
  middleItems,
  endItem,
  forceShowAll,
  hasNextElement,
}: TimelineProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [middleData, setMiddleData] = useState<any[]>([])

  useEffect(() => {
    interface MiddleDataItem {
      variant: "default" | "success" | "warning"
      msg: ReactNode
      warningPillText?: string
      transactionButton?: ReactNode
      disabled?: boolean
    }

    const middleDataHolder: MiddleDataItem[] = []

    middleItems?.forEach((item, i) => {
      if (i === 0) {
        middleDataHolder.push(item)
      } else if (
        i > 0 &&
        !item.transactionButton &&
        i !== middleItems.length - 1
      ) {
        middleDataHolder.push("Show More" as never)
      } else if (item.transactionButton && !item.disabled) {
        middleDataHolder.push(item)
      } else if (item.disabled && item.transactionButton) {
        middleDataHolder.push(item)
      } else if (i === middleItems.length - 1) {
        middleDataHolder.push(item)
      }
    })

    setMiddleData(middleDataHolder)
  }, [middleItems])

  const middleDataToUse =
    isExpanded || forceShowAll ? middleItems : middleData || []

  return (
    <div className={styles.timeline__container}>
      {startOverride ? (
        <div className={styles.start__item}>{startOverride}</div>
      ) : startItem ? (
        <div className={styles.start__item}>
          <div className={styles.img__wrapper}>
            <TokenImage
              tokenImg={startItem.coin.icon}
              tokenName={startItem.coin.label}
              className={styles.item__coin}
            />
            <span className={styles.dashed__line} />
          </div>
          <div className={styles.details__wrapper}>
            <h3>{startItem.msg}</h3>
            <div className={styles.item__chain}>
              <ChainImage
                chainImg={startItem.chain.icon}
                chainName={startItem.chain.label}
                small
              />
              <h6 className={styles.details__msg}>{startItem.chain.label}</h6>
            </div>
          </div>
        </div>
      ) : null}

      {middleData && (
        <div className={styles.middle__items__container}>
          {middleDataToUse?.map((item, i) => {
            if (
              item === "Show More" &&
              i === middleDataToUse.indexOf("Show More")
            ) {
              return (
                <div
                  className={cx(styles.middle__item, styles.show__more)}
                  onClick={() => setIsExpanded(true)}
                >
                  <div className={styles.middle__info}>
                    <div className={styles.img__wrapper}>
                      <div className={styles.show__icon__wrapper}>
                        <BuyIcon fill={"var(--token-light-100)"} />
                      </div>
                      <span className={styles.dashed__line} />
                    </div>
                    <div className={styles.details__wrapper}>
                      <h4>Show More</h4>
                    </div>
                  </div>
                </div>
              )
            } else if (item === "Show More") {
              return null
            }

            return (
              <div
                className={cx(styles.middle__item, {
                  disabled: item?.disabled,
                })}
                key={i}
              >
                <div className={styles.middle__info}>
                  <div className={styles.img__wrapper}>
                    {item?.variant === "success" ? (
                      <SmallCircleCheckIcon fill="var(--token-success-500)" />
                    ) : item.variant === "warning" ? (
                      <AlertIcon
                        fill={
                          item?.disabled
                            ? "var(--token-dark-900)"
                            : "var(--token-warning-500)"
                        }
                      />
                    ) : (
                      <span className={styles.grey__circle} />
                    )}
                    {(!(
                      !endItem &&
                      !item.transactionButton &&
                      i === middleData.length - 1
                    ) ||
                      hasNextElement) && (
                      <span className={styles.dashed__line} />
                    )}
                  </div>
                  <div
                    className={cx(styles.details__wrapper, {
                      hasPill: item.warningPillText,
                    })}
                  >
                    {item.warningPillText && (
                      <Pill
                        variant={item?.disabled ? "disabled" : "warning"}
                        text={item.warningPillText}
                      />
                    )}
                    <h4>{item.msg}</h4>
                  </div>
                </div>
                {item.transactionButton}
              </div>
            )
          })}
        </div>
      )}

      {endItem && (
        <div className={styles.end__item}>
          <div className={styles.img__wrapper}>
            <TokenImage
              tokenImg={endItem.coin.icon}
              tokenName={endItem.coin.label}
              className={styles.item__coin}
            />
            {hasNextElement && <span className={styles.dashed__line} />}
          </div>
          <div className={styles.details__wrapper}>
            <h3>{endItem.msg}</h3>
            <div className={styles.item__chain}>
              <ChainImage
                chainImg={endItem.chain.icon}
                chainName={endItem.chain.label}
                className={styles.chain__icon}
                small
              />
              <h6 className={styles.details__msg}>{endItem.chain.label}</h6>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Timeline
