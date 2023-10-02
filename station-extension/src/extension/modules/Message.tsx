import { useState } from "react"
import classNames from "classnames/bind"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import { Coins, Msg, MsgAminoCustom } from "@terra-money/feather.js"
import { readMsg } from "@terra-money/msg-reader"
import TxMessage from "app/containers/TxMessage"
import styles from "./Message.module.scss"

const cx = classNames.bind(styles)

function parseAminoType(type: string) {
  return type.split("/")[type.split("/").length - 1].split("-").join(" ")
}

const Message = ({ msg, warn }: { msg: Msg; warn: boolean }) => {
  const summary =
    msg instanceof MsgAminoCustom
      ? parseAminoType(msg.toAmino()["type"] ?? "")
      : //@ts-expect-error
        readMsg(msg)
  const type =
    msg instanceof MsgAminoCustom
      ? msg.toAmino()["type"]
      : msg.toData()["@type"]

  const [collapsed, setCollapsed] = useState(true)
  const toggle = () => setCollapsed(!collapsed)

  const renderValue = (value: string | object | Coins) => {
    return value instanceof Coins ? (
      <pre>{JSON.stringify(value.toData())}</pre>
    ) : typeof value === "object" ? (
      <pre>{JSON.stringify(value, null, 2)}</pre>
    ) : (
      value
    )
  }

  return (
    <article className={cx(styles.component, { warn })}>
      <button className={styles.header} onClick={toggle}>
        <TxMessage>{summary}</TxMessage>
        <KeyboardArrowDownIcon style={{ fontSize: 16 }} />
      </button>

      {!collapsed && (
        <section>
          {[
            ["type", type],
            ...Object.entries(
              msg instanceof MsgAminoCustom ? msg.toAmino()["value"] : msg ?? {}
            ),
          ].map(([key, value]) => {
            return (
              <article className={styles.detail} key={key}>
                <h1>{key}</h1>
                <section className={styles.value}>{renderValue(value)}</section>
              </article>
            )
          })}
        </section>
      )}
    </article>
  )
}

export default Message
