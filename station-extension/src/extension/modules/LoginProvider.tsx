import { PropsWithChildren } from "react"
import Login, { useLogin } from "./Login"

function LoginProvider(props: PropsWithChildren<{}>) {
  const { isLoggedIn, isLoading } = useLogin()

  if (isLoading) return null

  return isLoggedIn ? <>{props.children}</> : <Login />
}

export default LoginProvider
