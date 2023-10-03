import { SectionHeader, SummaryCard, SendHeader } from "station-ui"
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
    const rows = [
      { label: "Release Date", value: item.end.toLocaleDateString() },
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
    <>
      <SendHeader heading="" label="Vesting Details" subLabel="" />
      <VestingCard token={token} />
      {schedule.map((item, index) => (
        <>
          <SectionHeader
            title={`Period ${index + 1}`}
            className={styles.header}
          />
          <SummaryCard className={styles.wrapper}>
            {renderSummaryRows(item)}
          </SummaryCard>
        </>
      ))}
    </>
  )
}

export default AssetVesting
