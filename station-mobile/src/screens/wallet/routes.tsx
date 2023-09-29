import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AssetDetails } from './assetDetails';
import { Assets } from './assets';

const WalletStack = createStackNavigator();

export const RoutesStackNavigator = () => {
    return (
        <WalletStack.Navigator>
            <WalletStack.Screen options={{ headerShown: false }} name="assets" component={Assets} />
            <WalletStack.Screen options={{ headerShown: false }} name="assetDetails" component={AssetDetails} />
        </WalletStack.Navigator>
    );
};
