import { PropsWithChildren } from "react"
import Login, { useLogin } from "./Login"

function LoginProvider(props: PropsWithChildren<{}>) {
  const { isLoggedIn } = useLogin()

  return isLoggedIn ? <>{props.children}</> : <Login />
}

export default LoginProvider
