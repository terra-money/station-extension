import { ReactNode } from "react"
import { Link } from "react-router-dom"
import { Flex, Grid } from "components/layout"
import styles from "./ExtensionList.module.scss"
import classNames from "classnames"
import Copy from "./Copy"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { addressFromWords } from "utils/bech32"

interface DefaultItemProps {
  children: ReactNode
  description?: string | { "330": string }
  icon?: ReactNode
  active?: boolean
  manage?: () => void
}

interface LinkItem extends DefaultItemProps {
  to: string
}

interface ButtonItem extends DefaultItemProps {
  onClick: () => void
}

type Item = LinkItem | ButtonItem

const ExtensionList = ({ list }: { list: Item[] }) => {
  const renderItem = (
    { children, description, icon, active, manage, ...item }: Item,
    index: number
  ) => {
    const address =
      description && typeof description !== "string"
        ? addressFromWords(description["330"])
        : description
    const props = {
      className: active
        ? classNames(styles.item, styles.item__active)
        : styles.item,
      children: (
        <>
          <Flex gap={8}>
            {icon}

            <Grid gap={2}>
              <h1 className={styles.title}>{children}</h1>
              {address && (
                <p className={styles.desc}>
                  terra1...{address.substring(address.length - 18)}
                </p>
              )}
            </Grid>
          </Flex>

          <Flex gap={0}>
            {address && <Copy text={address} />}
            {manage ? (
              <button>
                <MoreVertIcon />
              </button>
            ) : (
              <ChevronRightIcon />
            )}
          </Flex>
        </>
      ),
      key: index,
    }

    return "to" in item ? (
      <Link {...props} to={item.to} />
    ) : (
      <button {...props} onClick={manage ? manage : item.onClick} />
    )
  }

  return <div className={styles.list}>{list.map(renderItem)}</div>
}

export default ExtensionList
