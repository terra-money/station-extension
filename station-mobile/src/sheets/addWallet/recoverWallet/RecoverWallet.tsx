import React from 'react';

import { Text } from 'components';

import * as GS from '../../styles';
import { NewWalletWizard } from '../newWallet/NewWalletWizard';

const RecoverWalletPage = () => {
    return (
        <GS.ContentContainer>
            <GS.TitleContainer>
                <Text.Title4>Recover Wallet</Text.Title4>
            </GS.TitleContainer>
            <NewWalletWizard beforeCreate={null} />
        </GS.ContentContainer>
    );
};

export const RecoverWallet = React.memo(RecoverWalletPage);
