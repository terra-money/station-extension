import { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames/bind';
import { Button } from 'components/buttons';
import styles from '../CTAs.module.scss';

const cx = classNames.bind(styles);

export interface SingleCTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'primary' | 'secondary' | 'destructive'
  label: string
  loading?: boolean
  icon?: ReactNode
  className?: string
}

const SingleCTA = ({color, label, loading, icon, className, ...attrs}: SingleCTAProps) => {
  return (
    <Button
      {...attrs}
      className={cx(styles.single__cta, className)}
      loading={loading}
      type={attrs.type ?? 'submit'}
      color={color}
      label={label}
      icon={icon}
      block
    />
  );
};

export default SingleCTA;