/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import PageTabs, { PageTabsProps } from './PageTabs';
import { useState } from 'react';

const meta: Meta<PageTabsProps> = {
  title: 'Components/Displays/Page Tabs',
  component: PageTabs,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<PageTabsProps> = {
  render: () => {
    const [activeTab, setActiveTab] = useState(1);

    return (
      <PageTabs
        tabs={['Tab 1', 'Tab 2', 'Tab 3']}
        activeTab={activeTab}
        onClick={setActiveTab}
      />
    );
  },
};
