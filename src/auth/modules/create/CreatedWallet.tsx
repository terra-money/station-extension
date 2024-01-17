import { useTranslation } from "react-i18next"
import useAuth from "../../hooks/useAuth"
import { addressFromWords } from "utils/bech32"
import { Button, Grid, SummaryHeader } from "@terra-money/station-ui"

interface Props extends SingleWallet {
  onConfirm?: () => void
}

const CreatedWallet = ({ name, words, onConfirm }: Props) => {
  const { t } = useTranslation()
  const { connect } = useAuth()

  const address = addressFromWords(words["330"])
  const submit = () => {
    if (onConfirm) {
      onConfirm()
    } else {
      connect(name)
    }
    window.close()
  }

  return (
    <Grid gap={40} data-testid="grid-container">
      <SummaryHeader
        statusLabel={t("Success!")}
        statusMessage={t("The wallet was created")}
        status={"success"}
        summaryTitle={name}
        summaryValue={address}
        data-testid="summary-header"
      />
      <Button variant="primary" onClick={submit} data-testid="submit-button">
        {t("Done")}
      </Button>
    </Grid>
  )
}

export default CreatedWallet
