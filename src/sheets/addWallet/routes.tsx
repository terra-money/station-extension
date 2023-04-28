import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AddWalletContent } from './AddWalletContent';
import { NewWallet } from './newWallet/NewWallet';
import { ImportSeed } from './importSeed/ImportSeed';
import { ScanQrCode } from './scanQrCode/ScanQrCode';

const SettingsStack = createStackNavigator();

export const RoutesStackNavigator = () => {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen options={{ headerShown: false }} name="addWallet" component={AddWalletContent} />
            <SettingsStack.Screen options={{ headerShown: false }} name="newWallet" component={NewWallet} />
            <SettingsStack.Screen options={{ headerShown: false }} name="importSeed" component={ImportSeed} />
            <SettingsStack.Screen options={{ headerShown: false }} name="scanQrCode" component={ScanQrCode} />
        </SettingsStack.Navigator>
    );
};
