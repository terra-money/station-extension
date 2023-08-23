import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from 'components/buttons';
import styles from '../CTAs.module.scss';

export interface SingleCTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'destructive'
  label: string
  loading?: boolean
  icon?: ReactNode
}

const SingleCTA = ({variant, label, loading, icon, ...attrs}: SingleCTAProps) => {
  return (
    <Button
      {...attrs}
      className={styles.single__cta}
      loading={loading}
      type={attrs.type ?? 'submit'}
      variant={variant}
      label={label}
      icon={icon}
      block
    />
  );
};

export default SingleCTA;