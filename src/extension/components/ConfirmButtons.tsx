import { ButtonHTMLAttributes } from "react"
import { Flex } from "components/layout"
import { Button } from "@terra-money/station-ui"
import styles from "./ConfirmButtons.module.scss"

type ButtonAttrs = ButtonHTMLAttributes<HTMLButtonElement>

interface Props {
  buttons: [ButtonAttrs, ButtonAttrs] | [ButtonAttrs]
}

const ConfirmButtons = ({ buttons }: Props) => {
  if (buttons.length === 1)
    return (
      <Button {...buttons[0]} className={styles.button} variant="primary" />
    )

  const [deny, approve] = buttons

  return (
    <Flex gap={10} className={styles.container}>
      <Button {...deny} className={styles.button} variant="warning" />
      <Button {...approve} className={styles.button} variant="primary" />
    </Flex>
  )
}

export default ConfirmButtons
