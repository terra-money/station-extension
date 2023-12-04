import { Grid } from "components/layout"
import QRCode from "auth/components/QRCode"
import { InputWrapper, Copy, TextArea } from "@terra-money/station-ui"
import styles from "./AddressChain.module.scss"
import { useParams } from "react-router-dom"

const AddressChain = () => {
  const { address } = useParams()
  if (!address) return null
  return (
    <div className={styles.container}>
      <Grid gap={30}>
        <QRCode value={address} />
        <InputWrapper label="Address" extra={<Copy copyText={address} />}>
          <TextArea readOnly value={address} />
        </InputWrapper>
      </Grid>
    </div>
  )
}

export default AddressChain
