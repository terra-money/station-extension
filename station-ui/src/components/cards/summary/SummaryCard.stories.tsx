import type { Meta, StoryObj } from '@storybook/react';
import SummaryCard, { SummaryCardProps } from './SummaryCard';
import exampleStyles from './example.module.scss';

const meta: Meta<SummaryCardProps> = {
  title: 'Components/Cards/Summary',
  component: SummaryCard,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<SummaryCardProps> = {
  render: () => {
    return (
      <SummaryCard>
        <div className={exampleStyles.wrapper}>
          <div className={exampleStyles.title}>Summary Card</div>
          <div className={exampleStyles.description}>
            terra1kc87mu460fwkqte29rquh4hc20m54fxwtsx7gp
          </div>
        </div>
      </SummaryCard>
    )
  },
  argTypes: {},
};
