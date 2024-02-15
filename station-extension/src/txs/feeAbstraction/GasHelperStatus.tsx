import { TxInfo } from "@terra-money/feather.js"
import {
  AlertIcon,
  Button,
  GasHelperCard,
  GasIcon,
  Grid,
  SmallCircleCheckIcon,
  StepStatus,
  TransactionTracker,
} from "@terra-money/station-ui"
import { intervalToDuration } from "date-fns"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { IbcTxStatus, getIbcTxDetails, useIbcTxStatus } from "txs/useIbcTxs"
import useInterval from "utils/hooks/useInterval"
import styles from "./GasHelper.module.scss"
import { useThemeAnimation } from "data/settings/Theme"
import { useNativeDenoms } from "data/token"

const GasHelperStatus = ({
  tx,
  timestamp,
  chainID,
  onSuccess,
  gasDenom,
}: {
  tx?: TxInfo
  timestamp: number
  chainID: string
  onSuccess: () => void
  gasDenom: string
}) => {
  const loadingAnimation = useThemeAnimation()
  const ibcDetails =
    tx?.logs &&
    getIbcTxDetails({
      chain: chainID,
      logs: tx.logs,
    })

  const [ibcStatus, setState] = useState<IbcTxStatus | undefined>()

  useIbcTxStatus(ibcDetails ? [ibcDetails] : [], (_, status) => {
    setState(status)
  })

  const timer = useTimer(
    timestamp,
    !tx || !ibcStatus || ibcStatus === IbcTxStatus.LOADING
  )
  const { t } = useTranslation()
  const readNativeDenom = useNativeDenoms()

  function renderIbcStatusText() {
    if (!tx || !ibcStatus) {
      return timer
    }

    switch (ibcStatus) {
      case IbcTxStatus.LOADING:
        return timer
      case IbcTxStatus.SUCCESS:
        return t("Done!")
      case IbcTxStatus.FAILED:
        return t("Error")
    }
  }

  function ibcSteps(): StepStatus[] {
    if (!tx) {
      return ["inProgress", "incomplete"]
    }

    switch (ibcStatus) {
      case IbcTxStatus.SUCCESS:
        return ["completed", "completed"]
      case IbcTxStatus.FAILED:
        return ["completed", "failed"]
      default:
        return ["completed", "incomplete"]
    }
  }

  function renderTitle() {
    switch (ibcStatus) {
      case IbcTxStatus.SUCCESS:
        return (
          <>
            <h3 className={styles.title}>
              <SmallCircleCheckIcon
                fill="var(--token-success-500)"
                width={16}
                height={16}
              />{" "}
              {t("Topup Complete!")}
            </h3>
            <p className={styles.description}>
              {t("You now have enough gas to complete your transaction.")}
            </p>
          </>
        )
      case IbcTxStatus.FAILED:
        return (
          <h3 className={styles.title}>
            <AlertIcon fill="var(--token-error-500)" width={16} height={16} />{" "}
            {t("Topup Failed!")}
          </h3>
        )
      default:
        return (
          <>
            <h3 className={styles.title}>
              <GasIcon fill="var(--token-warning-500)" width={20} height={20} />{" "}
              {t("Not Enough Gas!")}
            </h3>
            <p className={styles.description}>
              {t(
                "You don't have enough {{token}} to complete all the steps in this transaction, but we can fix that for you! Please select an available token below to convert for gas fees.",
                { token: readNativeDenom(gasDenom, chainID).symbol }
              )}
            </p>
          </>
        )
    }
  }

  function renderAnimation() {
    if (ibcStatus === IbcTxStatus.LOADING || !ibcStatus) {
      return (
        <img
          width={80}
          height={80}
          src={loadingAnimation}
          alt={t("Loading")}
          className={styles.transaction__animation}
        />
      )
    }
  }

  return (
    <div className={styles.hepler__container}>
      <GasHelperCard
        className={styles.card}
        progressColor={
          !ibcStatus || ibcStatus === IbcTxStatus.LOADING ? "yellow" : undefined
        }
      >
        {renderTitle()}
        <Grid gap={20}>
          {renderAnimation()}
          <div className={styles.transaction__progress}>
            <TransactionTracker
              steps={ibcSteps()}
              stepLabels={["Tx Initiated", "Tx Completed"]}
            />
            <p className={styles.transaction__timer}>{renderIbcStatusText()}</p>
          </div>
        </Grid>
      </GasHelperCard>
      {ibcStatus === IbcTxStatus.SUCCESS && (
        <Button
          variant="primary"
          label={t("Continue")}
          onClick={() => onSuccess()}
        />
      )}
    </div>
  )
}

/* helper */
const useTimer = (startTime: number, run: boolean) => {
  const start = new Date(startTime)
  const [now, setNow] = useState(new Date())

  useInterval(() => setNow(new Date()), run ? 1000 : null)

  const { minutes, seconds } = intervalToDuration({ start, end: now })
  return [minutes, seconds].map((str) => String(str).padStart(2, "0")).join(":")
}

export default GasHelperStatus
