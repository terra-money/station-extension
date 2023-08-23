import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from 'components/buttons';
import styles from './SubmitButton.module.scss';

export interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'destructive'
  label: string
  loading?: boolean
  icon?: ReactNode
}

const SubmitButton = ({variant, label, loading, icon, ...attrs}: SubmitButtonProps) => {
  return (
    <Button
      {...attrs}
      className={styles.button}
      loading={loading}
      type={attrs.type ?? 'submit'}
      variant={variant}
      label={label}
      icon={icon}
      block
    />
  );
};

export default SubmitButton;
