import React, { useCallback, useMemo, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { useTheme } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';

import { openedSheetState } from '../../state';
import { RoutesStackNavigator } from './routes';

const Settings = () => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const theme = useTheme();

    const [openedSheet, setOpenedSheet] = useRecoilState(openedSheetState);

    const snapPoints = useMemo(() => ['90%'], []);

    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) {
                setOpenedSheet('');
            }
        },
        [setOpenedSheet],
    );

    if (openedSheet !== 'settings') {
        return null;
    }

    return (
        <BottomSheet
            enablePanDownToClose={true}
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{
                backgroundColor: theme.palette.dark700,
            }}
            handleIndicatorStyle={{
                backgroundColor: theme.palette.white,
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

export const SettingsSheet = React.memo(Settings);
