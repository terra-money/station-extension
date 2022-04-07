import useAvailable from "auth/hooks/useAvailable"
import { getOpenURL } from "../storage"
import ExtensionList from "../components/ExtensionList"

const AddWallet = () => {
  const available = useAvailable()

  return (
    <ExtensionList
      list={
        available.map(({ to, ...item }) => {
        const openURL = getOpenURL(to)
        if (!openURL) return { ...item, to }
        return { ...item, onClick: openURL }
      })}
    />
  )
}

export default AddWallet
