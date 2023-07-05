import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTheme } from 'styled-components';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';

import { openedSheetState } from '../../state';
import { RoutesStackNavigator } from './routes';

const AddWallet = () => {
    // to listen routes state changes
    const navigationRef = useNavigationContainerRef();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(0);
    const [snapPoints, setSnapPoints] = useState(['60%']);
    const theme = useTheme();

    const [openedSheet, setOpenedSheet] = useRecoilState(openedSheetState);

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setOpenedSheet('');
        }
    }, []);

    navigationRef.addListener('state', e => {
        const currentRoute = navigationRef.getCurrentRoute()?.name;

        if (currentRoute && currentRoute !== 'addWallet') {
            setSnapPoints(['90%']);
        } else if (currentRoute) {
            setSnapPoints(['60%']);
        }
    });

    if (openedSheet !== 'addWallet') {
        return null;
    }

    return (
        <BottomSheet
            enablePanDownToClose={true}
            ref={bottomSheetRef}
            index={bottomSheetIndex}
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

export const AddWalletSheet = React.memo(AddWallet);
