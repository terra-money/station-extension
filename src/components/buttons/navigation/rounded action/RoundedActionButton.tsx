import { useState } from 'react';
import { RoundedButton } from 'components/buttons'
import { ReactComponent as SwapArrows } from 'assets/icon/SwapArrows.svg'
import { ReactComponent as Close } from 'assets/icon/Close.svg'
import styles from './RoundedActionButton.module.scss'

const RoundedActionButton = () => {
  const [isOpen1, setIsOpen1] = useState(false)
  const [isAnimating1, setIsAnimating1] = useState(false)

  const displayIcon = isOpen1
    ? <Close
        stroke='var(--token-light-white)'
        className={`${styles.close} ${isAnimating1 ? styles.animateOut : styles.animateIn}`}
      />
    : <SwapArrows
        fill='var(--token-light-white)'
        className={`${styles.swap__arrow} ${isAnimating1 ? styles.animateOut : styles.animateIn}`}
      />

  const handleClick = () => {
    setIsAnimating1(true)
    setTimeout(() => {
      setIsOpen1(!isOpen1)
      setIsAnimating1(false)
    }, 750)
  }

  const [isOpen2, setIsOpen2] = useState(false)
  const [isAnimating2, setIsAnimating2] = useState(false)

  const displayIcon2 = isOpen2
    ? <Close
        stroke='var(--token-light-white)'
        className={`${styles.close} ${isAnimating2 ? styles.animateOut2 : styles.animateIn2}`}
      />
    : <SwapArrows
        fill='var(--token-light-white)'
        className={`${styles.swap__arrow} ${isAnimating2 ? styles.animateOut2 : styles.animateIn2}`}
      />

  const handleClick2 = () => {
    setIsAnimating2(true)
    setTimeout(() => {
      setIsOpen2(!isOpen2)
      setIsAnimating2(false)
    }, 400)
  }

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <RoundedButton
        variant='primary'
        size='large'
        icon={displayIcon}
        onClick={handleClick}
      />
        <RoundedButton
        variant='primary'
        size='large'
        icon={displayIcon2}
        onClick={handleClick2}
      />
    </div>
  );
};

export default RoundedActionButton;
