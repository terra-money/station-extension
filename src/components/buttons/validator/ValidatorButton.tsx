import { ReactComponent as RightArrow } from 'assets/icon/RightArrow.svg';
import styles from './ValidatorButton.module.scss'

export interface ValidatorButtonProps {
  validatorLabel: string
  validatorSubLabel: string
  imgSrc: string
}

const ValidatorButton = ({
  validatorLabel,
  validatorSubLabel,
  imgSrc
}: ValidatorButtonProps) => {
  return (
    <button className={styles.validator__button}>
      <div className={styles.left__container}>
        <img
          src={imgSrc}
          width={32}
          height={32}
          alt={validatorLabel}
        />
        <div className={styles.content__container}>
          <div className={styles.label}>{validatorLabel}</div>
          <div className={styles.sub__label}>{validatorSubLabel}</div>
        </div>
      </div>
      <RightArrow fill='var(--token-light-white)' />
    </button>
  )
}

export default ValidatorButton;
