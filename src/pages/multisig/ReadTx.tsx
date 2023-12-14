import {
  SectionHeader,
  InputWrapper,
  TextArea,
  SummaryTable,
} from "@terra-money/station-ui"
import { useInterchainLCDClient } from "data/queries/lcdClient"
import { ReadMultiple } from "components/token"
import { useTranslation } from "react-i18next"
import { PropsWithChildren } from "react"

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
    if (!tx)
      return (
        <>
          <SectionHeader title={t("Details")} withLine />
          <InputWrapper label={t("Message")}>
            <TextArea
              readOnly={true}
              value={"The provided transaction hash is not valid"}
              rows={2}
            />
          </InputWrapper>
        </>
      )

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
            <TextArea
              readOnly={true}
              value={message.toJSON()}
              rows={9}
              key={index}
            />
          ))}
        </InputWrapper>
        <SummaryTable rows={txDetails.filter((detail) => !!detail.value)} />
        {children}
      </>
    )
  }

  return encoded ? render() : null
}

export default ReadTx
