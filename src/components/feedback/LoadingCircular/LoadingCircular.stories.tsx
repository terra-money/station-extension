import type { Meta, StoryObj } from '@storybook/react';
import LoadingCircular from '.';
import { CircularProgressProps } from '@mui/material/CircularProgress';
import { Decorator } from "DocsHelpers"
import { DEFAULT_PARAMS } from 'Constants';

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
  parameters: { ...DEFAULT_PARAMS },
  decorators: [Decorator],
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
