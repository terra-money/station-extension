import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { Grid } from "components/layout"
import { Submit } from "components/form"
import { Details } from "components/display"
import useAuth from "../../hooks/useAuth"
import { addressFromWords } from "utils/bech32"
import { FlexColumn } from "station-ui"
import styles from "./CreatedWallet.module.scss"

interface Props extends SingleWallet {
  onConfirm?: () => void
}

const CreatedWallet = ({ name, words, onConfirm }: Props) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { connect } = useAuth()

  const address = addressFromWords(words["330"])
  const submit = () => {
    if (onConfirm) {
      onConfirm()
    } else {
      connect(name)
    }
    navigate("/", { replace: true })
  }

  return (
    <FlexColumn justify="space-between" style={{ height: "100%" }}>
      <Grid gap={28}>
        <header className={styles.header}>
          <CheckCircleIcon className="success" style={{ fontSize: 56 }} />
          <h1>{t("Success!")}</h1>
          <p>{t("The wallet was created")}</p>
        </header>

        <Details>
          <section className={styles.address}>
            <h4>{name}</h4>
            <p>{address}</p>
          </section>
        </Details>
      </Grid>
      <Submit type="button" onClick={submit}>
        {t("Done")}
      </Submit>
    </FlexColumn>
  )
}

export default CreatedWallet
