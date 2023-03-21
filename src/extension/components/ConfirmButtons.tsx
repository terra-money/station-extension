import { ButtonHTMLAttributes } from "react"
import { Button } from "components/general"
import { Flex } from "components/layout"
import styles from "./ConfirmButtons.module.scss"

type ButtonAttrs = ButtonHTMLAttributes<HTMLButtonElement>

interface Props {
  buttons: [ButtonAttrs, ButtonAttrs] | [ButtonAttrs]
}

const ConfirmButtons = ({ buttons }: Props) => {
  if (buttons.length === 1)
    return <Button {...buttons[0]} className={styles.button} color="primary" />

  const [deny, approve] = buttons

  return (
    <Flex gap={10} className={styles.container}>
      <Button {...deny} className={styles.button} color="danger" />
      <Button {...approve} className={styles.button} color="primary" />
    </Flex>
  )
}

export default ConfirmButtons
