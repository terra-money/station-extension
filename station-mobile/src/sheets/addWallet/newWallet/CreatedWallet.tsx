import React from 'react';
import { useRecoilState } from 'recoil';
import { Button, Text } from 'components';

import { addressFromWords } from 'utils';
import { DoubleCheckIcon } from 'icons';

import * as S from './NewWallet.styled';
import * as GS from '../../styles';

import { openedSheetState } from '../../../state';

const CreatedWalletComponent = ({
    name,
    words,
    text = 'Wallet generated successfully',
}: SingleWallet & { text?: string }) => {
    const [, setOpenedSheet] = useRecoilState(openedSheetState);

    const address = addressFromWords(words['330']);
    return (
        <>
            <GS.OffsetedContainer>
                <S.CreatedWalletContainer>
                    <DoubleCheckIcon />
                    <Text.Title5>{text}</Text.Title5>
                    <S.WalletInfoContainer>
                        <Text.Body>{name}</Text.Body>
                        <Text.Body>{address}</Text.Body>
                    </S.WalletInfoContainer>
                </S.CreatedWalletContainer>
            </GS.OffsetedContainer>
            <GS.BottomButtonsWrapper>
                <Button active={true} marginTop="auto" height="48px" text="Submit" onPress={() => setOpenedSheet('')} />
            </GS.BottomButtonsWrapper>
        </>
    );
};

export const CreatedWallet = React.memo(CreatedWalletComponent);
