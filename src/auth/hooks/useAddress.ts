import useAuth from "./useAuth"

const useAddress = () => {
  const { wallet } = useAuth()
  return wallet?.address
}

export default useAddress
