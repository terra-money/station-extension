import { ExternalLink } from "components/general"
import styles from "./ExtensionFooter.module.scss"
import browser from "webextension-polyfill"
import { StationIcon } from "@terra-money/station-ui"

export default function ExtensionFooter() {
  const version = browser.runtime?.getManifest?.()?.version

  return (
    <footer className={styles.footer}>
      <section className={styles.version}>
        <StationIcon width={16} height={16} />
        <span> Station Wallet</span>
        {version && ` v${version}`}
      </section>
      <section className={styles.links}>
        <ExternalLink href="https://terra.sc/stationdiscord">
          Discord
        </ExternalLink>
        <ExternalLink href="https://twitter.com/StationWallet">X</ExternalLink>
        <ExternalLink href="https://medium.com/terra-money">
          Medium
        </ExternalLink>
        <ExternalLink href="https://docs.terra.money/learn/station/download/station-extension">
          Docs
        </ExternalLink>
      </section>
    </footer>
  )
}
