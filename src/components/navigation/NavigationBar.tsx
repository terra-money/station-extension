import React, { useCallback, useEffect, useState } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import * as S from './styles';
import { Text } from 'components';
import { useTheme } from 'styled-components';
import { ExpandButton } from './ExpandButton';
import { NavigationIcon } from './NavigationIcon';

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
    }, [expanded, setExpanded, offset]);
    return (
        <S.NavigationWrapper>
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

                    const color = isFocused ? theme.palette.white: theme.palette.dark900;

                    return (
                        <React.Fragment key={index}>
                            {index === 2 && <ExpandButton onExpand={onExpand} expanded={expanded} />}
                            <S.NavigationItem
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}>
                                <NavigationIcon type={route.name} fill={color} />
                                <Text.BodySmallX color={color}>{label}</Text.BodySmallX>
                            </S.NavigationItem>
                        </React.Fragment>
                    );
                })}
            </S.NavigationItems>
        </S.NavigationWrapper>
    );
};

export { NavigationBar };
