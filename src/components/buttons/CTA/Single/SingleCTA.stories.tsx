import { useState, useEffect } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ReactComponent as SmallCircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import SingleCTA, { SingleCTAProps } from './SingleCTA';

const meta: Meta<SingleCTAProps> = {
  title: 'Components/Buttons/CTA/Single',
  component: SingleCTA,
  argTypes: {
    color: {
      options: ['primary', 'secondary'],
      control: {
        type: 'select',
      },
      defaultValue: 'primary',
      description: 'The color of the Button.',
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

type StoryButtonConfig = SingleCTAProps & { label?: string };

const SingleCTAWithLoadingState = (args: StoryButtonConfig) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(args.loading || false);
  }, [args.loading]);

  return (
    <SingleCTA
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
    <SingleCTAWithLoadingState {...args} />,
  args: {
    color: 'primary',
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
    color: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'destructive'],
      },
    },
    loading: { control: 'boolean' },
  },
};

export const Primary: StoryObj<SingleCTAProps> = {
  render: () => (
    <SingleCTA color='primary' label='Primary' />
  ),
  argTypes: {
    color: {
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

export const PrimaryWithIcon: StoryObj<SingleCTAProps> = {
  render: () => (
    <SingleCTA
      color='primary'
      label='Primary'
      icon={<SmallCircleCheck fill='var(--token-light-white)' />}
    />
  ),
  argTypes: {
    color: {
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

export const Secondary: StoryObj<SingleCTAProps> = {
  render: () =>
    <SingleCTA color='secondary' label='Secondary' />,
  argTypes: {
    color: {
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

export const Loading: StoryObj<SingleCTAProps> = {
  render: (args: StoryButtonConfig) =>
    <SingleCTA {...args} loading={true} />,
  args: {
    color: 'primary',
    label: 'Loading',
  },
  argTypes: {
    loading: { control: false },
  },
};
