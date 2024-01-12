import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import classNames from "classnames/bind"
import CloseIcon from "@mui/icons-material/Close"
import { mobileIsMenuOpenState } from "components/layout"
import { useNav } from "../routes"
import styles from "./Nav.module.scss"
import {
  CornerBackgroundLogo,
  StationIcon,
  NavButton,
  Grid,
} from "@terra-money/station-ui"

const cx = classNames.bind(styles)

const Nav = () => {
  const { menu } = useNav()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useRecoilState(mobileIsMenuOpenState)
  const close = () => setIsOpen(false)

  return (
    <nav>
      <header className={styles.header}>
        <CornerBackgroundLogo />
        <div className={cx(styles.item, styles.logo)}>
          <StationIcon />
          <strong className={styles.title}>Station</strong>
        </div>
        {isOpen && (
          <button className={styles.toggle} onClick={close}>
            <CloseIcon />
          </button>
        )}
      </header>
      <Grid gap={24}>
        {menu.map(({ path, title, icon }) => (
          <NavButton
            label={title}
            icon={icon}
            onClick={() => navigate(path)}
            key={path}
          />
        ))}
      </Grid>
    </nav>
  )
}

export default Nav
