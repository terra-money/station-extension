
import styles from './Tabs.module.scss';

export interface TabsProps {
  tabs: {
    key: string
    label: string
    onClick: () => void
  }[]
  activeTabKey: string
}

const Tabs = ({ tabs, activeTabKey }: TabsProps) => {
  return (
    <div className={styles.tabs__container}>
      {tabs.map(
        ({ key, label, onClick }:
          { key: string, label: string, onClick: () => void }) => (
          <button
            className={activeTabKey === key ? styles.active : ''}
            type='button'
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

export default Tabs;