import classNames from 'classnames/bind';
import styles from './PageTabs.module.scss';
import { ReactNode } from 'react';

const cx = classNames.bind(styles);

export interface PageTabsProps {
  tabs: (string | ReactNode)[];
  activeTab: number;
  onClick: (index: number) => void;
}

const PageTabs = ({ tabs, activeTab, onClick }: PageTabsProps) => {
  return (
    <div className={styles.page__tabs__container}>
      {tabs.map((tab, index) => (
        <div
          key={index}
          onClick={() => onClick(index)}
          className={cx(styles.tab, { active: index === activeTab })}
        >
          {tab}
        </div>
      ))}
    </div>
  );
};

export default PageTabs;
