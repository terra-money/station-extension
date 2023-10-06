import { Grid } from "components/layout"
import QRCode from "auth/components/QRCode"
import { InputWrapper, Copy, TextArea } from "station-ui"
import styles from "./AddressChain.module.scss"

const AddressChain = ({ address }: { address: string }) => {
  return (
    <div className={styles.container}>
      <Grid gap={10}>
        <QRCode value={address} />
        <InputWrapper label="Address" extra={<Copy copyText={address} />}>
          <TextArea readOnly value={address} />
        </InputWrapper>
      </Grid>
    </div>
  )
}

export default AddressChain
