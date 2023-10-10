import { ModalButton } from "station-ui"
import { ReactComponent as EmptyEmoji } from "styles/images/icons/EmptyEmoji.svg"
import styles from "./EmojiButton.module.scss"
import { useState } from "react"

const emojiOptions = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
]

interface Props {
  icon?: string
  onClick: (emoji: string) => void
}

const EmojiButton = ({ onClick, icon }: Props) => {
  return (
    <ModalButton
      title="Icon"
      renderButton={(open) =>
        icon ? (
          <span onClick={open}>{icon}</span>
        ) : (
          <EmptyEmoji onClick={open} />
        )
      }
    >
      <div className={styles.picker}>
        {emojiOptions.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onClick(emoji)
            }}
            className={styles.emojiButton}
          >
            {emoji}
          </button>
        ))}
      </div>
    </ModalButton>
  )
}

export default EmojiButton
