import React from 'react';
import { SettingsSheet, AddWalletSheet, WalletsSheet } from '../sheets';

const SheetLayout = () => {
    return (
        <>
            <SettingsSheet />
            <AddWalletSheet />
            <WalletsSheet />
        </>
    );
};

export { SheetLayout };
