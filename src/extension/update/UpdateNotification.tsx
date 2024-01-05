import { RefetchOptions, queryKey } from "data/query"
import { useQuery } from "react-query"
import browser from "webextension-polyfill"
import styles from "./UpdateNotification.module.scss"
import { useTranslation } from "react-i18next"
import InfoIcon from "@mui/icons-material/Info"
import { Flex } from "@terra-money/station-ui"

const useIsUpdateAvailable = () => {
  return useQuery(
    [queryKey.extension.checkUpdate],
    async () => {
      try {
        const updateStatus = await browser?.runtime?.requestUpdateCheck()
        if (updateStatus) return updateStatus[0] === "update_available"
      } catch (e) {
        return false
      }
    },
    { ...RefetchOptions.DEFAULT }
  )
}

export default function UpdateNotification() {
  const { t } = useTranslation()
  const { data } = useIsUpdateAvailable()
  // no update available or request still in progress
  // (comment out next line to test)
  if (!data) return null

  // update available
  return (
    <div className={styles.notification}>
      <Flex gap={8} justify="flex-start">
        <InfoIcon fontSize="inherit" style={{ fontSize: 14 }} />
        {t("There is a new extension version available")}
      </Flex>
      <button onClick={() => browser.runtime.reload()}>{t("Update")}</button>
    </div>
  )
}
