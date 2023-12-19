import {
  Button,
  Grid,
  LoadingCircular,
  Modal,
  SummaryHeader,
} from "@terra-money/station-ui"
import { isBroadcastingState, latestTxState, useTxInfo } from "data/queries/tx"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { createAmplitudeClient } from "utils/analytics/setupAmplitude"
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen"
import ActivityTxMessage from "pages/activity/ActivityTxMessage"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"
import { useInterchainAddresses } from "auth/hooks/useAddress"
import { FinderLink, LinkButton } from "components/general"
import { getCanonicalMsg } from "@terra-money/terra-utils"
import { useThemeAnimation } from "data/settings/Theme"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import { useEffect, useMemo, useState } from "react"
import { isTxError } from "@terra-money/feather.js"
import useInterval from "utils/hooks/useInterval"
import CloseIcon from "@mui/icons-material/Close"
import { AnalyticsEvent } from "utils/analytics"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { intervalToDuration } from "date-fns"
import styles from "./LatestTx.module.scss"
import { Flex } from "components/layout"

enum Status {
  LOADING = "loading",
  SUCCESS = "success",
  FAILURE = "alert",
}

const TxIndicator = ({ txhash }: { txhash: string }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const animation = useThemeAnimation()
  const amplitude = createAmplitudeClient()

  const [latestTx, setLatestTx] = useRecoilState(latestTxState)
  const [minimized, setMinimized] = useState(false)
  const initLatestTx = () => setLatestTx({ txhash: "", chainID: "" })
  const { redirectAfterTx, chainID, onSuccess } = latestTx

  /* polling */
  const { data, isSuccess } = useTxInfo(latestTx)

  /* context */
  const time = useTimeText(!isSuccess)

  /* status */
  const status = !data
    ? Status.LOADING
    : isTxError(data)
    ? Status.FAILURE
    : Status.SUCCESS

  useEffect(() => {
    if (status === Status.SUCCESS) onSuccess?.()
  }, [status, onSuccess])

  useEffect(() => {
    if (status !== Status.LOADING) {
      amplitude.trackEvent(AnalyticsEvent.TRANSACTION, { status })
    }
  }, [status, amplitude])

  /* render component */
  const icon = {
    [Status.LOADING]: <LoadingCircular size={36} thickness={2} />,
    [Status.SUCCESS]: (
      <DoneAllIcon className={styles.success} style={{ fontSize: 40 }} />
    ),
    [Status.FAILURE]: (
      <WarningAmberIcon className={styles.danger} style={{ fontSize: 40 }} />
    ),
  }[status]

  const title = {
    [Status.LOADING]: t("Queued"),
    [Status.SUCCESS]: t("Success!"),
    [Status.FAILURE]: t("Failed"),
  }[status]

  const txLink = (
    <FinderLink chainID={chainID} tx short>
      {txhash}
    </FinderLink>
  )

  const hashDetails = (
    <section className={styles.details}>
      {status === Status.LOADING && (
        <aside className={styles.queued}>
          <header>
            <h1>{t("Queued")}</h1>
            <h2>{time}</h2>
          </header>

          <p>{t("Transaction is processing")}</p>
        </aside>
      )}

      <section className={styles.hash}>
        <h1>{t("Tx hash")}</h1>
        {txLink}
      </section>
    </section>
  )

  /* parse tx log */
  const addresses = useInterchainAddresses() || {}

  return minimized ? (
    <div className={styles.minimized} onClick={() => setMinimized(false)}>
      {status !== Status.LOADING && (
        <button type="button" className={styles.close} onClick={initLatestTx}>
          <CloseIcon fontSize="small" />
        </button>
      )}

      <Flex className={styles.icon}>{icon}</Flex>

      <section className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.link}>{txLink}</p>
      </section>
    </div>
  ) : status === Status.LOADING ? (
    <Modal
      closeIcon={<CloseFullscreenIcon fontSize="inherit" />}
      isOpen={!minimized}
      onRequestClose={() => setMinimized(true)}
    >
      <Grid className={styles.loading__container} gap={16}>
        <img src={animation} width={100} height={100} alt="" />
        <h3>{t("Broadcasting transaction")}</h3>
        {hashDetails}
      </Grid>
    </Modal>
  ) : (
    <Modal
      closeIcon={false}
      footer={() =>
        redirectAfterTx ? (
          <LinkButton
            to={redirectAfterTx.path}
            onClick={initLatestTx}
            color="primary"
            block
          >
            {redirectAfterTx.label}
          </LinkButton>
        ) : (
          <Button onClick={initLatestTx} variant="primary" block>
            {t("Confirm")}
          </Button>
        )
      }
      isOpen={!minimized}
      onRequestClose={() => {
        initLatestTx()
        if (redirectAfterTx) navigate(redirectAfterTx.path)
      }}
      maxHeight
    >
      <Grid className={styles.result__container} gap={16}>
        <SummaryHeader statusLabel={title} status={status} statusMessage="" />
        {data && (
          <ul className={styles.messages}>
            {
              // TODO: update getCanonicalMsgs() to support station.js types
              getCanonicalMsg(data as any, addresses).map((msg, index) => {
                if (!msg) return null
                const { canonicalMsg } = msg
                return (
                  <li key={index}>
                    {canonicalMsg.map((msg, index) => (
                      <ActivityTxMessage key={index}>{msg}</ActivityTxMessage>
                    ))}
                  </li>
                )
              })
            }
          </ul>
        )}

        {hashDetails}
      </Grid>
    </Modal>
  )
}

const LatestTx = () => {
  const { txhash } = useRecoilValue(latestTxState)
  const setIsBroadcasting = useSetRecoilState(isBroadcastingState)

  useEffect(() => {
    setIsBroadcasting(!!txhash)
  }, [setIsBroadcasting, txhash])

  return !txhash ? null : <TxIndicator txhash={txhash} key={txhash} />
}

export default LatestTx

/* helper */
const useTimeText = (run: boolean) => {
  const start = useMemo(() => new Date(), [])
  const [now, setNow] = useState(new Date())

  useInterval(() => setNow(new Date()), run ? 1000 : null)

  const { minutes, seconds } = intervalToDuration({ start, end: now })
  return [minutes, seconds].map((str) => String(str).padStart(2, "0")).join(":")
}
