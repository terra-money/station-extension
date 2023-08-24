import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import classNames from 'classnames/bind';
import { Flex } from 'components/layout';
import styles from './Paste.module.scss';

const cx = classNames.bind(styles);

export interface PasteProps {
  onPaste: (lines: string) => void
  textOverride?: string
  withIcon?: boolean
  className?: string
}

const Paste = ({ onPaste, textOverride, withIcon, className }: PasteProps) => {

  const handleClick = async () => {
    const text = await navigator.clipboard.readText();
    const lines = text
      .split('\n')
      .filter((str) => str)
      .map((str) => str.trim());

      onPaste(lines[0]);
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={cx(styles.paste, className)}
    >
      <Flex gap={4}>
        {withIcon && <ContentPasteIcon fontSize='inherit' />}

        <p className={styles.paste__text}>
          {textOverride ? textOverride : 'Paste'}
        </p>
      </Flex>
    </button>
  );
};

export default Paste;
