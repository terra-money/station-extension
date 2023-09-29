import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
    width: 100%;
    height: 56px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: ${p => p.theme.palette.dark700};
    padding: 0px 18px;
    border-radius: 8px;
`;

export const RightSide = styled.View`
    display: flex;
    flex-direction: row;
    margin-left: auto;
    align-items: center;
`;

export const LeftIconContainer = styled.View`
    margin-right: 8px;
`;
