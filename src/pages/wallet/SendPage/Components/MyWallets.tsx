import { useAddressBook } from "data/settings/AddressBook"
import { AddressBookList } from "./AddressBookList"
import { LocalWalletList } from "./LocalWalletList"
import { FavoriteIcon } from "@terra-money/station-ui"
import { useAuth } from "auth"
import { ReactComponent as ActiveWalletIcon } from "styles/images/icons/ActiveWallet.svg"

interface MyWalletsProps {
  onClick?: (address: string, index: number, memo?: string) => void
  tab: string
}

const MyWallets = ({ tab, onClick }: MyWalletsProps) => {
  const { list: addressList } = useAddressBook()
  const { wallets, connectedWallet } = useAuth()

  return (
    <>
      {tab === "address" ? (
        <>
          <AddressBookList
            onClick={onClick}
            title="Favorites"
            icon={<FavoriteIcon fill={"var(--token-warning-500)"} />}
            items={addressList.filter((i) => i.favorite)}
          />
          <AddressBookList
            title="All Addresses"
            onClick={onClick}
            items={addressList.filter((i) => !i.favorite)}
          />
        </>
      ) : (
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
            title="Other Wallets"
          />
        </>
      )}
    </>
  )
}

export default MyWallets
