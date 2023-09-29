import type { Meta, StoryObj } from '@storybook/react';
import ValidatorButton, { ValidatorButtonProps } from './ValidatorButton';

const meta: Meta<ValidatorButtonProps> = {
  title: 'Components/Buttons/Validator/ValidatorButton',
  component: ValidatorButton,
  argTypes: {
    validatorLabel: {
      control: 'text',
      defaultValue: 'Lavender.Five Nodes 🐝',
      description: 'The label of the ValidatorButton.',
      table: {
        defaultValue: { summary: 'Lavender.Five Nodes 🐝' },
        type: { summary: 'string' },
      }
    },
    validatorSubLabel: {
      control: 'text',
      defaultValue: '0.29% voting power • 5% commission',
      description: 'The sub label of the ValidatorButton.',
      table: {
        defaultValue: { summary: '0.29% voting power • 5% commission' },
        type: { summary: 'string' },
      }
    },
    imgSrc: {
      control: false,
      description: 'The image source of the ValidatorButton.',
      table: {
        type: { summary: 'string' },
      }
    }
  },
} as Meta;

export default meta;

export const Default: StoryObj<ValidatorButtonProps> = {
  render: ({ validatorLabel, validatorSubLabel, imgSrc }: ValidatorButtonProps) =>
    <ValidatorButton
      validatorLabel={validatorLabel}
      validatorSubLabel={validatorSubLabel}
      imgSrc={imgSrc}
    />,
  args: {
    validatorLabel: 'Lavender.Five Nodes 🐝',
    validatorSubLabel: '0.29% voting power • 5% commission',
    imgSrc: 'https://raw.githubusercontent.com/terra-money/validator-images/main/images/F87ADDB700C0CC94.jpg'
  },
};
