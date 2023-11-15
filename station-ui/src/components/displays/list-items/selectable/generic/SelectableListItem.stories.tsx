import type { Meta, StoryObj } from "@storybook/react"
import SelectableListItem, {
  SelectableListItemProps,
} from "./SelectableListItem"
import { ReactComponent as CheckIcon } from "assets/icon/SmallCircleCheck.svg"

const meta: Meta<SelectableListItemProps> = {
  title: "Components/List Items/Selectable/Generic",
  component: SelectableListItem,
  argTypes: {},
} as Meta

export default meta

export const Default: StoryObj<SelectableListItemProps> = {
  render: () => {
    return (
      <SelectableListItem
        label={"Terra"}
        subLabel={"terra1hod3...pazdy5"}
        icon={
          <CheckIcon width={32} height={32} fill="var(--token-success-500)" />
        }
        onClick={() => console.log("clicked!")}
      />
    )
  },
  argTypes: {},
}
