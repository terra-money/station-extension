import { useTranslation } from "react-i18next"
import Logo from "styles/images/LocalTerra.png"
import { useNetworkState } from "data/wallet"
import { ExternalLink } from "components/general"
import { FlexColumn } from "components/layout"
import styles from "./NetworkError.module.scss"
import { useTheme } from "data/settings/Theme"
import { Button } from "@terra-money/station-ui"

const LocalTerraError = ({ refresh }: { refresh: () => void }) => {
  const { t } = useTranslation()
  const [, setNetwork] = useNetworkState()
  const { name } = useTheme()

  return (
    <FlexColumn gap={20} className={name}>
      <img src={Logo} alt={t("Logo")} width={60} height={60} />

      <article>
        <h1 className={styles.title}>{t("LocalTerra is not running")}</h1>

        <ExternalLink href="https://github.com/terra-money/localterra">
          {t("Learn more")}
        </ExternalLink>
      </article>
      <FlexColumn gap={10}>
        <Button onClick={refresh} small variant="primary">
          {t("Refresh")}
        </Button>

        <Button onClick={() => setNetwork("mainnet")} small variant="secondary">
          {t("Back to mainnet")}
        </Button>
      </FlexColumn>
    </FlexColumn>
  )
}

export default LocalTerraError
