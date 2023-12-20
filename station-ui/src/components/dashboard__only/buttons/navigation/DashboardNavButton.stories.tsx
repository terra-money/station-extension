import type { Meta, StoryObj } from '@storybook/react';
import NavButton, { NavButtonProps } from './NavButton';
import { SwapArrowsIcon } from 'assets';

// import

const meta: Meta = {
  title: 'Dashboard/Buttons/Navigation/NavButton',
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
  render: ({ label, icon, displayIcon }: NavButtonStoryObj) =>
    <NavButton
      label={label}
      icon={displayIcon && icon}
    />,
  args: {
    label: 'Swap',
    icon: <SwapArrowsIcon fill={"var(--token-dark-900)"} />,
    displayIcon: true,
  },
  argTypes: {
    displayIcon: {
      control: 'boolean',
      description: '***just for storybook***',
    }
  },
};

export const Default: StoryObj<NavButtonStoryObj> = {
  render: ({ label, icon }: NavButtonStoryObj) =>
    <NavButton
      label={label}
      icon={icon}
      active={false}
    />,
  args: {
    label: 'Swap',
    icon: <SwapArrowsIcon fill={"var(--token-dark-900)"} />,
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
  },
};

export const ActiveState: StoryObj<NavButtonStoryObj> = {
  render: ({ label, icon }: NavButtonStoryObj) =>
    <NavButton
      label={label}
      icon={icon}
      active={true}
    />,
  args: {
    label: 'Swap',
    icon: <SwapArrowsIcon fill={"var(--token-dark-900)"} />,
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
  },
};

export const SmallSVG: StoryObj<NavButtonStoryObj> = {
  render: ({ label, icon }: NavButtonStoryObj) =>
    <NavButton
      label={label}
      icon={icon}
      active={false}
      small={true}
    />,
  args: {
    label: 'Swap',
    icon: <SwapArrowsIcon fill={"var(--token-dark-900)"} />,
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
  },
};

export const IconOnly: StoryObj<NavButtonStoryObj> = {
  render: ({ icon }: NavButtonStoryObj) =>
    <NavButton
      icon={icon}
    />,
  args: {
    icon: <SwapArrowsIcon fill={"var(--token-dark-900)"} />,
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
  },
};

export const WithIndicator: StoryObj<NavButtonStoryObj> = {
  render: ({ icon, label }: NavButtonStoryObj) =>
    <NavButton
      icon={icon}
      label={label}
      withIndicator={true}
    />,
  args: {
    icon: <SwapArrowsIcon fill={"var(--token-dark-900)"} />,
    label: 'Swap',
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
  },
};

export const ActiveWithIndicator: StoryObj<NavButtonStoryObj> = {
  render: ({ icon, label }: NavButtonStoryObj) =>
    <NavButton
      icon={icon}
      label={label}
      withIndicator={true}
      active={true}
    />,
  args: {
    icon: <SwapArrowsIcon fill={"var(--token-dark-900)"} />,
    label: 'Swap',
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
  },
};
