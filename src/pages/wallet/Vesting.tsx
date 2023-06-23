import {
  parseVestingSchedule,
  isVestingAccount,
  useAccount,
} from "data/queries/vesting"
import VestingScheduleTable from "./VestingScheduleTable"
import { useTranslation } from "react-i18next"
import { useNativeDenoms } from "data/token"
import styles from "./Vesting.module.scss"
import { useChainID } from "data/wallet"
import { Card } from "components/layout"
import { Read } from "components/token"
import Asset from "./Asset"

const Vesting = () => {
  const { t } = useTranslation()
  const { data, ...state } = useAccount()
  const readNativeDenom = useNativeDenoms()
  const chainID = useChainID()

  if (!data) return null
  if (!isVestingAccount(data)) return null

  const schedule = parseVestingSchedule(data)

  return (
    <Card {...state} title={t("Vesting")}>
      <Asset
        chains={[chainID]}
        denom={"uluna"}
        {...readNativeDenom("uluna", chainID)}
        id={`${chainID}:uluna`}
        balance={schedule.amount.total}
        hideActions
      />

      <section className={styles.amount}>
        <dl>
          <dt>{t("Vested")}</dt>
          <dd>
            <Read amount={schedule.amount.vested} />
          </dd>
        </dl>
      </section>

      <VestingScheduleTable {...schedule} />
    </Card>
  )
}

export default Vesting
