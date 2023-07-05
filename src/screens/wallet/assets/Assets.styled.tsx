import styled from 'styled-components/native';

export const Container = styled.View`
    padding: 15px 10px;
    flex: 1;
    background-color: ${p => p.theme.palette.background.default};
`;

export const AssetsHeader = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
`;

export const AssetContainer = styled.TouchableOpacity`
    width: 100%;
    height: 68px;
    display: flex;
    align-items: center;
    flex-direction: row;
`;

export const IconContainer = styled.View`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    width: 48px;
    border-radius: 24px;
    background-color: ${p => p.theme.palette.background.muted};
`;

export const AssetInfo = styled.View`
    display: flex;
    margin-left: 10px;
`;

export const AssetValue = styled.View`
    display: flex;
    margin-left: auto;
    align-items: flex-end;
    gap: 4px;
`;

export const AssetTrend = styled.View`
    display: flex;
    flex-direction: row;
    gap: 4px;
`;

export const AssetsContainer = styled.ScrollView`
    margin: 0px 10px;
`;
