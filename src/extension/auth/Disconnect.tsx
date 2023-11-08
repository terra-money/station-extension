import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "auth"
import { clearStoredPassword } from "auth/scripts/keystore"

const Disconnect = () => {
  const navigate = useNavigate()
  const { disconnect } = useAuth()

  useEffect(() => {
    disconnect()
    clearStoredPassword()
    navigate("/", { replace: true })
  }, [disconnect, navigate])

  return null
}

export default Disconnect
