import React from 'react';
import { useRecoilState } from 'recoil';
import { SvgUri } from 'react-native-svg';

import { GroupSelector, GroupSelectorElement, Text } from 'components';
import { currentNetworkState, currentThemeState } from '../../../state';

import chains from './chains.json';

import * as GS from '../../styles';
import * as S from './Network.styled';

const Chains = ({ chains }: { chains: any }) => {
    return (
        <S.ChainsContainer>
            {Object.values(chains).map(chain => {
                return (
                    <S.ChainContainer key={chain.chainID}>
                        <S.ChainIconWrapper>
                            {chain.icon && !chain.icon.endsWith('.png') && (
                                <SvgUri width="12px" height="12px" uri={chain.icon} />
                            )}
                        </S.ChainIconWrapper>
                        <Text.BodySmallX>{chain?.name}</Text.BodySmallX>
                    </S.ChainContainer>
                );
            })}
        </S.ChainsContainer>
    );
};

const Network = () => {
    const [currentNetwork, setCurrentNetwork] = useRecoilState(currentNetworkState);
    return (
        <GS.ContentContainer>
            <GS.OffsetedContainer>
                <GS.TitleContainer>
                    <Text.Title4>Network</Text.Title4>
                </GS.TitleContainer>
                <GroupSelector>
                    {Object.entries(chains).map(([network, chains]) => {
                        return (
                            <GroupSelectorElement
                                selected={currentNetwork === network}
                                key={network}
                                title={network}
                                onPress={() => setCurrentNetwork(network)}>
                                <Chains chains={chains} />
                            </GroupSelectorElement>
                        );
                    })}
                </GroupSelector>
            </GS.OffsetedContainer>
        </GS.ContentContainer>
    );
};

export const NetworkSettings = React.memo(Network);
