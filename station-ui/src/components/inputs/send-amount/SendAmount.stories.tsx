/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react"
import { useForm } from "react-hook-form"
import type { Meta, StoryObj } from "@storybook/react"
import SendAmount, { SendAmountProps } from "./SendAmount"
import { tokensBySymbol, tokenPrices } from "../asset-selector/fakedata"
import { input, toInput } from "./validate"

const meta: Meta<SendAmountProps> = {
  title: "Components/Inputs/Send Amount/Stories",
  component: SendAmount,
  argTypes: {},
} as Meta

export default meta

export const Example: StoryObj<SendAmountProps> = {
  render: () => {
    const [sendToken, ] = useState("LUNA")
    const { handleSubmit, register, watch, setValue, formState } = useForm({
      mode: "onChange",
      defaultValues: { tokenAmount: 0, currencyAmount: 0 }
    })
    const onSubmit = handleSubmit(data => console.log(data))

    return (
      <form onSubmit={onSubmit}>
        <SendAmount
          setValue={setValue}
          tokenInputAttr={
            {...register("tokenAmount", {
              required: true,
              valueAsNumber: true,
              validate: input(
                toInput(100000000, 6),
                8,
                "Token amount",
              ),
            })}
          }
          tokenAmount={watch("tokenAmount") || 0}
          currencyInputAttrs={
            {...register("currencyAmount", {
              valueAsNumber: true,
              required: true,
              deps: ["tokenAmount"],
            })}
          }
          currencyAmount={watch("currencyAmount") || 0}
          symbol={sendToken}
          tokenIcon={tokensBySymbol[sendToken].tokenIcon}
          currencySymbol={"$"}
          price={tokenPrices[sendToken]}
          formState={formState}
        />
      </form>
    )
  },
}