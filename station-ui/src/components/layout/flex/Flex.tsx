import { CSSProperties, PropsWithChildren } from 'react';
import classNames from 'classnames/bind';
import styles from './Flex.module.scss';

const cx = classNames.bind(styles);

export interface FlexProps {
  gap?: number
  className?: string
  wrap?: boolean
  style?: CSSProperties
  start?: boolean
  justify?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  align?: 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'stretch'
}

export const InlineFlex = (props: PropsWithChildren<FlexProps>) => {
  const { gap, wrap, className, children, style, justify, align, start } = props;
  return (
    <span
      className={cx(styles.inline, { wrap, start }, className)}
      style={{ ...style, gap, justifyContent: justify, alignItems: align }}
    >
      {children}
    </span>
  );
};

export const FlexColumn = (props: PropsWithChildren<FlexProps>) => {
  const { gap, wrap, className, children, style, justify, align, start } = props;
  return (
    <div
      className={cx(styles.column, { start, wrap }, className)}
      style={{ ...style, gap, justifyContent: justify, alignItems: align }}
    >
      {children}
    </div>
  );
};

const Flex = (props: PropsWithChildren<FlexProps>) => {
  const { gap, wrap, className, children, style, justify, align, start } = props;
  return (
    <div
      className={cx(styles.flex, { wrap, start }, className)}
      style={{ ...style, gap, justifyContent: justify, alignItems: align }}
    >
      {children}
    </div>
  );
};

export default Flex;
