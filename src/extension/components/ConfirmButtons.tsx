import { ButtonHTMLAttributes } from "react"
import { Button } from "components/general"
import { Flex } from "components/layout"
import styles from "./ConfirmButtons.module.scss"

type ButtonAttrs = ButtonHTMLAttributes<HTMLButtonElement>

interface Props {
  buttons: [ButtonAttrs, ButtonAttrs]
}

const ConfirmButtons = ({ buttons }: Props) => {
  const [deny, approve] = buttons

  return (
    <Flex gap={10}>
      <Button {...deny} className={styles.button} color="danger" />
      <Button {...approve} className={styles.button} color="primary" />
    </Flex>
  )
}

export default ConfirmButtons
