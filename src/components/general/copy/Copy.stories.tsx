import type { Meta, StoryObj } from '@storybook/react';
import Copy, { CopyProps } from './Copy';

const meta: Meta<CopyProps> = {
  title: 'Components/General/Copy',
  component: Copy,
  argTypes: {
    copyText: {
      control: 'text',
      defaultValue: '',
      description: 'The text to copy.',
      table: {
        defaultValue: { summary: '' },
      }
    },
    className: {
      control: 'text',
      description: 'The className for the Copy.',
    },
    iconOnlySize: {
      control: 'number',
      defaultValue: 18,
      description: 'The size of the Copy icon (only when iconOnly is set).',
      table: {
        defaultValue: { summary: 18 },
      }
    },
    iconOnly: {
      control: 'boolean',
      defaultValue: false,
      description: 'Sets the Copy to be icon only.',
      table: {
        defaultValue: { summary: false },
      }
    },
  },
};

export default meta;

type CopyStoryObj = StoryObj<CopyProps>;

export const Playground: CopyStoryObj = {
  render: (args: CopyProps) => <Copy {...args} />,
  args: {
    copyText: 'https://station.terra.money/',
    className: '',
    iconOnlySize: 18,
    iconOnly: false,
  },
};

export const Default: CopyStoryObj = {
  render: (args: CopyProps) => <Copy {...args} />,
  args: {
    copyText: 'https://station.terra.money/',
    className: '',
    iconOnlySize: 15,
  },
  argTypes: {
    copyText: {
      control: 'text',
      description: 'The text to copy.',
    },
    className: {
      control: false
    },
    iconOnlySize: {
      control: false,
      table: {
        defaultValue: { summary: 15 },
      }
    },
    iconOnly: {
      control: false
    },
  },
};

export const IconOnly: CopyStoryObj = {
  render: (args: CopyProps) => <Copy {...args} />,
  args: {
    copyText: 'https://station.terra.money/',
    className: '',
    iconOnlySize: 18,
    iconOnly: true,
  },
  argTypes: {
    copyText: {
      control: 'text',
      description: 'The text to copy.',
    },
    className: {
      control: false
    },
    iconOnlySize: {
      control: false,
      table: {
        defaultValue: { summary: 18 },
      }
    },
    iconOnly: {
      control: false,
      table: {
        defaultValue: { summary: true },
      }
    },
  },
};
