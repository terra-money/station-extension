import { useState } from "react"
import classNames from "classnames/bind"
import { Coins, Msg, MsgAminoCustom } from "@terra-money/feather.js"
import { readMsg } from "@terra-money/msg-reader"
import TxMessage from "app/containers/TxMessage"
import styles from "./Message.module.scss"
import { ReactComponent as ActivityIcon } from "styles/images/icons/Activity.svg"
import { ReactComponent as ArrowIcon } from "styles/images/icons/DropdownArrow.svg"

const cx = classNames.bind(styles)

function parseAminoType(type: string) {
  return type.split("/")[type.split("/").length - 1].split("-").join(" ")
}

const Message = ({ msg }: { msg: Msg; warn: boolean }) => {
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
    <article className={cx(styles.component)}>
      <button className={cx(styles.header, { collapsed })} onClick={toggle}>
        <div className={styles.icon__container}>
          <ActivityIcon width={18} height={18} className={styles.icon} />
          <TxMessage>{summary}</TxMessage>
        </div>
        <ArrowIcon width={12} height={12} className={styles.arrow__icon} />
      </button>

      {!collapsed && (
        <section className={styles.content}>
          <div className={styles.summary__display}>
            <TxMessage>{summary}</TxMessage>
          </div>
          {[
            ["type", type],
            ...Object.entries(
              msg instanceof MsgAminoCustom ? msg.toAmino()["value"] : msg ?? {}
            ),
          ].map(([key, value]) => {
            return (
              <article className={styles.detail} key={key}>
                <h3>{key}</h3>
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
