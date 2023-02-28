import ContentCopy from "@mui/icons-material/ContentCopy"
import Check from "@mui/icons-material/Check"
import { useState } from "react"

interface Props {
  text: string
  className?: string
}
const CopyIcon = ({ text, className }: Props) => {
  const [copied, setCopied] = useState(false)

  return (
    <button
      className={className}
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? (
        <Check style={{ fontSize: 18 }} />
      ) : (
        <ContentCopy style={{ fontSize: 18 }} />
      )}
    </button>
  )
}

export default CopyIcon
