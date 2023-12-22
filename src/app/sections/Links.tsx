import { useTranslation } from "react-i18next"
import DescriptionIcon from "@mui/icons-material/Description"
import BoltIcon from "@mui/icons-material/Bolt"
import { DOCUMENTATION, SETUP } from "config/constants"
import { ExternalLink } from "components/general"
import { Contacts } from "components/layout"
import styles from "./Links.module.scss"
import { capitalize } from "@mui/material"
import { useAddress } from "data/wallet"

const Links = () => {
  const { t } = useTranslation()
  const isConnected = useAddress()

  const community = {
    medium: "https://medium.com/terra-money",
    discord: "https://terra.sc/stationdiscord",
    telegram: "https://t.me/Station_Wallet",
    twitter: "https://twitter.com/StationWallet",
    github: "https://github.com/terra-money/station-wallet",
  }

  return (
    <div className={styles.links}>
      <div className={styles.tutorial}>
        {!isConnected && (
          <ExternalLink href={SETUP} className={styles.link}>
            <BoltIcon style={{ fontSize: 18 }} />
            {capitalize(t("setup"))}
          </ExternalLink>
        )}
        <ExternalLink href={DOCUMENTATION} className={styles.link}>
          <DescriptionIcon style={{ fontSize: 18 }} />
          {capitalize(t("documentation"))}
        </ExternalLink>
      </div>

      <div className={styles.community}>
        <Contacts contacts={community} menu />
      </div>
    </div>
  )
}

export default Links
