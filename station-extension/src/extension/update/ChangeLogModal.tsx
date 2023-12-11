import { useQuery } from "react-query"
import styles from "./ChangeLogModal.module.scss"
import { LoadingCircular, Modal } from "@terra-money/station-ui"
import axios from "axios"
import { RefetchOptions } from "data/query"
import browser from "webextension-polyfill"
import { markdownTextParser } from "utils/markdown"
import { useState } from "react"

const LOCALSTORAGE_CHANGELOG_KEY = "LastChangelogShown"

const useChangeLogInfo = (version?: string) => {
  return useQuery(
    [version, 1],
    async () => {
      const FALLBACK_TEXT = "No information about the update available."
      try {
        const { data } = await axios.get(
          `https://api.github.com/repos/terra-money/station-extension/releases/tags/${version}`
        )

        return { ...data, body: data.body ?? FALLBACK_TEXT }
      } catch (e) {
        return { body: FALLBACK_TEXT }
      }
    },
    { ...RefetchOptions.INFINITY, enabled: !!version }
  )
}

export default function ChangeLogModal() {
  const currentVersion = browser.runtime?.getManifest?.()?.version
  const lastVersionShown = localStorage.getItem(LOCALSTORAGE_CHANGELOG_KEY)
  const [showChangelog, setShowChangelog] = useState<boolean>(
    !!currentVersion && currentVersion !== lastVersionShown
  )

  const { data: changeLogs } = useChangeLogInfo(currentVersion)

  return (
    <Modal
      isOpen={showChangelog}
      onRequestClose={() => {
        setShowChangelog(false)
        localStorage.setItem(LOCALSTORAGE_CHANGELOG_KEY, currentVersion)
      }}
    >
      <article className={styles.changelog__container}>
        <div className={styles.changelog__header}>
          <span className={styles.icon}>🚀</span>
          <h2 className={styles.title}>Release Notes</h2>
          {changeLogs && (
            <h3 className={styles.subtitle}>
              v{currentVersion} (
              {new Date(changeLogs.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              )
            </h3>
          )}
        </div>
        {changeLogs ? (
          <div className={styles.changelog__body}>
            {markdownTextParser(changeLogs.body, true)}
          </div>
        ) : (
          <div className={styles.changelog__loading}>
            <LoadingCircular />
          </div>
        )}
      </article>
    </Modal>
  )
}
