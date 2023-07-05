import React from 'react';
import QRCodeReact from 'react-qr-code';
import { useTheme } from 'styled-components';

import * as S from '../styles';
import { Text } from 'components';
import { QRCodeScreenContainer } from './Receive.styled';

const QRCodeWalletExport = ({ route }) => {
    const {
        params: { address },
    } = route;
    const theme = useTheme();
    return (
        <S.ContentContainer>
            <S.OffsetedContainer>
                <S.TitleContainer>
                    <Text.Title4>Wallet Adress</Text.Title4>
                </S.TitleContainer>

                <QRCodeScreenContainer>
                    <QRCodeReact
                        value={address}
                        size={260}
                        fgColor={theme.palette.text.default}
                        bgColor={theme.palette.background.card}
                    />
                    <Text.BodySmallX color={theme.palette.text.muted}>{address}</Text.BodySmallX>
                </QRCodeScreenContainer>
            </S.OffsetedContainer>
        </S.ContentContainer>
    );
};

export const QRCodeReceive = React.memo(QRCodeWalletExport);
