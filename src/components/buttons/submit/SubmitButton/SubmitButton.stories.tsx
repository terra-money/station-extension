import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Decorator } from "DocsHelpers"
import { DEFAULT_PARAMS } from 'Constants';
import { ReactComponent as SmallCircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import SubmitButton, { SubmitButtonProps } from './SubmitButton';

const meta: Meta<SubmitButtonProps> = {
  title: 'Components/Buttons/Submit/SubmitButton',
  component: SubmitButton,
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'warning'],
      control: {
        type: 'select',
      },
      defaultValue: 'primary',
      description: 'The variant of the Button.',
      table: {
        defaultValue: { summary: '"primary"' },
        type: { summary: 'string' },
      }
    },
    label: {
      control: 'text',
      defaultValue: 'Button',
      description: 'The label of the Button.',
      table: {
        defaultValue: { summary: 'Button' },
      }
    },
    loading: {
      control: 'boolean',
      defaultValue: false,
      description: 'Adds a loading indicator to the Button.',
      table: {
        defaultValue: { summary: false },
      }
    },
  },
  parameters: { ...DEFAULT_PARAMS },
  decorators: [Decorator],

} as Meta;

export default meta;

type StoryButtonConfig = SubmitButtonProps & { label?: string };

const SubmitButtonWithLoadingState = (args: StoryButtonConfig) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(args.loading || false);
  }, [args.loading]);

  return (
    <SubmitButton
      {...args}
      loading={loading}
      onClick={() => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
      }}
    />
  );
};

export const Playground: StoryObj<StoryButtonConfig> = {
  render: (args: StoryButtonConfig) =>
    <SubmitButtonWithLoadingState {...args} />,
  args: {
    variant: 'primary',
    loading: false,
    label: 'Playground',
  },
  argTypes: {
    label: {
      control: 'text',
      defaultValue: 'Playground',
      description: 'Labels the Button.',
      table: {
        defaultValue: { summary: 'Playground' },
      },
    },
    variant: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'warning'],
      },
    },
    loading: { control: 'boolean' },
  },
};

export const Primary: StoryObj<SubmitButtonProps> = {
  render: () => (
    <SubmitButton variant='primary' label='Primary' />
  ),
  argTypes: {
    variant: {
      control: false,
      defaultValue: 'primary',
      table: {
        defaultValue: { summary: '"primary"' },
      }
    },
    label: { control: false },
    loading: { control: false },
  },
};

export const PrimaryWithIcon: StoryObj<SubmitButtonProps> = {
  render: () => (
    <SubmitButton
    variant='primary'
      label='Primary'
      icon={<SmallCircleCheck fill='var(--token-light-white)' />}
    />
  ),
  argTypes: {
    variant: {
      control: false,
      defaultValue: 'primary',
      table: {
        defaultValue: { summary: '"primary"' },
      }
    },
    label: { control: false },
    loading: { control: false },
  },
};

export const Secondary: StoryObj<SubmitButtonProps> = {
  render: () =>
    <SubmitButton variant='secondary' label='Secondary' />,
  argTypes: {
    variant: {
      control: false,
      defaultValue: 'secondary',
      table: {
        defaultValue: { summary: '"secondary"' },
      }
    },
    label: { control: false },
    loading: { control: false },
  },
};

export const Loading: StoryObj<SubmitButtonProps> = {
  render: (args: StoryButtonConfig) =>
    <SubmitButton {...args} loading={true} />,
  args: {
    variant: 'primary',
    label: 'Loading',
  },
  argTypes: {
    loading: { control: false },
  },
};
