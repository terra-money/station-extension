import React from 'react';
import { SvgUri } from 'react-native-svg';
import Clipboard from '@react-native-clipboard/clipboard';

import * as S from './Receive.styled';
import { IconButton, Text } from 'components';
import { CopyIcon, QRCodeIcon } from 'icons';

//[{"address": "terra1sk5snwx6476vugp9zfpwsxze67k5dzk9lmygx9",
// "chainName": "Terra", "id": "phoenix-1"}, {"address": "mars1sk5snwx6476vugp9zfpwsxze67k5dzk9yz8337", "chainName": "Mars", "id": "mars-1"}]
export const ReceiveAdress = ({ navigation, chainName, address }) => {
    return (
        <S.AssetContainer>
            <S.IconContainer>
                <SvgUri
                    width="18px"
                    height="18px"
                    uri={`https://station-assets.terra.money/img/chains/${chainName}.svg`}
                />
            </S.IconContainer>
            <S.NameContainer>
                <Text.Title6Bold>{chainName}</Text.Title6Bold>
                <Text.BodySmallXX ellipsizeMode="middle" numberOfLines={1}>
                    {address}
                </Text.BodySmallXX>
            </S.NameContainer>
            <S.AssetRightButtonsContainer>
                <IconButton onPress={() => navigation.navigate('qrcode', { address })}>
                    <QRCodeIcon />
                </IconButton>
                <IconButton onPress={() => Clipboard.setString(address)}>
                    <CopyIcon />
                </IconButton>
            </S.AssetRightButtonsContainer>
        </S.AssetContainer>
    );
};
