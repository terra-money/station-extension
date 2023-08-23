import { useState, useEffect } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ReactComponent as SmallCircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import SubmitButton, { SubmitButtonProps } from './SubmitButton';

const meta: Meta<SubmitButtonProps> = {
  title: 'Components/Buttons/Submit/SubmitButton',
  component: SubmitButton,
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'destructive'],
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
        options: ['primary', 'secondary', 'destructive'],
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
