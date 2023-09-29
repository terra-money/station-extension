import React, { useState } from 'react';

import QRCodeScanner from 'react-native-qrcode-scanner';

import { Text } from 'components';

import * as GS from '../../styles';
import * as S from './ScanQrCode.styled';
import { ImportWalletForm } from '../importWallet/ImportWalletForm';

const ScanQrCodePage = () => {
    const [privateKey, setPrivateKey] = useState<string>('');

    if (privateKey) {
        return (
            <GS.ContentContainer>
                <ImportWalletForm privateKey={privateKey} />
            </GS.ContentContainer>
        );
    }
    return (
        <GS.ContentContainer>
            <GS.OffsetedContainer>
                <GS.TitleContainer>
                    <Text.Title4>Scan QR Code</Text.Title4>
                </GS.TitleContainer>
                <GS.VerticalStack>
                    <S.QrReaderContainer>
                        <QRCodeScanner
                            reactivateTimeout={1000}
                            onRead={info => {
                                try {
                                    const key = info.data.split('payload=').at(-1);
                                    if (key) {
                                        setPrivateKey(key);
                                    }
                                } catch (e) {}
                            }}
                        />
                    </S.QrReaderContainer>
                </GS.VerticalStack>
            </GS.OffsetedContainer>
        </GS.ContentContainer>
    );
};

export const ScanQrCode = React.memo(ScanQrCodePage);
