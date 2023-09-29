import { ReactNode } from 'react';
import styles from './PageHeader.module.scss';

export interface PageHeaderProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const PageHeader = ({ title, description, icon }: PageHeaderProps) => {
  return (
    <div className={styles.page__header__container}>
      <div className={styles.title__container}>
        <div className={styles.icon__container}>{icon}</div>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default PageHeader;
