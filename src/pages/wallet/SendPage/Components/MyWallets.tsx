import { LocalWalletList } from "./LocalWalletList"
import { useAuth } from "auth"
import { ReactComponent as ActiveWalletIcon } from "styles/images/icons/ActiveWallet.svg"

interface MyWalletsProps {
  onClick?: (address: string, index: number, memo?: string) => void
}

const MyWallets = ({ onClick }: MyWalletsProps) => {
  const { wallets, connectedWallet } = useAuth()
  return (
    <>
      {connectedWallet && (
        <LocalWalletList
          onClick={onClick}
          title="Active"
          icon={<ActiveWalletIcon />}
          items={[connectedWallet]}
        />
      )}
      <LocalWalletList
        items={wallets.filter((w) => w.name !== connectedWallet?.name)}
        onClick={onClick}
        title="My Wallets"
      />
    </>
  )
}

export default MyWallets
