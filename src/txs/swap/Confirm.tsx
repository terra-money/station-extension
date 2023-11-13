import { Form, SubmitButton } from "station-ui"
import { useSwap } from "./SwapContext"

const SwapConfirm = () => {
  const { swapForm } = useSwap()
  const { getValues } = swapForm
  console.log("render")

  return (
    <Form>
      {JSON.stringify(getValues())}
      <h1>Confirm</h1>
      <SubmitButton />
    </Form>
  )
}

export default SwapConfirm
