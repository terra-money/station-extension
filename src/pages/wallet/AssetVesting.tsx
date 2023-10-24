import { ModalButton } from "station-ui"
import VestingCard from "./VestingCard"
import VestingDetailsPage from "./VestingDetailsPage"
import { ParsedVestingSchedule } from "data/queries/vesting"

interface Props {
  schedule: ParsedVestingSchedule
}

const AssetVesting = ({ schedule }: Props) => {
  return (
    <ModalButton
      renderButton={(open) => (
        <button onClick={open}>
          <VestingCard schedule={schedule} />
        </button>
      )}
    >
      <VestingDetailsPage schedule={schedule} />
    </ModalButton>
  )
}

export default AssetVesting
