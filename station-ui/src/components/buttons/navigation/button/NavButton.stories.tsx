import type { Meta, StoryObj } from '@storybook/react';
import { ReactComponent as SmallCircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import NavButton, { NavButtonProps } from './NavButton';

const meta: Meta = {
  title: 'Components/Buttons/Navigation/NavButton',
  component: NavButton,
  argTypes: {
    label: {
      control: 'text',
      defaultValue: 'Button',
      description: 'The label of the Button.',
      table: {
        defaultValue: { summary: 'Button' },
        type: { summary: 'string' },
      }
    },
    value: {
      control: 'text',
      defaultValue: 'Value',
      description: 'The sub label of the Button on the right side.',
      table: {
        defaultValue: { summary: 'Value' },
        type: { summary: 'string' },
      }
    },
    icon: {
      control: false,
      description: 'Adds an icon in front of the label.',
      table: {
        type: { summary: 'ReactComponent' },
      }
    }
  },
} as Meta;

export default meta;

interface NavButtonStoryObj extends NavButtonProps {
  displayIcon: boolean
}

export const Playground: StoryObj<NavButtonStoryObj> = {
  render: ({ label, value, icon, displayIcon }: NavButtonStoryObj) =>
    <NavButton
      label={label}
      value={value}
      icon={displayIcon && icon}
    />,
  args: {
    label: 'Nav Button',
    value: 'Value',
    icon: <SmallCircleCheck fill='var(--token-light-white)' />,
    displayIcon: true,
  },
  argTypes: {
    displayIcon: {
      control: 'boolean',
      description: '***just for storybook***',
    }
  },
};

export const LabelOnly: StoryObj<NavButtonStoryObj> = {
  render: ({ label }: { label: string }) =>
    <NavButton
      label={label}
    />,
  args: {
    label: 'Nav Button',
  },
  argTypes: {
    label: {
      control: 'text',
      defaultValue: 'Button',
      description: 'The label of the Button.',
      table: {
        defaultValue: { summary: 'Button' },
        type: { summary: 'string' },
      }
    },
    value: {
      control: false,
    }
  },
};

export const IconAndLabel: StoryObj<NavButtonStoryObj> = {
  render: ({ label }: { label: string }) =>
    <NavButton
      label={label}
      icon={<SmallCircleCheck fill='var(--token-light-white)' />}
    />,
  args: {
    label: 'Nav Button',
  },
  argTypes: {
    label: {
      control: 'text',
      defaultValue: 'Button',
      description: 'The label of the Button.',
      table: {
        defaultValue: { summary: 'Button' },
        type: { summary: 'string' },
      }
    },
    value: {
      control: false,
    }
  },
};

export const IconAndLabelAndSubLabel: StoryObj<NavButtonStoryObj> = {
  render: ({ label, value }: NavButtonStoryObj) =>
    <NavButton
      label={label}
      value={value}
      icon={<SmallCircleCheck fill='var(--token-light-white)' />}
    />,
  args: {
    label: 'Nav Button',
    value: 'Value',
  },
  argTypes: {
    label: {
      control: 'text',
      defaultValue: '',
      description: 'The label of the Button.',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      }
    },
    value: {
      control: 'text',
      defaultValue: '',
      description: 'The sub label of the Button.',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      }
    }
  },
};

export const LabelAndSubLabel: StoryObj<NavButtonStoryObj> = {
  render: ({ label, value }: NavButtonStoryObj) =>
    <NavButton
      label={label}
      value={value}
    />,
  args: {
    label: 'Nav Button',
    value: 'Value',
  },
  argTypes: {
    label: {
      control: 'text',
      defaultValue: '',
      description: 'The label of the Button.',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      }
    },
    value: {
      control: 'text',
      defaultValue: '',
      description: 'The sub label of the Button.',
      table: {
        defaultValue: { summary: '' },
        type: { summary: 'string' },
      }
    }
  },
};