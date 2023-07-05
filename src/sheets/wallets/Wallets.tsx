import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTheme } from 'styled-components';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { openedSheetState } from '../../state';
import { RoutesStackNavigator } from './routes';

const Wallets = () => {
    const theme = useTheme();

    // to listen routes state changes
    const navigationRef = useNavigationContainerRef();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [snapPoints, setSnapPoints] = useState(['60%']);

    const [openedSheet, setOpenedSheet] = useRecoilState(openedSheetState);

    // const snapPoints = useMemo(() => ['60%'], []);

    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) {
                setOpenedSheet('');
            }
        },
        [setOpenedSheet],
    );

    navigationRef.addListener('state', e => {
        const currentRoute = navigationRef.getCurrentRoute()?.name;

        if (currentRoute && !['manage', 'settings'].includes(currentRoute)) {
            setSnapPoints(['90%']);
        } else if (currentRoute) {
            setSnapPoints(['60%']);
        }
    });

    if (openedSheet !== 'wallets') {
        return null;
    }

    return (
        <BottomSheet
            enablePanDownToClose={true}
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            keyboardBlurBehavior="restore"
            backgroundStyle={{
                backgroundColor: theme.palette.background.cardMuted,
            }}
            handleIndicatorStyle={{
                backgroundColor: theme.palette.text.default,
            }}
            onChange={handleSheetChanges}
            backdropComponent={backdropProps => (
                <BottomSheetBackdrop {...backdropProps} opacity={0.8} disappearsOnIndex={-1} />
            )}>
            <NavigationContainer ref={navigationRef}>
                <RoutesStackNavigator />
            </NavigationContainer>
        </BottomSheet>
    );
};

export const WalletsSheet = React.memo(Wallets);
