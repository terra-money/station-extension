import { useState } from "react"
import classNames from "classnames/bind"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import CheckIcon from "@mui/icons-material/Check"
import useTimeout from "utils/hooks/useTimeout"
import { Flex } from "components/layout"
import styles from "./Copy.module.scss"

const cx = classNames.bind(styles)

const Copy = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  useTimeout(() => setCopied(false), copied ? 1000 : 0)

  return (
    <button
      type="button"
      className={cx(styles.button, { copied })}
      onClick={(e) => {
        e.stopPropagation()
        setCopied(true)
        navigator.clipboard.writeText(text)
      }}
    >
      <Flex gap={4}>
        {copied ? (
          <CheckIcon style={{ fontSize: 26, padding: 4 }} />
        ) : (
          <ContentCopyIcon style={{ fontSize: 26, padding: 4 }} />
        )}
      </Flex>
    </button>
  )
}

export default Copy
