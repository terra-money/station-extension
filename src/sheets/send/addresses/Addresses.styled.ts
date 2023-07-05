import styled from 'styled-components/native';

export const AddressContainer = styled.TouchableOpacity`
    width: 100%;
    display: flex;
    flex-direction: row;
    border: 1px solid ${p => p.theme.palette.border.card};
    border-radius: 8px;
    margin-bottom: 8px;
    height: 96px;
`;

export const AddressInfoContainer = styled.View`
    margin: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 50%;
`;

export const AddressInfoRow = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    max-width: 70%;
`;

export const AddressInfoRowTitle = styled.View`
    width: 80px;
`;

export const DeleteAddressContainer = styled.TouchableOpacity`
    height: 100%;
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const VerticalLine = styled.View`
    height: 100%;
    width: 1px;
    margin-left: auto;
    background-color: ${p => p.theme.palette.border.card};
`;

export const EmptyAddressesListContainer = styled.View`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ScrollableAddressesList = styled.View`
    display: flex;
    flex: 1;
    height: 100%;
    flex-grow: 1;
    background-color: yellow;
`;
