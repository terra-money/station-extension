import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { addressFromWords } from "utils/bech32"
import { Button, FlexColumn, SummaryHeader } from "station-ui"

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
    <FlexColumn gap={40}>
      <SummaryHeader
        statusLabel={t("Success!")}
        statusMessage={t("The wallet was created")}
        status={"success"}
        summaryTitle={name}
        summaryValue={address}
      />
      <Button variant="primary" onClick={submit}>
        {t("Done")}
      </Button>
    </FlexColumn>
  )
}

export default CreatedWallet
