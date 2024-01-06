import Tippy, { TippyProps } from "@tippyjs/react";
import "./Tooltip.scss";
import {  ForwardedRef, forwardRef } from 'react';

const Tooltip = forwardRef(
  (
    props: TippyProps,
    ref?: ForwardedRef<HTMLDivElement>
   ) => {
    return (
      <Tippy
        {...props}
        ref={ref}
        animation={false}
        className={`tooltip__container ${props.className}`}
      />
      );
  }
);

export default Tooltip;