import { Button, Text } from 'components';
import React from 'react';
import { addressFromWords } from '../../../utils';
import { DoubleCheckIcon } from '../../../icons';

import * as S from './NewWallet.styled';
import { useRecoilState } from 'recoil';
import { openedSheetState } from '../../../state';

const CreatedWalletComponent = ({ name, words }: SingleWallet) => {
    const [openedSheet, setOpenedSheet] = useRecoilState(openedSheetState);

    const address = addressFromWords(words['330']);
    return (
        <>
            <S.CreatedWalletContainer>
                <DoubleCheckIcon />
                <Text.Title5>Wallet generated successfully</Text.Title5>
                <S.WalletInfoContainer>
                    <Text.Body>{name}</Text.Body>
                    <Text.Body>{address}</Text.Body>
                </S.WalletInfoContainer>
            </S.CreatedWalletContainer>
            <Button active={true} marginTop="auto" height="48px" text="Submit" onPress={() => setOpenedSheet('')} />
        </>
    );
};

export const CreatedWallet = React.memo(CreatedWalletComponent);
