import { SectionHeader, InputWrapper, TextArea, SummaryTable } from "station-ui"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { ReadMultiple } from "components/token"
import { useTranslation } from "react-i18next"
import { Wrong } from "components/feedback"

const ReadTx = ({ tx: encoded }: { tx: string }) => {
  const { t } = useTranslation()
  const lcd = useInterchainLCDClient()

  const decodeTx = (encoded: string) => {
    try {
      return lcd.tx.decode(encoded)
    } catch {
      return
    }
  }

  const render = () => {
    const tx = decodeTx(encoded)
    if (!tx) return <Wrong>{t("Invalid tx")}</Wrong>

    const { body, auth_info } = tx
    const { memo, messages } = body
    const { fee } = auth_info

    const txDetails = [
      { label: t("Memo"), value: memo },
      { label: t("Fee"), value: <ReadMultiple list={fee.amount.toData()} /> },
    ]

    return (
      <>
        <SectionHeader title={t("Details")} withLine />
        <InputWrapper label={t("Message")}>
          {messages.map((message, index) => (
            <TextArea readOnly={true} value={message.toJSON()} key={index} />
          ))}
        </InputWrapper>
        <SummaryTable rows={txDetails.filter((detail) => !!detail.value)} />
      </>
    )
  }

  return <>{encoded ? render() : null}</>
}

export default ReadTx
