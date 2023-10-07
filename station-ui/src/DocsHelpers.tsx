import { linkTo } from '@storybook/addon-links';

export const RightArrow = ({ style }: { style: object }) => {
  return (
    <svg
      viewBox="0 0 14 14"
      width="10px"
      height="14px"
      style={{
        display: 'inline-block',
        shapeRendering: 'inherit',
        verticalAlign: 'middle',
        fill: 'currentColor',
        stroke: 'currentColor',
        visibility: "unset",
        ...style
      }}
    >
      <path d="m11.1 7.35-5.5 5.5a.5.5 0 0 1-.7-.7L10.04 7 4.9 1.85a.5.5 0 1 1 .7-.7l5.5 5.5c.2.2.2.5 0 .7Z" />
    </svg>
  );
};

interface DocsLinkProps {
  linkToRoute: string
  linkToID: string
  children: React.ReactNode
}

export const DocsLink = ({ linkToRoute, linkToID, children }: DocsLinkProps) => {
  const handleOnClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    linkTo(linkToRoute, 'Docs')();
    setTimeout(() => {
      const element = document.getElementById(linkToID);
      if (element) {
        element.scrollIntoView();
      }
    }, 1000);
  }

  return (
    <a
      style={{ cursor: 'pointer' }}
      onClick={handleOnClick}
    >
      {children}
    </a>
  );
};

export const RequiredText = () => (
  <span
    style={{
      color: "var(--token-error-500)",
      fontWeight: "bold",
      fontSize: "14px"
    }}
  >
    *required*
  </span>
);

export const InLineDocsLink = () => (
  <span style={{ marginLeft: "18px", display: "inline-flex" }}>
    <RightArrow style={{ fill: "black", height: "16px", width: "16px" }} />
  </span>
);
