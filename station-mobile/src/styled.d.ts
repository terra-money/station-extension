import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        name: string;
        barStyle: 'light-content' | 'dark-content';
        border: {
            width: string;
        };
        palette: {
            primary: string;
            primary300: string;
            primary600: string;
            primary900: string;
            dark: string;
            dark100: string;
            dark200: string;
            dark300: string;
            dark600: string;
            dark700: string;
            dark900: string;
            light: string;
            light100: string;
            light300: string;
            white: string;
            success: string;
            success100: string;
            warning: string;
            warning100: string;
            error: string;
            error100: string;
        };
    }
}
