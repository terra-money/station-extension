import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

export const ExpandButton = styled.TouchableOpacity`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-color: ${p => p.theme.palette.button.primary.background};
    height: 46px;
    width: 46px;
    border-radius: 23px;
    top: -23px;
`;

export const NavigationBarSides = styled.View<{
    width: number;
    left?: boolean;
    right?: boolean;
}>`
    position: absolute;
    right: ${p => (p.right ? '0px' : 'auto')};
    left: ${p => (p.left ? '0px' : 'auto')};
    border-top-left-radius: ${p => (p.left ? '8px' : '0px')};
    border-top-right-radius: ${p => (p.right ? '8px' : '0px')};
    width: ${p => p.width / 2 - 50}px;
    height: 100%;
    background-color: ${p => p.theme.palette.menu.background};
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
    bottom: -16px;
    height: 80px;
    width: 100%;
    background-color: ${p => p.theme.palette.menu.background};
`;

export const NavigationBottomOutside = styled.View<{ bottomPadding: number }>`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: ${p => p.bottomPadding}px;
    background-color: ${p => p.theme.palette.menu.background};
`;

export const NavigationWrapper = styled(Animated.View)`
    position: absolute;
    width: 100%;
    bottom: 0;
    flex-direction: row;
    justify-content: center;
`;

export const NavigationItem = styled.TouchableOpacity`
    width: 48px;
    height: 42px;
    justify-content: space-between;
    display: flex;
    align-items: center;
    flex-basis: 25%;
`;

export const NavigationItems = styled.View`
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    row-gap: 16px;
`;
