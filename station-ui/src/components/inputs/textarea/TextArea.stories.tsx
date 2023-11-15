/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import TextArea, { TextAreaProps } from "./TextArea"
import { InputWrapper } from "components/form-helpers"
import Copy from "components/general/copy/Copy"
import { useForm } from 'react-hook-form'
import { Button } from 'components'

const meta: Meta<TextAreaProps> = {
  title: 'Components/Inputs/TextArea/Stories',
  component: TextArea,
  argTypes: {
    readOnly: {
      control: 'boolean',
      defaultValue: false,
      description: 'Sets the TextArea to be read only. Is an attribute of the `<textarea>`.',
      table: {
        defaultValue: { summary: false },
      }
    },
  },
} as Meta;

export default meta;

const ComponentForStorybook = (args: TextAreaProps) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (args.readOnly) {
      setValue("page page page page scout page office repair save page situate lion page decrease will page cry page sausage page page issue law page");
    } else {
      setValue('');
    }
  }, [args.readOnly]);

  return (
    <TextArea
      readOnly={args.readOnly}
      value={value}
      placeholder="We're proposing to spend 100,000 LUNA from the Community Pool to fund the creation of public goods for the Terra ecosystem"
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

export const Playground: StoryObj<TextAreaProps> = {
  render: (args: TextAreaProps) => {
    return (
      <ComponentForStorybook {...args} />
    )
  },
  args: {
    readOnly: false,
  },
};

export const DefaultWithReactHookForm: StoryObj<TextAreaProps> = {
  render: () => {
    const SAMPLE_ENCODED_TX = "CpEBCo4BChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEm4KLHRlcnJhMTk1bHFqcXJqZHE3bWZkenl5Zmw2Y3RuOHZ0a3d0NDNndnl1dGxhEix0ZXJyYTE5NWxxanFyamRxN21mZHp5eWZsNmN0bjh2dGt3dDQzZ3Z5dXRsYRoQCgV1bHVuYRIHMTAwMDAwMBIVEhMKDQoFdWx1bmESBDE4NzIQ0IoK"
    const { handleSubmit, register } = useForm();
    const onSubmit = handleSubmit(data => console.log(data));

    return (
      <form onSubmit={onSubmit}>
        <TextArea
          {...register("tx", { required: true })}
          placeholder={SAMPLE_ENCODED_TX}
          rows={6}
        />
        <Button variant="primary" type="submit">Submit</Button>
      </form>
    )
  },
  argTypes: {
    readOnly: {
      table: {
        disable: true,
      }
    },
  },
};

export const ReadOnly: StoryObj<TextAreaProps> = {
  render: () => (
    <TextArea
      readOnly={true}
      value={"page page page page scout page office repair save page situate lion page decrease will page cry page sausage page page issue law page"}
    />
  ),
  argTypes: {
    readOnly: {
      table: {
        disable: true,
      }
    },
  },
};

export const WithInputWrapperExample: StoryObj<TextAreaProps> = {
  render: () => {
    const value = "page page page page scout page office repair save page situate lion page decrease will page cry page sausage page page issue law page";
    return (
      <InputWrapper
        label="Textbox label"
        extra={
          <Copy
            copyText={value}
          />
        }
      >
        <TextArea
          readOnly={true}
          value={value}
        />
      </InputWrapper>
    );
  },
};

export const ObjectExample: StoryObj<TextAreaProps> = {
  render: () => {
    return (
      <InputWrapper
        label="Textbox label"
      >
        <TextArea
          readOnly={true}
          value={
            '{"@type":"/cosmos.bank.v1beta1.MsgSend","amount":[{"amount":"1000000","denom":"uluna"}],"from_address":"terra195lqjqrjdq7mfdzyyfl6ctn8vtkwt43gvyutla","to_address":"terra195lqjqrjdq7mfdzyyfl6ctn8vtkwt43gvyutla"}'
          }
          rows={10}
        />
      </InputWrapper>
    );
  },
};
