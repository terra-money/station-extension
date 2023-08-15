import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import RoundedActionButton from './RoundedActionButton';

const meta: Meta = {
  title: 'Components/Buttons/Navigation/Rounded Action',
  component: RoundedActionButton,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      expanded: true,
    },
    backgrounds: {
      disable: true,
    }
  },
  decorators: [
    (Story: StoryFn) => (
      <div className="story__decorator" style={{
        padding: '48px 24px',
        backgroundColor: 'var(--token-dark-200)',
        margin: '-20px -10px',
        borderRadius: '8px',
        fontSize: 'var(--token-font-size-small)'
      }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

export default meta;

export const Default: StoryObj = {
  render: () => <RoundedActionButton />,
};
