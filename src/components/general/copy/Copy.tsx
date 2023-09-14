// import ContentCopy from '@mui/icons-material/ContentCopy';
import { useState } from 'react';
import Check from '@mui/icons-material/Check';
import classNames from 'classnames';
// import { ReactComponent as Copy } from 'assets/icon/Copy.svg';
import { ReactComponent as CopyIcon } from 'assets/icon/Copy.svg';

import styles from './Copy.module.scss';

const cx = classNames.bind(styles);

export interface CopyProps {
  copyText: string
  className?: string
  iconOnlySize?: number
  iconOnly?: boolean
  beforeCopyLabel?: string
  afterCopyLabel?: string
  fillColor?: string
}

const Copy = ({
  copyText,
  className,
  iconOnlySize,
  iconOnly = false,
  beforeCopyLabel = 'Copy',
  afterCopyLabel = 'Copied',
  fillColor = 'var(--token-primary-500)'
}: CopyProps) => {
  const [copied, setCopied] = useState(false);
  const iconSize = !iconOnly ? 16 : iconOnlySize ? iconOnlySize : 18;

  return (
    <button
      type='button'
      className={cx(styles.button, className)}
      style={{ color: fillColor }}
      onClick={() => {
        navigator.clipboard.writeText(copyText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? (
        <>
          <Check
            style={{ fontSize: iconSize }}
            height={iconSize}
            width={iconSize}
          />
          {iconOnly ? null : afterCopyLabel}
        </>
      ) : (
        <>
          <CopyIcon
            style={{ fontSize: iconSize }}
            fill={fillColor}
            height={iconSize}
            width={iconSize}
          />
          {iconOnly ? null : beforeCopyLabel}
        </>
      )}
    </button>
  );
};

export default Copy;
