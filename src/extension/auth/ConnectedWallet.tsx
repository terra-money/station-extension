import { useTranslation } from "react-i18next"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { Flex, Grid } from "components/layout"
import { ModalButton } from "components/feedback"
import WalletCard from "../components/WalletCard"
import ManageWallet from "./ManageWallet"
import SwitchWalletButton from "./SwitchWalletButton"
import AddWalletButton from "./AddWalletButton"

const ConnectedWallet = () => {
  const { t } = useTranslation()

  const renderButton = (open: () => void) => (
    <button onClick={open}>
      <MoreVertIcon />
    </button>
  )

  return (
    <Grid gap={16}>
      <WalletCard
        extra={
          <Flex gap={8}>
            <ModalButton title={t("Manage wallet")} renderButton={renderButton}>
              <ManageWallet />
            </ModalButton>
          </Flex>
        }
      />

      <Flex gap={16}>
        <SwitchWalletButton />
        <AddWalletButton />
      </Flex>
    </Grid>
  )
}

export default ConnectedWallet
