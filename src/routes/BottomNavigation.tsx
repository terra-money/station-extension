import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationBar } from '../components/navigation';

import { WalletScreen, SwapScreen, StakingScreen, GovernanceScreen, HistoryScreen, SendScreen } from '../screens';
import { AppStackParamList } from './types';
import { DrawerStackNavigation } from './DrawersNavigation';
import { SettingsSheet } from '../sheets';

const Tab = createBottomTabNavigator<AppStackParamList>();

const BottomNavigation = () => {
    return (
        <Tab.Navigator tabBar={props => <NavigationBar {...props} />}>
            <Tab.Screen options={{ headerShown: false }} name="Wallet" component={WalletScreen} />
            <Tab.Screen options={{ headerShown: false }} name="Swap" component={SwapScreen} />
            <Tab.Screen options={{ headerShown: false }} name="Staking" component={StakingScreen} />
            <Tab.Screen options={{ title: 'Gov', headerShown: false }} name="Governance" component={GovernanceScreen} />
            <Tab.Screen options={{ headerShown: false }} name="History" component={HistoryScreen} />
            <Tab.Screen options={{ headerShown: false }} name="Send" component={SendScreen} />
        </Tab.Navigator>
    );
};

export { BottomNavigation };
