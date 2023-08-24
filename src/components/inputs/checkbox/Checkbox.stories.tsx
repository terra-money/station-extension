import { useEffect, useState } from 'react';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import Checkbox, { CheckboxProps } from './Checkbox';

const meta: Meta<CheckboxProps> = {
  title: 'Components/Inputs/Checkbox/Stories',
  component: Checkbox,
  argTypes: {
    checked: {
      control: 'boolean',
      defaultValue: false,
      description: 'Determines the state of the checkbox.',
      table: {
        defaultValue: { summary: 'false' },
      }
    },
    disabled: {
      control: 'boolean',
      defaultValue: false,
      description: 'Disables the checkbox if set to true.',
      table: {
        defaultValue: { summary: 'false' },
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

const Checkbox_StorybookComponent = (args: CheckboxProps) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(args.checked || false);
  }, [args.checked]);

  return (
    <Checkbox
      {...args}
      checked={checked}
      onClick={() => {
        setChecked(!checked);
      }}
      label={args.label}
    >
    </Checkbox>
  )
}

export const Playground: StoryObj<CheckboxProps> = {
  render: (args: CheckboxProps) => (
    <Checkbox_StorybookComponent {...args} />
  ),
  args: {
    checked: false,
    disabled: false,
    label: 'Checkbox',
  },
  argTypes: {
    checked: { control: 'boolean', table: { disable: false } },
    disabled: { control: 'boolean', table: { disable: false } },
  }
};

export const UncheckedCheckbox: StoryObj<CheckboxProps> = {
  render: (args: CheckboxProps) => (
    <Checkbox
      checked={args.checked}
      disabled={args.disabled}
      label='Checkbox'
    />
  ),
  args: {
    checked: false,
    disabled: false,
  },
  argTypes: {
    checked: { control: false },
    disabled: { control: false },
  }
};

export const CheckedCheckbox: StoryObj<CheckboxProps> = {
  render: (args: CheckboxProps) => (
    <Checkbox
      checked={args.checked}
      disabled={args.disabled}
      label='Checkbox'
    />
  ),
  args: {
    checked: true,
    disabled: false,
  },
  argTypes: {
    checked: { control: false },
    disabled: { control: false },
  }
};

export const DisabledCheckbox: StoryObj<CheckboxProps> = {
  render: (args: CheckboxProps) => (
    <Checkbox
      checked={args.checked}
      disabled={args.disabled}
      label='Checkbox'
    />
  ),
  args: {
    checked: false,
    disabled: true,
  },
  argTypes: {
    checked: { control: false },
    disabled: { control: false },
  }
};
