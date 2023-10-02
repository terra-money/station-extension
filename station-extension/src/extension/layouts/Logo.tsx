import { Link } from "react-router-dom"
import { useThemeFavicon } from "data/settings/Theme"
import styles from "./Logo.module.scss"

const Logo = () => {
  const favicon = useThemeFavicon()

  return (
    <Link to="/" className={styles.logo}>
      <img src={favicon} alt="Terra Station" width={20} height={20} />
    </Link>
  )
}

export default Logo
