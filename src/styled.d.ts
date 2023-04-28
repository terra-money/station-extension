import 'styled-components';

declare module 'styled-components' {
    export interface DefaultTheme {
        name: string;
        barStyle: 'light-content' | 'dark-content';
        border: {
            width: string;
        };
        palette: {
            extra: {
                buttonDanger: string;
                info: string;
                infoLight: string;
                warning: string;
                warningLight: string;
                success: string;
                successLight: string;
                danger: string;
                dangerLight: string;
            };
            button: {
                primary: {
                    background: string;
                    text: string;
                };
                default: {
                    background: string;
                    text: string;
                };
            };
            menu: {
                background: string;
                border: string;
                text: string;
            };
            text: {
                info: string;
                muted: string;
                default: string;
            };
            background: {
                default: string;
                muted: string;
                card: string;
                cardMuted: string;
                input: string;
            };
            border: {
                card: string;
                input: string;
            };
        };
    }
}
