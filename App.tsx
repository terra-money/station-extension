import React, { useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RecoilRoot, useRecoilState } from 'recoil';

import { MainLayout, SheetLayout } from './src/layouts';
import { darkTheme } from './src/constants/themes/dark';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { currentThemeState } from './src/state';
import { availableThemes } from './src/constants/themes';
import InitBankBalance from './src/components/InitBankBalance';
import { InitNetworks } from './src/components/InitNetworks';
import InitQueryClient from './src/components/InitQueryClient';
import InitChains from './src/components/InitChains';

function Root(): JSX.Element {
    const [currentTheme] = useRecoilState(currentThemeState);
    const theme = useMemo(
        () => availableThemes.find(theme => theme.name === currentTheme) || darkTheme,
        [currentTheme],
    );
    return (
        <ThemeProvider theme={theme}>
            <InitQueryClient>
                <InitNetworks>
                    <InitChains>
                        <InitBankBalance>
                            <NavigationContainer>
                                <MainLayout />
                            </NavigationContainer>
                            <SheetLayout />
                        </InitBankBalance>
                    </InitChains>
                </InitNetworks>
            </InitQueryClient>

            <StatusBar barStyle={theme.barStyle} backgroundColor={theme.palette.background.default} />
        </ThemeProvider>
    );
}

function App(): JSX.Element {
    // getChainOptions().then(chainOptions => console.log('chain options', chainOptions));

    return (
        <RecoilRoot>
            <SafeAreaProvider>
                <Root />
            </SafeAreaProvider>
        </RecoilRoot>
    );
}
export default App;
