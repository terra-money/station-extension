import { useEffect, useState } from "react"
import type { Meta, StoryObj } from "@storybook/react"
import TextArea, { TextAreaProps } from "./TextArea"
import { InputWrapper } from "components/form-helpers"
import Copy from "components/general/copy/Copy"
import styles from "./TextArea.module.scss"

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

export const Default: StoryObj<TextAreaProps> = {
  render: () => (
    <TextArea
      readOnly={false}
      placeholder="We're proposing to spend 100,000 LUNA from the Community Pool to fund the creation of public goods for the Terra ecosystem"
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
          className={styles.textarea__override}
          readOnly={true}
          value={
            `{
              "@type": "/cosmos.distribution.v1beta1.msg",
              "despositor": "terra1desevg71bjsn2n2uibs2b",
              "amount": [
                {
                  "denom": "uluna",
                  "amount": "241545000000"
                }
              ]
            }`
          }
        />
      </InputWrapper>
    );
  },
};
