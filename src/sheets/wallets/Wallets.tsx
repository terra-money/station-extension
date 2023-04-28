import React, { useCallback, useMemo, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { useTheme } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { openedSheetState } from '../../state';
import { RoutesStackNavigator } from './routes';

const Wallets = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const theme = useTheme();

    const [openedSheet, setOpenedSheet] = useRecoilState(openedSheetState);

    const snapPoints = useMemo(() => ['60%'], []);

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setOpenedSheet('');
        }
    }, []);

    if (openedSheet !== 'wallets') return null;

    return (
        <BottomSheet
            enablePanDownToClose={true}
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
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
            <NavigationContainer>
                <RoutesStackNavigator />
            </NavigationContainer>
        </BottomSheet>
    );
};

export const WalletsSheet = React.memo(Wallets);
