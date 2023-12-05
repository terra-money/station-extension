import { ButtonHTMLAttributes } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@terra-money/station-ui"
import { LoadingCircular } from "@terra-money/station-ui"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  submitting?: boolean
  variant?: "primary" | "secondary"
  noMargin?: boolean
}

const Submit = ({ submitting, variant, noMargin, ...attrs }: Props) => {
  const { t } = useTranslation()

  return (
    <Button
      variant={variant ?? "primary"}
      {...attrs}
      icon={submitting && <LoadingCircular size={18} />}
      disabled={attrs.disabled || submitting}
      type={attrs.type ?? "submit"}
      style={{ marginTop: noMargin ? 0 : 20 }}
      block
    >
      {attrs.children || t("Submit")}
    </Button>
  )
}

export default Submit
