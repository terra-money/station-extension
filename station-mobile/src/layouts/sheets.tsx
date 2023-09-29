import React from 'react';
import { SettingsSheet, AddWalletSheet, WalletsSheet, ReceiveSheet, SendSheet } from '../sheets';

const SheetLayout = () => {
    return (
        <>
            <SettingsSheet />
            <AddWalletSheet />
            <WalletsSheet />
            <ReceiveSheet />
            <SendSheet />
        </>
    );
};

export { SheetLayout };
