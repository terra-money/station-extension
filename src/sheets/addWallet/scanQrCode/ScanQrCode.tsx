import React from 'react';
import { Text } from '../../../components';

import * as GS from '../../styles';

const ScanQrCodePage = () => {
    return (
        <GS.ContentContainer>
            <GS.OffsetedContainer>
                <GS.TitleContainer>
                    <Text.Title4>Scan QR</Text.Title4>
                </GS.TitleContainer>
            </GS.OffsetedContainer>
        </GS.ContentContainer>
    );
};

export const ScanQrCode = React.memo(ScanQrCodePage);
