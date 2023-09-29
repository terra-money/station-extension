import React from 'react';

import * as S from '../styles';

import { Text } from 'components';

import { getChainNamefromID, useBankBalance, useInterchainAddresses, useNetwork } from 'utils';
import { ReceiveAdress } from './Adress';

const Content = ({ navigation }) => {
    const addresses = useInterchainAddresses() as { [key: string]: AccAddress };
    const networks = useNetwork();
    const coins = useBankBalance();

    const addressData = Object.keys(addresses)
        .map(key => ({
            address: addresses?.[key],
            chainName: getChainNamefromID(key, networks) ?? key,
            id: key,
        }))
        .sort(a => (coins.some(({ chain }) => chain === a.id) ? -1 : 1));

    return (
        <S.ContentContainer>
            <S.OffsetedContainer>
                <S.TitleContainer>
                    <Text.Title4>Receive</Text.Title4>
                </S.TitleContainer>
                <S.SelectorsContainer>
                    {addressData?.map(data => (
                        <ReceiveAdress key={data.address} {...data} navigation={navigation} />
                    ))}
                </S.SelectorsContainer>
            </S.OffsetedContainer>
        </S.ContentContainer>
    );
};

export const ReceiveContent = React.memo(Content);
