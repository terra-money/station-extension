import styles from "./Tabs.module.scss"

interface Tab {
  key: string
  label: string
  onClick: () => void
}
export interface TabsProps {
  tabs: Tab[]
  activeTabKey: string
}

const Tabs = ({ tabs, activeTabKey }: TabsProps) => {
  return (
    <div className={styles.tabs__container}>
      {tabs.map(({ key, label, onClick }) => (
        <button
          className={activeTabKey === key ? styles.active : ""}
          type="button"
          key={key}
          onClick={onClick}
        >
          {label}
        </button>
        )
      )}
    </div>
  )
}

export default Tabs
