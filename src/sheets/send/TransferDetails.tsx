import React from 'react';
import * as S from './Send.styles';
import { TinyRightArrowIcon } from 'icons';
import { useInterchainAddresses } from 'utils';
import { SvgUri } from 'react-native-svg';
import { Text } from 'components';
import { useTheme } from 'styled-components';

const TransferDetailsComponent = ({ selectedAsset }) => {
    const theme = useTheme();
    const addresses = useInterchainAddresses() as { [key: string]: AccAddress };

    return (
        <S.TransferDetailsContainer>
            <S.TransferDetails>
                <S.TransferCoinIconWrapper>
                    <SvgUri
                        width="26px"
                        height="26px"
                        uri={'https://station-assets.terra.money/img/chains/Terra.svg'}
                    />
                </S.TransferCoinIconWrapper>
                <Text.BodySmallBold color={theme.palette.dark900}>terra1...v4ehqc</Text.BodySmallBold>
                <S.TransferDetailsValues>
                    <Text.BodySmallBold>40.00 LUNA</Text.BodySmallBold>
                    <Text.BodySmallBold color={theme.palette.dark900}>$36.28</Text.BodySmallBold>
                </S.TransferDetailsValues>
            </S.TransferDetails>

            <S.TransferDetails>
                <S.TransferCoinIconWrapper>
                    <SvgUri
                        width="26px"
                        height="26px"
                        uri={'https://station-assets.terra.money/img/chains/Osmosis.svg'}
                    />
                </S.TransferCoinIconWrapper>
                <Text.BodySmallBold color={theme.palette.dark900}>osmo1s...6j7plq</Text.BodySmallBold>
                <S.TransferDetailsValues>
                    <Text.BodySmallBold>40.00 LUNA</Text.BodySmallBold>
                    <Text.BodySmallBold color={theme.palette.dark900}>$36.28</Text.BodySmallBold>
                </S.TransferDetailsValues>
            </S.TransferDetails>
            <S.TransferIconWrapper>
                <S.TransferIconContainer>
                    <TinyRightArrowIcon />
                </S.TransferIconContainer>
            </S.TransferIconWrapper>
        </S.TransferDetailsContainer>
    );
};

export const TransferDetails = React.memo(TransferDetailsComponent);
