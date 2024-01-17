/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import Growl, { GrowlProps } from './Growl';
import GrownContainer from './GrowlContainer';
import { useEffect, useState } from 'react';

const meta: Meta = {
  title: 'Dashboard/Growl/Stories',
  component: Growl,
  argTypes: {
    variant: {
      options: ["loading", "success", "warning", "error"],
      control: {
        type: 'select',
      },
      defaultValue: 'loading',
      description: 'The variant of the Growl.',
      table: {
        defaultValue: { summary: "loading" },
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
} as Meta;

export default meta;

export const Playground: StoryObj<GrowlProps> = {
  render: ({ variant, title, message }: GrowlProps) =>
    <Growl
      variant={variant}
      title={title}
      message={message}
      date={new Date()}
      txHash='BD54A5...66DE28'
      onClose={() => {}}
    />,
  args: {
    variant: "loading",
    title: "Broadcasting",
    message: "Broadcasting your transaction to the network"
  },
  argTypes: {},
};

export const ExampleOnClose: StoryObj<GrowlProps> = {
  render: () => {
    const startingGrowls = [
      {
        variant: "success",
        title: "Success",
        message: "Your transaction was successful",
        date: new Date(),
        txHash: "BD54A5...66DE28",
        onClose: () => handleClose(0),
      },
      {
        variant: "error",
        title: "Simulation Failed",
        message: "execute wasm contract failed [CosmWasm/wasmd@v0.30.0/x/wasm/keeper/keeper.go:429] With gas wanted: '50000000' and gas used: '1298647'",
        date: new Date(),
        txHash: "BD54A5...66DE28",
        onClose: () => handleClose(1),
      },
      {
        variant: "loading",
        title: "Broadcasting",
        message: "Broadcasting your transaction to the network",
        date: new Date(),
        txHash: "BD54A5...66DE28",
        onClose: () => handleClose(2),
      }
    ] as GrowlProps[]

    const [growls, setGrowls] = useState<GrowlProps[]>(startingGrowls)

    const handleClose = (index: number) => {
      const newGrowlList = growls.filter((_, i) => i !== index)
      setGrowls([
        ...newGrowlList
      ])
    }

    return (
      <GrownContainer
        growls={growls}
      />
    )
  },
};

export const ExampleSetTimeoutHACK: StoryObj<GrowlProps> = {
  render: () => {
    const startingGrowls = [
      {
        variant: "loading",
        title: "Broadcasting",
        message: "Broadcasting your transaction to the network",
        date: new Date(),
        txHash: "BD54A5...66DE28",
        onClose: () => console.log("doesn't do anything because setTimeout breaks state stuff"),
      },
      {
        variant: "loading",
        title: "Broadcasting",
        message: "Broadcasting your transaction to the network",
        date: new Date(),
        txHash: "BD54A5...66DE28",
        onClose: () => console.log("doesn't do anything because setTimeout breaks state stuff"),
      },
      {
        variant: "loading",
        title: "Broadcasting",
        message: "Broadcasting your transaction to the network",
        date: new Date(),
        txHash: "BD54A5...66DE28",
        onClose: () => console.log("doesn't do anything because setTimeout breaks state stuff"),
      }
    ] as GrowlProps[]

    const [growls, setGrowls] = useState<GrowlProps[]>(startingGrowls)

    const secondTimeout = (newGrowlList: GrowlProps[]) => {
      setTimeout(() => {
        const newNewGrowlList = newGrowlList.map((growl, index) => {
          if (index === 1) {
            return {
              ...growl,
              variant: "error",
              title: "Simulation Failed",
              message: "execute wasm contract failed [CosmWasm/wasmd@v0.30.0/x/wasm/keeper/keeper.go:429] With gas wanted: '50000000' and gas used: '1298647'",
            }
          }
          return {
            ...growl,
          }
        }) as GrowlProps[]
        setGrowls([
          ...newNewGrowlList
        ])
      }, 7000)
    }

    useEffect(() => {
      setTimeout(() => {
        const newGrowlList = growls.map((growl, index) => {
          if (index === 0) {
            return {
              ...growl,
              variant: "success",
              title: "Success",
              message: "Your transaction was successful",
            }
          }
          return {
            ...growl,
          }
        }) as GrowlProps[]
        setGrowls([
          ...newGrowlList
        ])
        secondTimeout(newGrowlList)
      }, 5000)
    }, [])

    return (
      <GrownContainer
        growls={growls}
      />
    )
  },
};

export const Loading: StoryObj<GrowlProps> = {
  render: ({ variant, title, message }: GrowlProps) =>
    <Growl
      variant={variant}
      title={title}
      message={message}
      date={new Date()}
      txHash='BD54A5...66DE28'
      onClose={() => {}}
    />,
  args: {
    variant: "loading",
    title: "Broadcasting",
    message: "Broadcasting your transaction to the network"
  },
  argTypes: {
    title: {
      control: 'text',
      defaultValue: 'Broadcasting',
      description: 'The title.',
      table: {
        defaultValue: { summary: 'Broadcasting' },
        type: { summary: 'string' },
      }
    },
  },
};

export const Successful: StoryObj<GrowlProps> = {
  render: () =>
    <Growl
      variant={"success"}
      title={"Success"}
      message={"Your transaction was successful"}
      date={new Date()}
      txHash='BD54A5...66DE28'
      onClose={() => {}}
    />,
};

export const Warning: StoryObj<GrowlProps> = {
  render: () =>
    <Growl
      variant={"warning"}
      title={"Tx Failed"}
      message={"execute wasm contract failed [CosmWasm/wasmd@v0.30.0/x/wasm/keeper/keeper.go:429] With gas wanted: '50000000' and gas used: '1298647'"}
      date={new Date()}
      txHash='BD54A5...66DE28'
      onClose={() => {}}
    />,
};

export const Error: StoryObj<GrowlProps> = {
  render: () =>
    <Growl
      variant={"error"}
      title={"Simulation Failed"}
      message={"execute wasm contract failed [CosmWasm/wasmd@v0.30.0/x/wasm/keeper/keeper.go:429] With gas wanted: '50000000' and gas used: '1298647'"}
      date={new Date()}
      txHash='BD54A5...66DE28'
      onClose={() => {}}
    />,
};
