import React from 'react';
import { Address } from './Address';

import * as S from './Addresses.styled';
import * as GS from '../../styles';
import { useAddressBook } from 'utils';
import { Text } from 'components';

const Wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => (
    <GS.OffsetedContainer>
        <GS.TitleContainer>
            <Text.Title4>Address list</Text.Title4>
        </GS.TitleContainer>
        {children}
    </GS.OffsetedContainer>
);

const AddressesListComponent = ({ setRecipient }) => {
    const { list } = useAddressBook();

    if (!list.length) {
        return (
            <Wrapper>
                <S.EmptyAddressesListContainer>
                    <Text.Title6Bold>No saved addresees</Text.Title6Bold>
                </S.EmptyAddressesListContainer>
            </Wrapper>
        );
    }
    return (
        <Wrapper>
            {list.map(address => (
                <Address setRecipient={setRecipient} key={address.name} {...address} />
            ))}
        </Wrapper>
    );
};

export const AddressesList = React.memo(AddressesListComponent);
