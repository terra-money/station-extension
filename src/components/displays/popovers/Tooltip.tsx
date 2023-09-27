import Tippy, { TippyProps } from "@tippyjs/react";
import "./Tooltip.scss";

const Tooltip = (props: TippyProps) => {
  return (
    <Tippy
      {...props}
      animation={false}
      className={`tooltip__container ${props.className}`}
    />
  );
};

export default Tooltip;
