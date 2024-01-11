import type { Meta, StoryObj } from "@storybook/react"
import GasHelperCard, { GasHelperCardProps } from "./GasHelperCard"

const meta: Meta<GasHelperCardProps> = {
  title: "Components/Cards/GasHelper/Stories",
  component: GasHelperCard,
  argTypes: {},
} as Meta

export default meta

export const Default: StoryObj<GasHelperCardProps> = {
  render: () => {
    return (
      <GasHelperCard progressColor="yellow">
        <p>Test children</p>
      </GasHelperCard>
    )
  },
  argTypes: {},
}
