import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SendForm } from './SendForm';

const ReceiveStack = createStackNavigator();

export const RoutesStackNavigator = () => {
    return (
        <ReceiveStack.Navigator>
            <ReceiveStack.Screen options={{ headerShown: false }} name="send" component={SendForm} />
            {/* <ReceiveStack.Screen options={{ headerShown: false }} name="qrcode" component={QRCodeReceive} /> */}
        </ReceiveStack.Navigator>
    );
};
