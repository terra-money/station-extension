import { PropsWithChildren } from "react"
import { useTranslation } from "react-i18next"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { Auto } from "components/layout"
import { Wrong } from "components/feedback"
import { ReadMultiple } from "components/token"
import { SectionHeader, InputWrapper, TextArea, SummaryTable } from "station-ui"

const ReadTx = (props: PropsWithChildren<{ tx: string }>) => {
  const { tx: encoded, children } = props
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
        <InputWrapper label={t("Message")}>
          <SummaryTable rows={txDetails.filter((detail) => !!detail.value)} />
        </InputWrapper>
      </>
    )
  }

  return <Auto columns={[<>{children}</>, encoded ? render() : <></>]} />
}

export default ReadTx
