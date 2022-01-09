import { FC } from "react"
import styles from "./Header.module.scss"

const Header: FC = ({ children }) => {
  return <header className={styles.header}>{children}</header>
}

export default Header
