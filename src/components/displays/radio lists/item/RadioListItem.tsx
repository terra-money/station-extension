/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputHTMLAttributes } from 'react';
import classNames from 'classnames/bind';
import { Flex } from 'components/layout';
import styles from './RadioListItem.module.scss';

const cx = classNames.bind(styles);

export interface RadioListItemProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  checked?: boolean
  onClick: () => void
  isOpen?: boolean
  setOpenAcc?: any
  accContent?: { name: string, icon: string }[]
}

const RadioListItem = ({
  label,
  checked,
  onClick,
  isOpen,
  setOpenAcc,
  accContent,
}: RadioListItemProps) => {
  const handleClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  }

  const openAccordion = (e: any) => {
    e.stopPropagation()
    setOpenAcc(!isOpen)
  }

  return (
    <div className={cx(styles.accordion, { opened: isOpen })}>
      <button
        className={styles.item}
        onClick={accContent ? (e) => openAccordion(e) : (e) => handleClick(e)}
      >
        <div className={styles.text}>{label}</div>
        <div onClick={(e) => handleClick(e)}>
          <Flex className={cx(styles.track, { checked })}>
            <span className={styles.indicator} />
          </Flex>
        </div>
      </button>
      {accContent && (
        <div className={cx(styles.content, { opened: isOpen })}>
          {accContent.map(({ name, icon }: any) => (
            <div className={styles.network} key={name}>
              <img src={icon} alt={name} />
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RadioListItem;
