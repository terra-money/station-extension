import { FlexColumn } from 'components';
import { ReactComponent as CircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import { ReactComponent as AlertIcon } from 'assets/icon/Alert.svg';
import styles from './RichHeader.module.scss';

export interface RichHeaderProps {
  image: string;
  status?: 'alert' | 'check';
  title: string;
  link: string;
  description?: string;
}

const RichHeader = ({
  image,
  status,
  title,
  link,
  description,
}: RichHeaderProps) => {
  return (
    <FlexColumn className={styles.rich__header__container} gap={16}>
      <div className={styles.image__container}>
        <img src={image} alt="Rich Header Image" />
        {status && (
          <div className={styles.status__container}>
            {status === 'alert' ? (
              <AlertIcon className={styles.icon} fill='var(--token-error-500)' />
            ) : (
              <CircleCheck className={styles.icon} fill='var(--token-success-500)' />
            )}
          </div>
        )}
      </div>
      <FlexColumn className={styles.title__container} gap={8}>
        <h1 className={styles.title}>{title}</h1>
        <a
          className={styles.link}
          href={link}
          target="_blank"
          rel="noreferrer"
        >
          {link}
        </a>
      </FlexColumn>
      <h6 className={styles.description}>{description}</h6>
    </FlexColumn>
  );
};

export default RichHeader;
