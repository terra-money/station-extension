import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ReceiveContent } from './ReceiveContent';
import { QRCodeReceive } from './QrCode';

const ReceiveStack = createStackNavigator();

export const RoutesStackNavigator = () => {
    return (
        <ReceiveStack.Navigator>
            <ReceiveStack.Screen options={{ headerShown: false }} name="receive" component={ReceiveContent} />
            <ReceiveStack.Screen options={{ headerShown: false }} name="qrcode" component={QRCodeReceive} />
        </ReceiveStack.Navigator>
    );
};
