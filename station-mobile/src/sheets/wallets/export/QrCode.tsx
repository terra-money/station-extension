import React from 'react';
import QRCodeReact from 'react-qr-code';
import { useTheme } from 'styled-components';

const QRCodeWalletExport = ({ encoded }) => {
    const theme = useTheme();
    return (
        <QRCodeReact
            value={`terrastation://wallet_recover/?payload=${encoded}`}
            size={210}
            fgColor={theme.palette.white}
            bgColor={theme.palette.background.card}
        />
    );
};

export const QRCodeExport = React.memo(QRCodeWalletExport);
