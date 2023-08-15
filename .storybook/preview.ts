import type { Preview } from "@storybook/react";

import "scss/index.scss";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    themes: {
      default: "dark",
      list: [
        { name: "dark", class: "dark", color: "#2F61EA" },
      ],
    },
    docs: {
      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h1, h2',
        ignoreSelector: '#primary',
        title: 'Table of Contents',
        disable: false,
        unsafeTocbotOptions: {
          orderedList: false,
          activeLinkClass: 'toc-active-link',
          linkClass: 'testing'
        },
      }
    },
  },
};

export default preview;
