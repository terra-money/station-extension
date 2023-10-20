import { ModalButton, Input, InputWrapper, Button } from "station-ui"
import { useState } from "react"
import ExtensionPage from "extension/components/ExtensionPage"
import { ReactComponent as EmptyEmoji } from "styles/images/icons/EmptyEmoji.svg"
import styles from "./EmojiButton.module.scss"
const emojiOptions = [
  "💳",
  "⚡️",
  "🐋",
  "🚀",
  "🔥",
  "💼",
  "🦊",
  "🐉",
  "🌝",
  "⭐️",
  "☂️",
  "🍟",
  "🎩",
  "🍭",
]

interface Props {
  icon?: string
  onClick: (emoji: string) => void
}

const EmojiButton = ({ onClick, icon }: Props) => {
  const [emoji, setEmoji] = useState<string>(icon ?? "")

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
      <InputWrapper label="Icon">
        <Input
          placeholder="Letter or Emoji"
          maxLength={1}
          value={emoji}
          onChange={(e) => {
            setEmoji(e.target.value)
          }}
        />
      </InputWrapper>
      <div className={styles.picker}>
        {emojiOptions.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              setEmoji(emoji)
            }}
            className={styles.emojiButton}
          >
            {emoji}
          </button>
        ))}
      </div>
      <Button
        variant="primary"
        style={{ width: "100%" }}
        disabled={!emoji}
        label="Save"
        onClick={() => {
          onClick(emoji)
        }}
      />
    </ModalButton>
  )
}

export default EmojiButton
