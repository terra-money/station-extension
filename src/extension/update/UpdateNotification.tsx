import { RefetchOptions } from "data/query"
import { useQuery } from "react-query"
import browser from "webextension-polyfill"
import styles from "./UpdateNotification.module.scss"
import { useTranslation } from "react-i18next"

const useIsUpdateAvailable = () => {
  return useQuery(
    [],
    async () => {
      const updateStatus = await browser?.runtime?.requestUpdateCheck()
      if (updateStatus) return updateStatus[0] === "update_available"
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
      {t("There is a new version available")}
      <button onClick={() => browser.runtime.reload()}>{t("Reload")}</button>
    </div>
  )
}
