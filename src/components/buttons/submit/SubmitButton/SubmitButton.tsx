import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from 'components/buttons';
import styles from './SubmitButton.module.scss';

export interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'warning'
  label?: string
  loading?: boolean
  icon?: ReactNode
}

const SubmitButton = ({variant, label, loading, icon, children, ...attrs}: SubmitButtonProps) => {
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
    >
      {children}
    </Button>
  );
};

export default SubmitButton;
