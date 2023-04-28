import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { NetworkSettings } from './network/Network';
import { ThemeSettings } from './theme/Theme';
import { CurrencySettings } from './currency/Currency';
import { LanguageSettings } from './language/Language';
import { SettingsContent } from './SettingsContent';

const SettingsStack = createStackNavigator();

export const RoutesStackNavigator = () => {
    return (
        <SettingsStack.Navigator>
            <SettingsStack.Screen options={{ headerShown: false }} name="settings" component={SettingsContent} />
            <SettingsStack.Screen options={{ headerShown: false }} name="network" component={NetworkSettings} />
            <SettingsStack.Screen options={{ headerShown: false }} name="theme" component={ThemeSettings} />
            <SettingsStack.Screen options={{ headerShown: false }} name="currency" component={CurrencySettings} />
            <SettingsStack.Screen options={{ headerShown: false }} name="language" component={LanguageSettings} />
        </SettingsStack.Navigator>
    );
};
