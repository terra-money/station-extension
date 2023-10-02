import { SectionHeader, SummaryCard } from "station-ui"
import { useWalletRoute } from "./Wallet"
import VestingCard from "./VestingCard"
import {
  isVestingAccount,
  parseVestingSchedule,
  useAccount,
} from "data/queries/vesting"
import styles from "./VestingDetailsPage.module.scss"

interface Props {
  token?: string
  chain?: string
}

const AssetVesting = (props: Props) => {
  const { route, setRoute } = useWalletRoute()
  const { data } = useAccount()
  const { token, chain } = props

  if (!data) return null
  if (!isVestingAccount(data)) return null

  const { schedule, amount } = parseVestingSchedule(data)
  console.log("schedule", schedule)

  return (
    <>
      <VestingCard token={props.token ?? "uluna"} />
      {schedule.map((item, index) => (
        <>
          <SectionHeader title={`Period ${index + 1}`} />
          <SummaryCard className={styles.wrapper}>
            {Object.keys(item).map((p, index) => (
              <>
                <div className={styles.label}>{JSON.stringify(p)}</div>
                {/* <div className={styles.value}>{Number(amount.total) * item[p].ratio}</div> */}
              </>
            ))}
          </SummaryCard>
        </>
      ))}
    </>
  )
}

export default AssetVesting
