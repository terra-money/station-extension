import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AddWalletSheet, SettingsSheet } from '../sheets';

const DrawerStack = createStackNavigator();

const DrawerStackNavigation = () => {
    return (
        <DrawerStack.Navigator>
            <DrawerStack.Screen
                name="Settings"
                component={SettingsSheet}
                options={{
                    headerShown: false,
                    presentation: 'transparentModal',
                    animationEnabled: false,
                }}
            />
            <DrawerStack.Screen
                name="AddWallet"
                component={AddWalletSheet}
                options={{
                    headerShown: false,
                    presentation: 'transparentModal',
                    animationEnabled: false,
                }}
            />
        </DrawerStack.Navigator>
    );
};

export { DrawerStackNavigation };
