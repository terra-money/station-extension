import { useState } from "react"
import { useTranslation } from "react-i18next"
import { CopyToClipboard } from "react-copy-to-clipboard"
import classNames from "classnames/bind"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import useTimeout from "utils/hooks/useTimeout"
import { Flex } from "components/layout"
import styles from "./Copy.module.scss"

const cx = classNames.bind(styles)

const Copy = ({ children, ...props }: CopyToClipboard.Props) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  useTimeout(() => setCopied(false), copied ? 1000 : 0)

  return (
    <CopyToClipboard {...props} onCopy={() => setCopied(true)}>
      <button type="button" className={cx(styles.button, { copied })}>
        <Flex gap={4}>
          {children}
          <ContentCopyIcon fontSize="inherit" />
          {copied && t("Copied")}
        </Flex>
      </button>
    </CopyToClipboard>
  )
}

export default Copy
