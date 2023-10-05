import { Grid } from "components/layout"
import QRCode from "auth/components/QRCode"
import { InputWrapper, Copy, TextArea } from "station-ui"

const AddressChain = ({ address }: { address: string }) => {
  return (
    <Grid gap={10}>
      <QRCode value={address} />
      <InputWrapper label="Address" extra={<Copy copyText={address} />}>
        <TextArea readOnly value={address} />
      </InputWrapper>
    </Grid>
  )
}

export default AddressChain
