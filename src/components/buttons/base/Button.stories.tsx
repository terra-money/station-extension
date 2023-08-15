import { useState, useEffect } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { ReactComponent as SmallCircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import { ReactComponent as TrashCan } from 'assets/icon/TrashCan.svg';
import Button, { ButtonConfig } from './Button';

const meta: Meta<ButtonConfig> = {
  title: 'Components/Buttons/Base/Stories',
  component: Button,
  argTypes: {
    color: {
      options: ['primary', 'secondary', 'destructive', 'dashed', 'white-filled', 'outline'],
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
    block: {
      control: 'boolean',
      defaultValue: false,
      description: 'Makes the Button full width.',
      table: {
        defaultValue: { summary: false },
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
    icon: {
      control: false,
      description: 'Adds an icon to the Button.',
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

type StoryButtonConfig = ButtonConfig & { label?: string };

const ButtonWithLoadingState = (args: StoryButtonConfig) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(args.loading || false);
  }, [args.loading]);

  return (
    <Button
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
  render: (args: StoryButtonConfig) => <ButtonWithLoadingState {...args} />,
  args: {
    color: 'primary',
    block: false,
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
    block: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

export const Primary: StoryObj<ButtonConfig> = {
  render: () => (
    <Button color='primary' label='Primary' />
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
    block: { control: false },
    loading: { control: false },
  },
};

export const PrimaryWithIcon: StoryObj<ButtonConfig> = {
  render: () => (
    <Button
      color='primary'
      label='Primary'
      icon={<SmallCircleCheck fill='var(--token-light-white)' />}
    />
  ),
  argTypes: {
    color: {
      control: false,
      defaultValue: 'primary',
    },
    label: { control: false },
    block: { control: false },
    loading: { control: false },
  },
};

export const Secondary: StoryObj<ButtonConfig> = {
  render: () => <Button color='secondary' label='Secondary' />,
  argTypes: {
    color: {
      control: false,
      defaultValue: 'secondary',
      table: {
        defaultValue: { summary: '"secondary"' },
      }
    },
    label: { control: false },
    block: { control: false },
    loading: { control: false },
  },
};

export const Destructive: StoryObj<ButtonConfig> = {
  render: () =>
    <Button
      color='destructive'
      label='Button'
      icon={<TrashCan fill='var(--token-error-500)' stroke='var(--token-error-500)' />}
    />,
  argTypes: {
    color: {
      control: false,
      defaultValue: 'secondary',
      table: {
        defaultValue: { summary: '"secondary"' },
      }
    },
    label: { control: false },
    block: { control: false },
    loading: { control: false },
  },
};

export const Dashed: StoryObj<ButtonConfig> = {
  render: () =>
    <Button
      color='dashed'
      label='Button'
    />,
  argTypes: {
    color: {
      control: false,
      defaultValue: 'dashed',
      table: {
        defaultValue: { summary: '"dashed"' },
      }
    },
    label: { control: false },
    block: { control: false },
    loading: { control: false },
  },
};

export const WhiteFilled: StoryObj<ButtonConfig> = {
  render: () =>
    <Button
      color='white-filled'
      label='Button'
    />,
  argTypes: {
    color: {
      control: false,
      defaultValue: 'white-filled',
      table: {
        defaultValue: { summary: '"white-filled"' },
      }
    },
    label: { control: false },
    block: { control: false },
    loading: { control: false },
  },
};

export const Outline: StoryObj<ButtonConfig> = {
  render: () =>
    <Button
      color='outline'
      label='Button'
    />,
  argTypes: {
    color: {
      control: false,
      defaultValue: 'outline',
      table: {
        defaultValue: { summary: '"outline"' },
      }
    },
    label: { control: false },
    block: { control: false },
    loading: { control: false },
  },
};

export const Block: StoryObj<ButtonConfig> = {
  render: (args: StoryButtonConfig) => <Button {...args} block />,
  args: {
    color: 'primary',
    label: 'Block',
  },
  argTypes: {
    block: { control: false },
    label: { control: false },
    loading: { control: false },
  },
};

export const Loading: StoryObj<ButtonConfig> = {
  render: (args: StoryButtonConfig) => <Button {...args} loading={true} />,
  args: {
    color: 'primary',
    label: 'Loading',
  },
  argTypes: {
    block: { control: false },
    loading: { control: false },
  },
};

export const Disabled: StoryObj<ButtonConfig> = {
  render: (args: StoryButtonConfig) => <Button {...args} disabled />,
  args: {
    color: 'primary',
    label: 'Disabled',
    block: false,
    loading: false,
  },
  argTypes: {
    label: { control: false },
    block: { control: false },
    loading: { control: false },
  },
};
