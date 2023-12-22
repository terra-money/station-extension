import { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReactComponent as SmallCircleCheck } from 'assets/icon/SmallCircleCheck.svg';
import { ReactComponent as TrashIcon } from 'assets/icon/Trash.svg';
import Button, { ButtonConfig } from './Button';

const meta: Meta<ButtonConfig> = {
  title: 'Components/Buttons/Base/Stories',
  component: Button,
  argTypes: {
    variant: {
      options: ['primary', 'secondary', 'warning', 'dashed', 'white-filled', 'outlined'],
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
    variant: 'primary',
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
    <Button variant='primary' label='Primary' />
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
    block: { control: false },
    loading: { control: false },
  },
};

export const PrimaryWithIcon: StoryObj<ButtonConfig> = {
  render: () => (
    <Button
      variant='primary'
      label='Primary'
      icon={<SmallCircleCheck fill='var(--token-light-white)' />}
    />
  ),
  argTypes: {
    variant: {
      control: false,
      defaultValue: 'primary',
    },
    label: { control: false },
    block: { control: false },
    loading: { control: false },
  },
};

export const Secondary: StoryObj<ButtonConfig> = {
  render: () => <Button variant='secondary' label='Secondary' />,
  argTypes: {
    variant: {
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

export const Warning: StoryObj<ButtonConfig> = {
  render: () =>
    <Button
      variant='warning'
      label='Button'
      icon={<TrashIcon fill='var(--token-error-500)' stroke='var(--token-error-500)' />}
    />,
  argTypes: {
    variant: {
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
      variant='dashed'
      label='Button'
    />,
  argTypes: {
    variant: {
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
      variant='white-filled'
      label='Button'
    />,
  argTypes: {
    variant: {
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

export const Outlined: StoryObj<ButtonConfig> = {
  render: () =>
    <Button
      variant='outlined'
      label='Button'
    />,
  argTypes: {
    variant: {
      control: false,
      defaultValue: 'outlined',
      table: {
        defaultValue: { summary: '"outlined"' },
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
    variant: 'primary',
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
    variant: 'primary',
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
    variant: 'primary',
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

export const Small: StoryObj<ButtonConfig> = {
  render: () => (
    <Button variant='primary' label='Primary' small />
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
    block: { control: false },
    loading: { control: false },
  },
};