import { SectionHeader, SummaryCard } from "station-ui"
import VestingCard from "./VestingCard"
import {
  isVestingAccount,
  parseVestingSchedule,
  useAccount,
} from "data/queries/vesting"
import styles from "./VestingDetailsPage.module.scss"
import { VestingScheduleItem } from "data/queries/vesting"

interface Props {
  token?: string
  chain?: string
}

const AssetVesting = (props: Props) => {
  const { data } = useAccount()
  if (!data) return null
  if (!isVestingAccount(data)) return null

  const { schedule } = parseVestingSchedule(data)

  const getDateRange = (item: VestingScheduleItem) => {
    return [item.start?.toLocaleString(), item.end.toLocaleDateString()]
      .filter(Boolean)
      .join(" - ")
  }

  return (
    <>
      <VestingCard token={props.token ?? "uluna"} />
      {schedule.map((item, index) => (
        <>
          <SectionHeader title={`Period ${index + 1}`} />
          <SummaryCard className={styles.wrapper}>
            <>
              <div className={styles.row}>
                <div className={styles.label}>Release Date</div>
                <div className={styles.value}>{getDateRange(item)}</div>
              </div>
              <div className={styles.row}>
                <div className={styles.label}>Amount</div>
                <div className={styles.value}>{item.amount}</div>
              </div>
              <div className={styles.row}>
                <div className={styles.label}>Ratio</div>
                <div className={styles.value}>{item.ratio}</div>
              </div>
            </>
          </SummaryCard>
        </>
      ))}
    </>
  )
}

export default AssetVesting
