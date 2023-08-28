import type { Meta, StoryObj } from '@storybook/react';
import Tabs, { TabsProps } from './Tabs';
import { useState } from 'react';

const meta: Meta<TabsProps> = {
  title: 'Components/Buttons/Tabs/Tabs Only',
  component: Tabs,
  argTypes: {},
} as Meta;

export default meta;

const TabsComponent = () => {
  const [activeTabKey, setActiveTabKey] = useState('tab1');

  return (
    <Tabs
      activeTabKey={activeTabKey}
      tabs={[
        {
          key: 'tab1',
          label: 'Tab 1',
          onClick: () => setActiveTabKey('tab1'),
        },
        {
          key: 'tab2',
          label: 'Tab 2',
          onClick: () => setActiveTabKey('tab2'),
        },
        {
          key: 'tab3',
          label: 'Tab 3',
          onClick: () => setActiveTabKey('tab3'),
        },
      ]}
    />
  );
}

export const Default: StoryObj<TabsProps> = {
  render: () => (
    <TabsComponent />
  )
};
