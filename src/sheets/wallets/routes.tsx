import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { WalletsContent } from './WalletsContent';

const SettingsStack = createStackNavigator();

export const RoutesStackNavigator = () => {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen options={{ headerShown: false }} name="settings" component={WalletsContent} />
        </SettingsStack.Navigator>
    );
};
