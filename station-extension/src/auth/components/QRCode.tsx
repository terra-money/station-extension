import QRCodeReact from "qrcode.react"
import variable from "styles/variable"
import { Flex } from "components/layout"

const QRCode = ({ value }: { value: string }) => {
  return (
    <Flex>
      <QRCodeReact
        value={value}
        size={200}
        bgColor={variable("--token-dark-200")}
        fgColor={variable("--text")}
        renderAs="svg"
      />
    </Flex>
  )
}

export default QRCode
