import { ExternalLink } from 'components/general'
import styles from './ExtensionFooter.module.scss'
import { useThemeFavicon } from 'data/settings/Theme'
import browser from 'webextension-polyfill'

export default function ExtensionFooter() {
  const icon = useThemeFavicon()
  const version = browser.runtime?.getManifest?.()?.version

  return (
    <footer className={styles.footer}>
      <section className={styles.version}>
        <img src={icon} alt='Station' width={16} />
        <span> Station Wallet</span>
        {version && ` v${version}`}
      </section>
      <section className={styles.links}>
        <ExternalLink href='https://terra.sc/discord'>Discord</ExternalLink>
        <ExternalLink href='https://twitter.com/terra_money'>X</ExternalLink>
        <ExternalLink href='https://medium.com/terra-money'>
          Medium
        </ExternalLink>
        <ExternalLink href='https://docs.terra.money/learn/station/download/station-extension'>
          Docs
        </ExternalLink>
      </section>
    </footer>
  )
}
