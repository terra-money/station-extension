import style from "./Swap.module.scss"
import { useTranslation } from "react-i18next"
import {
  Button,
  Input,
  InputWrapper,
  ButtonInlineWrapper,
  Form,
  SubmitButton,
} from "@terra-money/station-ui"
import { useSwap } from "./SwapContext"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

interface SlippageForm {
  slippage: string
}

const SlippagePage = () => {
  const { slippage, changeSlippage } = useSwap()
  const { t } = useTranslation()
  const form = useForm<SlippageForm>({
    mode: "onChange",
    defaultValues: { slippage },
  })
  const { register, handleSubmit } = form
  const navigate = useNavigate()

  const onSubmit = () => {
    changeSlippage(form.watch().slippage)
    navigate(-1)
  }

  return (
    <form
          className={style.form__container}
          onSubmit={handleSubmit(onSubmit)}
        >
    {/* <Form onSubmit={handleSubmit(onSubmit)} className={style.slippage}> */}
      <InputWrapper label={t("Max Slippage")}>
        <Input placeholder={slippage} {...register("slippage")} emoji="%" />
      </InputWrapper>

      <ButtonInlineWrapper>
        <Button
          label={t("Cancel")}
          onClick={() => navigate(-1)}
          variant="secondary"
        />
        <SubmitButton label={t("Save")} variant="primary" />
      </ButtonInlineWrapper>
    {/* </Form> */}
    </form>
  )
}

export default SlippagePage
