import type { Meta, StoryObj } from '@storybook/react';
import VestingCard, { VestingCardProps } from './VestingCard';
import { TokenSingleChainListItem } from 'components';

const meta: Meta<VestingCardProps> = {
  title: 'Components/Cards/Vesting',
  component: VestingCard,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<VestingCardProps> = {
  render: () => {
    return (
      <VestingCard
        vestedAmount={"420.00"}
      >
        <TokenSingleChainListItem
          priceNode={<span>$ 42000</span>}
          tokenImg={"https://station-assets.terra.dev/img/coins/Luna.svg"}
          symbol={"LUNA"}
          price={1}
          amountNode={<span>3,400.00</span>}
          chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        />
      </VestingCard>
    )
  },
  argTypes: {},
};
