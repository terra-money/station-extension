import classNames from 'classnames/bind';
import { ReactComponent as CogIcon } from 'assets/icon/Cog.svg';
import Copy from 'components/general/copy/Copy';
import styles from '../SelectableListItem.module.scss';
import {truncate} from "@terra-money/terra-utils"

const cx = classNames.bind(styles);

export interface WalletSelectableListItemProps {
  label: string
  subLabel: string
  active?: boolean
  truncateSubLabel?: boolean
  onClick?: () => void
  settingsOnClick: () => void
}

const WalletSelectableListItem = ({
  label,
  subLabel,
  active,
  onClick,
  truncateSubLabel,
  settingsOnClick,
}: WalletSelectableListItemProps) => {
  const iconFill = active ? 'var(--token-light-white)' : 'var(--token-light-300)';

  return (
    <div className={cx(styles.selectable__li, { active })} onClick={onClick}>
      <div className={styles.selectable__details__container}>
        <div className={styles.selectable__details}>
          <h2 className={styles.selectable__name}>
            {label}
          </h2>
          <h5 className={styles.selectable__address}>
            {truncateSubLabel? truncate(subLabel) : subLabel}
          </h5>
        </div>
        <div className={styles.selectable__settings}>
          <Copy
            copyText={subLabel}
            iconOnlySize={20}
            fillColor={iconFill}
            iconOnly
          />
          <CogIcon fill={iconFill} onClick={settingsOnClick} />
        </div>
      </div>
    </div>
  );
};

export default WalletSelectableListItem;
