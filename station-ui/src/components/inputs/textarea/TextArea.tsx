import { ForwardedRef, TextareaHTMLAttributes, forwardRef } from 'react';
import styles from './TextArea.module.scss';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const TextArea = forwardRef(
  (
    attrs: TextAreaProps,
    ref: ForwardedRef<HTMLTextAreaElement>,
  ) => {
    return (
      <textarea
        {...attrs}
        className={styles.textarea}
        rows={4}
        ref={ref}
      />
    );
  },
);

export default TextArea;
