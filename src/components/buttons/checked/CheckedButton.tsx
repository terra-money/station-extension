import classNames from 'classnames/bind';
import { Button } from 'components/buttons';
import styles from './CheckedButton.module.scss';

const cx = classNames.bind(styles);

export interface CheckedButtonProps {
  active?: boolean
  label: string
  onClick?: () => void
}

const CheckedButton = ({ active, label, onClick }: CheckedButtonProps) => {
  return (
    <Button
      className={cx(styles.checked__button, { active })}
      color='outline'
      label={label}
      onClick={onClick}
    />
  )
}

export default CheckedButton;
