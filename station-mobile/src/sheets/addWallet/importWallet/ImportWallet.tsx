import React from 'react';

import * as GS from '../../styles';
import { ImportWalletForm } from './ImportWalletForm';

const ImportWalletPage = () => {
    return (
        <GS.ContentContainer>
            <ImportWalletForm />
        </GS.ContentContainer>
    );
};

export const ImportWallet = React.memo(ImportWalletPage);
