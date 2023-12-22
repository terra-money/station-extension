import type { Meta, StoryObj } from '@storybook/react';
import MobilePageHeader, { MobilePageHeaderProps } from './MobilePageHeader';
import { ActivityIcon, DashboardIcon, GovernanceIcon, SearchIcon, SettingsIcon, StakeIcon, SwapArrowsIcon } from 'assets';
import { Button, ButtonInlineWrapper, Flex, Input } from 'components';

const meta: Meta = {
  title: 'Dashboard/Headers/Mobile/PageHeader/Stories',
  component: MobilePageHeader,
} as Meta;

export default meta;

export const Portfolio: StoryObj<MobilePageHeaderProps> = {
  render: () =>
    <MobilePageHeader
      pageIcon={<DashboardIcon fill="var(--token-dark-900)" />}
      title="Portfolio"
      subtitle="Overview of your wallet"
      secondaryNode={
        <Input
          actionIcon={{
            icon: <SearchIcon fill='var(--token-dark-900)' />,
            onClick: () => console.log('search clicked')
          }}
          placeholder="Search tokens, chains, contracts, etc"
          small
          widthOverride={342}
        />
      }
    />,
};

// export const Portfolio: StoryObj<PageHeaderProps> = {
//   render: () =>
//     <PageHeader
//       pageIcon={<DashboardIcon fill="var(--token-dark-900)" />}
//       title="Portfolio"
//       subtitle="Overview of your wallet"
//       secondaryNode={
//         <Input
//           actionIcon={{
//             icon: <SearchIcon fill='var(--token-dark-900)' />,
//             onClick: () => console.log('search clicked')
//           }}
//           placeholder="Search tokens, chains, contracts, etc"
//           small
//           widthOverride={342}
//         />
//       }
//     />,
// };

// export const Settings: StoryObj<PageHeaderProps> = {
//   render: () =>
//     <PageHeader
//       pageIcon={<SettingsIcon fill="var(--token-dark-900)" />}
//       title="Settings"
//       subtitle="Set your preferences"
//     />,
// };

// export const Contracts: StoryObj<PageHeaderProps> = {
//   render: () =>
//     <PageHeader
//       pageIcon={<ActivityIcon fill="var(--token-dark-900)" />}
//       title="Contracts"
//       subtitle="Interface with the Terra blockchain"
//       secondaryNode={
//         <ButtonInlineWrapper>
//           <Button variant='secondary' small>Instantiate</Button>
//           <Button variant='secondary' small>Upload</Button>
//         </ButtonInlineWrapper>
//       }
//     />,
// };

// export const Swap: StoryObj<PageHeaderProps> = {
//   render: () =>
//     <PageHeader
//       pageIcon={<SwapArrowsIcon fill="var(--token-dark-900)" />}
//       title="Swap"
//       subtitle="Swap your tokens on any chain"
//     />,
// };

// export const Activity: StoryObj<PageHeaderProps> = {
//   render: () =>
//     <PageHeader
//       pageIcon={<ActivityIcon fill="var(--token-dark-900)" />}
//       title="Activity"
//       subtitle="Check your wallet activity"
//       secondaryNode={
//         <Input
//           actionIcon={{
//             icon: <SearchIcon fill='var(--token-dark-900)' />,
//             onClick: () => console.log('search clicked')
//           }}
//           placeholder="Search transaction history"
//           small
//           widthOverride={342}
//         />
//       }
//     />,
// };

// export const Stake: StoryObj<PageHeaderProps> = {
//   render: () =>
//     <PageHeader
//       pageIcon={<StakeIcon fill="var(--token-dark-900)" />}
//       title="Stake"
//       subtitle="Stake your assets to earn rewards"
//       secondaryNode={
//         <Flex gap={24}>
//           <Input
//             actionIcon={{
//               icon: <SearchIcon fill='var(--token-dark-900)' />,
//               onClick: () => console.log('search clicked')
//             }}
//             placeholder="Search tokens"
//             small
//             widthOverride={256}
//           />
//           <Button variant="primary" small>Claim All Rewards</Button>
//         </Flex>
//       }
//     />,
// };

// export const Governance: StoryObj<PageHeaderProps> = {
//   render: () =>
//     <PageHeader
//       pageIcon={<GovernanceIcon fill="var(--token-dark-900)" />}
//       title="Governance"
//       subtitle="Vote on and review proposals"
//       secondaryNode={
//         <Flex gap={24}>
//           <Input
//             actionIcon={{
//               icon: <SearchIcon fill='var(--token-dark-900)' />,
//               onClick: () => console.log('search clicked')
//             }}
//             placeholder="Search proposals"
//             small
//             widthOverride={256}
//           />
//           <Button variant="primary" small>Submit Proposal</Button>
//         </Flex>
//       }
//     />,
// };

// export const Proposal: StoryObj<PageHeaderProps> = {
//   render: () =>
//     <PageHeader
//       pageIcon={<GovernanceIcon fill="var(--token-dark-900)" />}
//       title="Proposal"
//       subtitle="Voting Proposal"
//     />,
// };
