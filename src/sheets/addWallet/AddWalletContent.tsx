import React, { useState } from 'react';
import * as S from '../styles';

import { PressableSelector, Text } from 'components';

import { AddWalletIcon, ScanQRIcon, SeedPhraseIcon, MultisigWalletIcon } from 'icons';

const Content = ({ navigation }) => {
    return (
        <S.ContentContainer>
            <S.OffsetedContainer>
                <S.TitleContainer>
                    <Text.Title4>Add a Wallet</Text.Title4>
                </S.TitleContainer>
                <S.SelectorsContainer>
                    <PressableSelector
                        Icon={AddWalletIcon}
                        title="New Wallet"
                        onPress={() => navigation.navigate('newWallet')}
                    />
                    <PressableSelector
                        Icon={SeedPhraseIcon}
                        title="Import from seed phrase"
                        onPress={() => navigation.navigate('recoverWallet')}
                    />
                    <PressableSelector
                        Icon={SeedPhraseIcon}
                        title="Import from private key"
                        onPress={() => navigation.navigate('importWallet')}
                    />
                    <PressableSelector
                        Icon={ScanQRIcon}
                        title="Scan QR code"
                        onPress={() => navigation.navigate('scanQrCode')}
                    />
                    {/* <PressableSelector Icon={MultisigWalletIcon} title="New multisig wallet" onPress={() => null} /> */}
                    {/* <PressableSelector Icon={ScanQRIcon} title="Access with ledger" onPress={() => null} /> */}
                </S.SelectorsContainer>
            </S.OffsetedContainer>
        </S.ContentContainer>
    );
};

export const AddWalletContent = React.memo(Content);
