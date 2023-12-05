import { Grid, SectionHeader, SummaryTable } from "@terra-money/station-ui"
import VestingCard from "./VestingCard"
import { parseVestingSchedule, useAccount } from "data/queries/vesting"
import styles from "./VestingDetailsPage.module.scss"
import { VestingScheduleItem } from "data/queries/vesting"
import { ReadPercent, Read } from "components/token"

const AssetVesting = () => {
  const { data: account } = useAccount()

  if (!account) return null

  const { schedule } = parseVestingSchedule(account)
  const renderSummaryRows = (item: VestingScheduleItem) => {
    const dateRange = `${item.start?.toLocaleDateString()} - ${item.end.toLocaleDateString()}`
    const rows = [
      { label: "Release Date", value: dateRange },
      { label: "Amount", value: <Read amount={item.amount} /> },
      { label: "Ratio", value: <ReadPercent>{item.ratio}</ReadPercent> },
    ]
    return <SummaryTable className={styles.period} rows={rows} />
  }

  return (
    <Grid gap={12}>
      <VestingCard />
      {schedule.map((item, i) => (
        <div key={i}>
          <SectionHeader title={`Period ${i + 1}`} className={styles.header} />
          {renderSummaryRows(item)}
        </div>
      ))}
    </Grid>
  )
}

export default AssetVesting
