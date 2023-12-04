import {
  ModalButton,
  Input,
  InputWrapper,
  Button,
  useModal,
} from "@terra-money/station-ui"
import { useState } from "react"
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

const EmojiPage = (props: Props) => {
  const { closeModal } = useModal()
  const icon = props.icon ?? ""
  const [emoji, setEmoji] = useState(icon)
  return (
    <>
      <InputWrapper label="Icon">
        <Input
          placeholder="Letter or Emoji"
          maxLength={1}
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
        />
      </InputWrapper>
      <div className={styles.picker}>
        {emojiOptions.map((emoji) => (
          <button
            key={emoji}
            onClick={() => setEmoji(emoji)}
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
          props.onClick(emoji)
          closeModal()
        }}
      />
    </>
  )
}

const EmojiButton = (props: Props) => {
  return (
    <ModalButton
      title="Icon"
      renderButton={(open) =>
        props.icon ? (
          <span onClick={open}>{props.icon}</span>
        ) : (
          <EmptyEmoji onClick={open} />
        )
      }
    >
      <EmojiPage {...props} />
    </ModalButton>
  )
}

export default EmojiButton
