import { ReactNode } from "react"
import { Link, To } from "react-router-dom"
import { ExternalLink } from "../general"
import styles from "./List.module.scss"

interface InternalLinkItem {
  icon: ReactNode
  children: string
  to: To
  disabled?: boolean
}

interface ExternalLinkItem {
  src?: string
  icon?: ReactNode
  children: string
  href: string
  disabled?: boolean
}

interface ButtonItem {
  src?: string
  children: string
  onClick: () => void
  disabled?: boolean
}

type ListProps = (InternalLinkItem | ExternalLinkItem | ButtonItem)[]

const List = ({ list }: { list: ListProps }) => {
  return (
    <section>
      {list.map(({ children, disabled, ...item }) => {
        if (disabled) return null

        return "to" in item ? (
          <Link to={item.to} className={styles.item} key={children}>
            {children}
            {item.icon}
          </Link>
        ) : "href" in item ? (
          <ExternalLink href={item.href} className={styles.item} key={children}>
            {children}
            {item.icon}
            {item.src && <img src={item.src} alt="" width={24} height={24} />}
          </ExternalLink>
        ) : (
          <button
            type="button"
            className={styles.item}
            onClick={item.onClick}
            key={children}
          >
            {children}
            {item.src && <img src={item.src} alt="" width={24} height={24} />}
          </button>
        )
      })}
    </section>
  )
}

export default List

export interface Group {
  title: string
  list: ListProps
}

export const ListGroup = ({ groups }: { groups: Group[] }) => {
  return (
    <>
      {groups.map(({ title, list }) => {
        if (list.every(({ disabled }) => disabled)) return null

        return (
          <article className={styles.group} key={title}>
            <h1 className={styles.title}>{title}</h1>
            <List list={list} />
          </article>
        )
      })}
    </>
  )
}
