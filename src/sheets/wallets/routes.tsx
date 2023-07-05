import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { WalletsContent } from './WalletsContent';
import { ManageWallet } from './manage';
import { ExportWallet } from './export';
import { ChangePassword } from './changePassword';
import { DeleteWallet } from './deleteWallet';

const SettingsStack = createStackNavigator();

export const RoutesStackNavigator = () => {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen options={{ headerShown: false }} name="settings" component={WalletsContent} />
            <SettingsStack.Screen options={{ headerShown: false }} name="manage" component={ManageWallet} />
            <SettingsStack.Screen options={{ headerShown: false }} name="export" component={ExportWallet} />
            <SettingsStack.Screen options={{ headerShown: false }} name="changePassword" component={ChangePassword} />
            <SettingsStack.Screen options={{ headerShown: false }} name="deleteWallet" component={DeleteWallet} />
        </SettingsStack.Navigator>
    );
};
