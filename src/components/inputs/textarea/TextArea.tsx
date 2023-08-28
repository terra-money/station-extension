
import { TextareaHTMLAttributes } from 'react';
import styles from './TextArea.module.scss';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = (attrs: TextAreaProps) => {
  const { readOnly } = attrs;

  return (
    <textarea
      {...attrs}
      className={styles.textarea}
      rows={4}
      readOnly={readOnly}
    />
  );
};

export default TextArea;
