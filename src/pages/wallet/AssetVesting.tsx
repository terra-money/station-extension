import { SectionHeader } from "station-ui"
import { Path } from "./Wallet"
import { useWalletRoute } from "./Wallet"
import VestingCard from "./VestingCard"

interface Props {
  token: string
  chain?: string
}

const AssetVesting = (props: Props) => {
  const { route, setRoute } = useWalletRoute()

  return (
    <>
      <SectionHeader title="Vesting" withLine />
      <div
        onClick={() =>
          setRoute({
            path: Path.vesting,
            denom: props.token,
            previousPage: route,
          })
        }
      >
        <VestingCard token={props.token} />
      </div>
    </>
  )
}

export default AssetVesting
