
import styles from './Tabs.module.scss';

export interface TabsProps {
  tabs: {
    key: string
    tabLabel: string
    onClick: () => void
  }[]
  activeTabKey: string
}

const Tabs = ({ tabs, activeTabKey }: TabsProps) => {
  return (
    <div className={styles.tabs__container}>
      {tabs.map(
        ({ key, tabLabel, onClick }:
          { key: string, tabLabel: string, onClick: () => void }) => (
          <button
            className={activeTabKey === key ? styles.active : ''}
            type='button'
            key={key}
            onClick={onClick}
          >
            {tabLabel}
          </button>
        )
      )}
    </div>
  )
}

export default Tabs;