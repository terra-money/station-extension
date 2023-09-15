import { ReactNode } from 'react';
import classNames from 'classnames/bind';
import styles from './SectionHeader.module.scss';

const cx = classNames.bind(styles);

export interface SectionHeaderProps {
  title?: string;
  extra?: ReactNode;
  withFilter?: boolean;
  withLine?: boolean;
  indented?: boolean;
  icon?: ReactNode;
  className?: string;
}

const SectionHeader = ({
  title,
  extra,
  withLine,
  indented,
  icon,
  className
}: SectionHeaderProps) => {
  return (
    <div className={cx(styles.section__header, className)}>
      <div className={cx(styles.header, { indented, has__line: withLine })}>
        <div className={cx(styles.title__wrapper, { has__line: withLine })}>
          {icon && <div className={styles.icon}>{icon}</div>}

          {withLine && <div className={styles.line} />}

          {title?.length && (
            <h3 className={cx(styles.title, { indented })}>
              {title}
            </h3>
          )}
          {withLine && title?.length && <div className={styles.line} />}
        </div>
        {extra}
      </div>
    </div>
  );
};

export default SectionHeader;
