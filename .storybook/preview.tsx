import type { Preview, StoryObj } from "@storybook/react";
import React from 'react';

import "scss/index.scss";

const preview: Preview = {
  parameters: {
    decorators: [
      (Story) => {
        return React.createElement('div', {
          className: 'story__decorator',
          style: {
            padding: '48px 24px',
            backgroundColor: 'var(--token-dark-200)',
            margin: '-20px -10px',
            borderRadius: '8px',
            fontSize: 'var(--token-font-size-small)'
          },
          children: React.createElement(Story),
        });
      },
    ],
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      hideNoControlsWarning: true,
      expanded: true,
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
    backgrounds: {
      disable: true,
    },
  },
};

export const decorators = [
  (Story: StoryObj) => (
    <div className="story__decorator" style={{
      padding: '48px 24px',
      backgroundColor: 'var(--token-dark-200)',
      margin: '-20px -10px',
      borderRadius: '8px',
      fontSize: 'var(--token-font-size-small)'
    }}>
      {/* @ts-expect-error Server Component */}
      <Story />
    </div>
  ),
];

export default preview;
