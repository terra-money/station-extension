import { Grid } from "components/layout"
import QRCode from "auth/components/QRCode"
import { PageHeader, InputWrapper } from "station-ui"
import { TextArea } from "components/form"

const AddressChain = ({ address }: { address: string }) => {
  return (
    <Grid gap={20}>
      <PageHeader title="recieve" description="" icon="" />
      <QRCode value={address} />
      <InputWrapper extra={"BUTTON"}>
        <TextArea readOnly value={address} />
      </InputWrapper>
    </Grid>
  )
}

export default AddressChain
