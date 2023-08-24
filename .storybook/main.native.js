// .storybook/main.native.js
module.exports = {
  stories: ['../src/components/**/*.stories.native.js'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "storybook-addon-themes",
    "@storybook/addon-a11y",
  ],
};
