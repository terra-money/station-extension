import { HTMLAttributes } from 'react';
import styles from './Form.module.scss';

const Form = (attrs: HTMLAttributes<HTMLFormElement>) => {
  return <form {...attrs} className={`${styles.form} ${attrs.className}`} />;
};

export default Form;