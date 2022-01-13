import { ReactNode } from "react"
import { Link } from "react-router-dom"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { Flex, Grid } from "components/layout"
import styles from "./ExtensionList.module.scss"

interface DefaultItemProps {
  children: ReactNode
  description?: string
  icon?: ReactNode
  active?: boolean
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
    { children, description, icon, ...item }: Item,
    index: number
  ) => {
    const props = {
      className: styles.item,
      children: (
        <>
          <Flex gap={8}>
            {icon}

            <Grid gap={2}>
              <h1 className={styles.title}>{children}</h1>
              {description && <p className={styles.desc}>{description}</p>}
            </Grid>
          </Flex>

          <ChevronRightIcon fontSize="small" />
        </>
      ),
      key: index,
    }

    return "to" in item ? (
      <Link {...props} to={item.to} />
    ) : (
      <button {...props} onClick={item.onClick} />
    )
  }

  return <div className={styles.list}>{list.map(renderItem)}</div>
}

export default ExtensionList
