import { useQuery } from "react-query"
import styles from "./ChangeLogModal.module.scss"
import ReactModal from "react-modal"
import axios from "axios"
import { RefetchOptions } from "data/query"
import browser from "webextension-polyfill"
import { markdownTextParser } from "utils/markdown"
import { useState } from "react"

const LOCALSTORAGE_CHANGELOG_KEY = "LastChangelogShown"

const useChangeLogInfo = (version?: string) => {
  return useQuery(
    [version],
    async () => {
      const FALLBACK_TEXT = "No information about the update available."
      try {
        const { data } = await axios.get(
          `https://api.github.com/repos/terra-money/station-extension/releases/tags/${version}`
        )

        return data.body ?? FALLBACK_TEXT
      } catch (e) {
        return FALLBACK_TEXT
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

  const { data: changeLogText } = useChangeLogInfo(currentVersion)

  return (
    <ReactModal
      isOpen={showChangelog}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <h1 className={styles.title}>Station has been updated!</h1>
      <div>{changeLogText && markdownTextParser(changeLogText, true)}</div>
      <button
        className={styles.confirm}
        onClick={() => {
          setShowChangelog(false)
          localStorage.setItem(
            LOCALSTORAGE_CHANGELOG_KEY,
            browser.runtime?.getManifest?.()?.version
          )
        }}
      >
        Continue
      </button>
    </ReactModal>
  )
}
