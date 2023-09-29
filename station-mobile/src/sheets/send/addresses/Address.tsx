import React from 'react';

import * as S from './Addresses.styled';
import { Text } from 'components';
import { DeleteTrashIcon } from 'icons';
import { Alert } from 'react-native';
import { useAddressBook } from 'utils';

const AddressComponent = ({ name, recipient, memo = '', setRecipient }) => {
    const { remove } = useAddressBook();
    return (
        <S.AddressContainer onPress={() => setRecipient(recipient)}>
            <S.AddressInfoContainer>
                <S.AddressInfoRow>
                    <S.AddressInfoRowTitle>
                        <Text.BodySmallBold>Name</Text.BodySmallBold>
                    </S.AddressInfoRowTitle>
                    <Text.BodySmallBold numberOfLines={1}>{name}</Text.BodySmallBold>
                </S.AddressInfoRow>
                <S.AddressInfoRow>
                    <S.AddressInfoRowTitle>
                        <Text.BodySmallBold>Address</Text.BodySmallBold>
                    </S.AddressInfoRowTitle>
                    <Text.BodySmallBold ellipsizeMode="middle" numberOfLines={1}>
                        {recipient}
                    </Text.BodySmallBold>
                </S.AddressInfoRow>
                <S.AddressInfoRow>
                    <S.AddressInfoRowTitle>
                        <Text.BodySmallBold>Memo</Text.BodySmallBold>
                    </S.AddressInfoRowTitle>
                    <Text.BodySmallBold numberOfLines={1}>{memo || '-'}</Text.BodySmallBold>
                </S.AddressInfoRow>
            </S.AddressInfoContainer>
            <S.VerticalLine />
            <S.DeleteAddressContainer
                onPress={() => {
                    Alert.alert('Do you want to remove the wallet?', '', [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        { text: 'Yes', onPress: () => remove(name) },
                    ]);
                }}>
                <DeleteTrashIcon />
            </S.DeleteAddressContainer>
        </S.AddressContainer>
    );
};

export const Address = React.memo(AddressComponent);
