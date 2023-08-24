import classNames from 'classnames/bind';
import { Button } from 'components/buttons';
import styles from './CheckedButton.module.scss';
import { ButtonHTMLAttributes } from 'react';

const cx = classNames.bind(styles);

export interface CheckedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  label?: string
  onClick?: () => void
}

const CheckedButton = ({ active, label, children, onClick }: CheckedButtonProps) => {
  return (
    <Button
      className={cx(styles.checked__button, { active })}
      variant='outlined'
      label={label}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export default CheckedButton;
