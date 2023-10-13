import { SectionHeader, ModalButton } from "station-ui"
import VestingCard from "./VestingCard"
import VestingDetailsPage from "./VestingDetailsPage"

interface Props {
  token: string
  chain?: string
}

const AssetVesting = (props: Props) => {
  return (
    <>
      <SectionHeader title="Vesting" withLine />
      <ModalButton
        renderButton={(open) => (
          <div onClick={open}>
            <VestingCard {...props} />
          </div>
        )}
      >
        <VestingDetailsPage {...props} />
      </ModalButton>
    </>
  )
}

export default AssetVesting
