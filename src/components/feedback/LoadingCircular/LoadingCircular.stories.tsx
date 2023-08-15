import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import LoadingCircular from '.';
import { CircularProgressProps } from '@mui/material/CircularProgress';

const meta: Meta = {
  title: 'Components/Feedback/Loading Circular',
  component: LoadingCircular,
  argTypes: {
    color: {
      control: 'false',
      defaultValue: 'inherit',
      description: 'Sets the color of the LoadingCircular.',
      table: {
        defaultValue: { summary: 'inherit' },
      }
    },
    size: {
      control: 'number',
      defaultValue: 40,
      description: 'Sets the size of the LoadingCircular.',
      table: {
        defaultValue: { summary: 40 },
      }
    },
    thickness: {
      control: 'number',
      defaultValue: 3.6,
      description: 'Sets the thickness of the LoadingCircular.',
      table: {
        defaultValue: { summary: 3.6 },
      }
    },
  },
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
      <div style={{
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
};

export default meta;

export const Playground: StoryObj<CircularProgressProps> = {
  render: (args: CircularProgressProps) => (
    <LoadingCircular
      size={args.size}
      thickness={args.thickness}
    />
  ),
  args: {
    size: 40,
    thickness: 3.6,
  },
};

export const Default: StoryObj<CircularProgressProps> = {
  render: (args: CircularProgressProps) =>
    <LoadingCircular {...args} />,
  argTypes: {
    color: {
      control: false,
    },
    size: {
      control: false,
    },
    thickness: {
      control: false,
    },
  },
};
