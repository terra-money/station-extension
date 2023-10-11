import { SectionHeader, SendHeader } from "station-ui"
import VestingCard from "./VestingCard"
import {
  isVestingAccount,
  parseVestingSchedule,
  useAccount,
} from "data/queries/vesting"
import styles from "./VestingDetailsPage.module.scss"
import { VestingScheduleItem } from "data/queries/vesting"
import { ReadPercent, Read } from "components/token"

interface Props {
  token?: string
  chain?: string
}

const AssetVesting = ({ token = "uluna" }: Props) => {
  const { data } = useAccount()

  if (!data || !isVestingAccount(data)) return null

  const { schedule } = parseVestingSchedule(data)

  const renderSummaryRows = (item: VestingScheduleItem) => {
    const dateRange = `${item.start?.toLocaleDateString()} - ${item.end.toLocaleDateString()}`
    const rows = [
      { label: "Release Date", value: dateRange },
      { label: "Amount", value: <Read amount={item.amount} /> },
      { label: "Ratio", value: <ReadPercent>{item.ratio}</ReadPercent> },
    ]

    return rows.map((row) => (
      <div className={styles.row}>
        <div className={styles.label}>{row.label}</div>
        <div className={styles.value}>{row.value}</div>
      </div>
    ))
  }

  return (
    <div className={styles.container}>
      <SendHeader heading="" label="Vesting Details" subLabel="" />
      <VestingCard token={token} />
      {schedule.map((item, index) => (
        <>
          <SectionHeader
            title={`Period ${index + 1}`}
            className={styles.header}
          />
          <section className={styles.wrapper}>
            {renderSummaryRows(item)}
          </section>
        </>
      ))}
    </div>
  )
}

export default AssetVesting
