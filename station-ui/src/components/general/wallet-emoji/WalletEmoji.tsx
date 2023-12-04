import styles from "./WalletEmoji.module.scss";

export interface WalletEmojiProps {
  id: string; // wallet name, imgUrl or an emoji
}

const WalletEmoji = ({ id }: WalletEmojiProps) => {
  const emoji = id.match(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g);
  let url;

  try {
    url = new URL(id);
  } catch (e) {
    url = null;
  }

  if (emoji) return (
    <div className={styles.emoji}>
        <span role='img' aria-label='emoji'>
          {id}
        </span>
      </div>
  )

  if (url?.href) return (
    <img src={url.href} className={styles.img} />
  )

  return (
    <span className={styles.big__letter}>
        {id.charAt(0).toUpperCase()}
    </span>
  )

};

export default WalletEmoji;
