import type { Meta, StoryObj } from '@storybook/react';
import DelegationCard, { DelegationCardProps } from './DelegationCard';
import { TokenSingleChainListItem } from 'components';

const meta: Meta<DelegationCardProps> = {
  title: 'Components/Cards/Delegation/Stories',
  component: DelegationCard,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<DelegationCardProps> = {
  render: () => {
    return (
      <DelegationCard
        validator={{
          name: 'Orbital Command',
          img: 'https://raw.githubusercontent.com/terra-money/validator-images/main/images/A2879F08F59FB0AF.jpg',
          description: '2.27% voting power • 5% commission',
        }}
        onClick={() => console.log('clicked')}
      >
        <TokenSingleChainListItem
          priceNode={<span>$ 42000</span>}
          tokenImg={"https://station-assets.terra.dev/img/coins/Luna.svg"}
          symbol={"LUNA"}
          price={1}
          amountNode={<span>3,400.00</span>}
          chain={{ icon: "https://station-assets.terra.dev/img/chains/Terra.svg", label: "Terra" }}
        />
      </DelegationCard>
    )
  },
  argTypes: {},
};
