import styled from 'styled-components/native';

export const ExpandButton = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #075CEE;
    height: 64px;
    width: 64px;
    border-radius: 32px;
    transform: translateY(-30px);
`;

export const NavigationCutoffBar = styled.SafeAreaView`
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    align-items: center;
`;

export const NavigationBarBottom = styled.View`
    position: absolute;
    /* bottom: -16px; */
    /* height: 80px; */
    width: 100%;
    background-color: ${p => p.theme.palette.dark};
`;

export const NavigationBottomOutside = styled.View<{ bottomPadding: number }>`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: ${p => p.bottomPadding}px;
    background-color: ${p => p.theme.palette.dark};
`;

export const NavigationWrapper = styled.SafeAreaView`
    width: 100%;
    flex-direction: row;
    justify-content: center;
    background-color: #212227;
`;

export const NavigationItem = styled.TouchableOpacity`
    width: 48px;
    height: 42px;
    justify-content: space-between;
    display: flex;
    align-items: center;
    flex-basis: 20%;
`;

export const NavigationItems = styled.View`
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 16px;
`;
