import { useCallback, useEffect, useState } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import * as S from './styles';
import { Text } from '../texts';
import { useTheme } from 'styled-components';
import { ExpandButton } from './ExpandButton';
import { NavigationIcon } from './NavigationIcon';

const NavigationCutoffSvg = () => {
    const theme = useTheme();
    return (
        <Svg height="96" width="125" viewBox="0 0 125 96">
            <Path
                fill={theme.palette.menu.background}
                d="M 63 29 C 74.583 29 84.581 22.2088 89.227 12.3908 C 92.082 6.358 93.51 3.3416 94.472 2.37 C 95.661 1.1697 95.905 1.0155 97.498 0.4543 C 98.788 0 100.792 0 104.8 0 H 125 C 125 0 125 7.1634 125 17 V 83.2 C 125 96 125 96 125 96 H 0 C 0 7.1635 0 0 0 0 H 21.2 C 25.208 0 27.212 0 28.502 0.4543 C 30.095 1.0155 30.339 1.1697 31.528 2.37 C 32.49 3.3416 33.918 6.358 36.773 12.3908 C 41.419 22.2088 51.417 29 63 29 Z"
            />
        </Svg>
    );
};

const NavigationBar = ({ state, descriptors, navigation }) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [bottomPadding, setBottomPadding] = useState<number>(0);
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (insets.bottom) {
            setBottomPadding(insets.bottom);
        }
    }, [insets.bottom]);

    const offset = useSharedValue(18);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: offset.value }],
        };
    });

    const [expanded, setExpanded] = useState(false);
    const onExpand = useCallback(() => {
        if (expanded) {
            offset.value = withSpring(18);
        } else {
            offset.value = withSpring(-36);
        }
        setExpanded(!expanded);
    }, [expanded, setExpanded]);
    return (
        <>
            <S.NavigationWrapper style={[animatedStyles]}>
                <S.NavigationCutoffBar>
                    <ExpandButton onExpand={onExpand} expanded={expanded} />
                    <NavigationCutoffSvg />
                </S.NavigationCutoffBar>
                <S.NavigationBarBottom />
                <S.NavigationBarSides left width={width} />
                <S.NavigationBarSides right width={width} />
                <S.NavigationItems>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const label =
                            options.tabBarLabel !== undefined
                                ? options.tabBarLabel
                                : options.title !== undefined
                                ? options.title
                                : route.name;

                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                // The `merge: true` option makes sure that the params inside the tab screen are preserved
                                navigation.navigate({ name: route.name, merge: true });
                            }
                        };

                        const onLongPress = () => {
                            navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            });
                        };

                        const color = isFocused ? theme.palette.menu.text : theme.palette.text.muted;

                        return (
                            <S.NavigationItem
                                key={index}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}>
                                <NavigationIcon type={route.name} fill={color} />
                                <Text.Label color={color}>{label}</Text.Label>
                            </S.NavigationItem>
                        );
                    })}
                </S.NavigationItems>
            </S.NavigationWrapper>
            <S.NavigationBottomOutside bottomPadding={bottomPadding} />
        </>
    );
};

export { NavigationBar };
