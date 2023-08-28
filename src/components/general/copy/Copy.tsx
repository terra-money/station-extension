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
}

const Copy = ({
  copyText,
  className,
  iconOnlySize,
  iconOnly = false,
  beforeCopyLabel = 'Copy',
  afterCopyLabel = 'Copied',
}: CopyProps) => {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type='button'
      className={cx(styles.button, className)}
      onClick={() => {
        navigator.clipboard.writeText(copyText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? (
        <>
          <Check style={{ fontSize: !iconOnly ? 16 : iconOnlySize ? iconOnlySize : 18 }} />
          {iconOnly ? null : afterCopyLabel}
        </>
      ) : (
        <>
          <CopyIcon
            style={{ fontSize: !iconOnly ? 16 : iconOnlySize ? iconOnlySize : 18 }}
            fill='var(--token-primary-500)'
          />
          {iconOnly ? null : beforeCopyLabel}
        </>
      )}
    </button>
  );
};

export default Copy;
