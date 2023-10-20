import { useState } from "react"
import CreateMultisigWalletForm from "./CreateMultisigWalletForm"
import CreatedWallet from "./CreatedWallet"

const NewMultisigWalletForm = () => {
  /* submit */
  const [wallet, setWallet] = useState<MultisigWallet>()

  if (wallet) return <CreatedWallet {...wallet} />
  /* render */
  return <CreateMultisigWalletForm onCreated={setWallet} />
}

export default NewMultisigWalletForm
