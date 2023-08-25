import type { Meta, StoryObj } from '@storybook/react';
import { Decorator } from "DocsHelpers"
import { DEFAULT_PARAMS } from 'Constants';
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
    subLabel: {
      control: 'text',
      defaultValue: 'Sub Label',
      description: 'The sub label of the Button on the right side.',
      table: {
        defaultValue: { summary: 'Sub Label' },
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
  parameters: { ...DEFAULT_PARAMS },
  decorators: [Decorator],

} as Meta;

export default meta;

interface NavButtonStoryObj extends NavButtonProps {
  displayIcon: boolean
}

export const Playground: StoryObj<NavButtonStoryObj> = {
  render: ({ label, subLabel, icon, displayIcon }: NavButtonStoryObj) =>
    <NavButton
      label={label}
      subLabel={subLabel}
      icon={displayIcon && icon}
    />,
  args: {
    label: 'Nav Button',
    subLabel: 'Sub Label',
    icon: <SmallCircleCheck />,
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
    subLabel: {
      control: false,
    }
  },
};

export const IconAndLabel: StoryObj<NavButtonStoryObj> = {
  render: ({ label }: { label: string }) =>
    <NavButton
      label={label}
      icon={<SmallCircleCheck />}
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
    subLabel: {
      control: false,
    }
  },
};

export const IconAndLabelAndSubLabel: StoryObj<NavButtonStoryObj> = {
  render: ({ label, subLabel }: NavButtonStoryObj) =>
    <NavButton
      label={label}
      subLabel={subLabel}
      icon={<SmallCircleCheck />}
    />,
  args: {
    label: 'Nav Button',
    subLabel: 'Sub Label',
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
    subLabel: {
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
  render: ({ label, subLabel }: NavButtonStoryObj) =>
    <NavButton
      label={label}
      subLabel={subLabel}
    />,
  args: {
    label: 'Nav Button',
    subLabel: 'Sub Label',
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
    subLabel: {
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