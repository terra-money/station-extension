import { useState } from "react"
import {
  ModalButton,
  Input,
  InputWrapper,
  Button,
  useModal,
  FlexColumn,
  LaughIcon,
} from "@terra-money/station-ui"
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
    <FlexColumn gap={24} justify="space-between" style={{ height: "100%" }}>
      <FlexColumn gap={32}>
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
      </FlexColumn>
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
    </FlexColumn>
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
          <LaughIcon fill={"var(--token-dark-900)"} onClick={open} />
        )
      }
    >
      <EmojiPage {...props} />
    </ModalButton>
  )
}

export default EmojiButton
