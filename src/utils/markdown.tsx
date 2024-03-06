import { TooltipIcon } from "components/display"
import { ExternalLink } from "components/general"
import styles from "./markdown.module.scss"

export const markdownTextParser = (text: string, showLinks?: boolean) => {
  if (!text) return null
  const result: (React.ReactNode | string)[] = []
  const lines = text.split(/\\n|\n/)

  lines.forEach((line, i) => {
    // empty lines
    //if (!line) return

    if (line.startsWith("# ")) {
      result.push(
        <h1 key={i} className={styles.title1}>
          {line.replace("# ", "")}
        </h1>
      )
    } else if (line.startsWith("## ")) {
      result.push(
        <h2 key={i} className={styles.title2}>
          {line.replace("## ", "")}
        </h2>
      )
    } else if (line.startsWith("### ")) {
      result.push(
        <h3 key={i} className={styles.title3}>
          {line.replace("### ", "")}
        </h3>
      )
    } else {
      const lineResult: (React.ReactNode | string)[] = []
      const pattern =
        /\*\*(.*?)\*\*|`(.*?)`|(https?:\/\/[^\s]+)|\[(.*?)\]\((https?:\/\/[^\s]+)\)/g
      const fixedLine = line.startsWith("- ") ? line.replace("- ", "") : line
      let match = pattern.exec(fixedLine)
      let lastIndex = 0

      while (match) {
        lineResult.push(fixedLine.slice(lastIndex, match.index))
        if (match[1]) {
          // bold text
          lineResult.push(<b key={`${i}-${lineResult.length}`}>{match[1]}</b>)
        } else if (match[2]) {
          // code
          lineResult.push(
            <code key={`${i}-${lineResult.length}`}>{match[2]}</code>
          )
        } else if (match[3]) {
          // plain URL
          lineResult.push(
            showLinks || isLinkSafe(match[3]) ? (
              <ExternalLink
                href={match[3]}
                icon
                key={`${i}-${lineResult.length}`}
              >
                {match[3]}
              </ExternalLink>
            ) : (
              <TooltipIcon
                content={`This link has been hidden for security reasons.`}
              >
                <i>Hidden link</i>
              </TooltipIcon>
            )
          )
        } else if (match[4] && match[5]) {
          lineResult.push(
            showLinks || isLinkSafe(match[3]) ? (
              <ExternalLink
                href={match[5]}
                icon
                key={`${i}-${lineResult.length}`}
              >
                {match[4]}
              </ExternalLink>
            ) : (
              <TooltipIcon
                content={`This link has been hidden for security reasons.`}
              >
                <i>hidden link</i>
              </TooltipIcon>
            )
          )
        }
        lastIndex = pattern.lastIndex
        match = pattern.exec(fixedLine)
      }
      lineResult.push(fixedLine.slice(lastIndex))

      if (line.startsWith("- ")) {
        result.push(<li key={i}>{lineResult}</li>)
      } else {
        result.push(
          lineResult.length >= 1 &&
            lineResult[0] !== "\r" &&
            !!lineResult[0] ? (
            <p key={i}>{lineResult}</p>
          ) : (
            <br />
          )
        )
      }
    }
  })

  return result
}

function isLinkSafe(url: string) {
  try {
    const { protocol, hostname } = new URL(url)
    return (
      protocol === "https:" &&
      (hostname === "terra.dev" || hostname.endsWith(".terra.dev"))
    )
  } catch (e) {
    return false
  }
}
