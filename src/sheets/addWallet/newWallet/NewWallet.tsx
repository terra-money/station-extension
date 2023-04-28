import React, { useState, useEffect } from 'react';
import { MnemonicKey } from '@terra-money/feather.js';

import { ContainerWithLoader, Text } from '../../../components';

import * as GS from '../../styles';
import { NewWalletWizard } from './NewWalletWizard';
import { Quiz } from './Quiz';

const NewWalletPage = () => {
    const [mnemonic, setMnemonic] = useState<MnemonicKey>();

    useEffect(() => {
        setTimeout(() => setMnemonic(() => new MnemonicKey()), 0);
    }, []);

    if (!mnemonic) {
        return (
            <GS.ContentContainer>
                <ContainerWithLoader />
            </GS.ContentContainer>
        );
    }
    return (
        <GS.ContentContainer>
            <GS.OffsetedContainer>
                <GS.TitleContainer>
                    <Text.Title4>New Wallet</Text.Title4>
                </GS.TitleContainer>
                <NewWalletWizard defaultMnemonic={mnemonic.mnemonic} beforeCreate={<Quiz />} />
            </GS.OffsetedContainer>
        </GS.ContentContainer>
    );
};

export const NewWallet = React.memo(NewWalletPage);
