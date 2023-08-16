import styled from 'styled-components/native';
import { css, DefaultTheme } from 'styled-components';

interface GenericText {
    color?: string;
}

const GenericText = css<GenericText>`
    font-family: 'Gotham-Book';
    color: ${p => p.color || p.theme.palette.white};
`;

const Display1 = styled.Text`
    ${GenericText}
    font-family: 'Gotham-Medium';
    font-size: 48px;
    line-height: 58px;
`;

const Display2 = styled.Text`
    ${GenericText}
    font-family: 'Gotham-Medium';
    font-size: 44px;
    line-height: 52px;
`;

const Title1 = styled.Text`
    ${GenericText}
    font-family: 'Gotham-Medium';
    font-size: 40px;
    line-height: 48px;
`;

const Title2 = styled.Text`
    ${GenericText}
    font-family: 'Gotham-Medium';
    font-size: 36px;
    line-height: 54px;
`;

const Title3 = styled.Text`
    ${GenericText}
    font-family: 'Gotham-Medium';
    font-size: 32px;
    line-height: 48px;
`;

const Title4 = styled.Text`
    ${GenericText}
    font-family: 'Gotham-Medium';
    font-size: 24px;
    line-height: 36px;
`;

const Title5 = styled.Text`
    ${GenericText}
    font-size: 20px;
    line-height: 30px;
`;

const Title6 = styled.Text`
    ${GenericText}
    font-size: 18px;
    line-height: 28px;
`;

const Title6Bold = styled.Text`
    ${GenericText}
    font-family: 'Gotham-Medium';
    font-size: 18px;
    line-height: 28px;
`;

const Body = styled.Text`
    ${GenericText}
    font-family: 'Gotham-Medium';
    font-size: 16px;
    line-height: 20px;
`;

const BodySmall = styled.Text`
    ${GenericText}
    font-size: 14px;
    line-height: 18px;
`;

const BodySmallBold = styled.Text`
    ${GenericText}
    font-family: 'Gotham-Medium';
    font-size: 14px;
    line-height: 18px;
`;

const BodySmallX = styled.Text`
    ${GenericText}
    font-family: 'Gotham-Medium';
    font-size: 12px;
    line-height: 16px;
`;

const BodySmallXX = styled.Text`
    ${GenericText}
    font-size: 10px;
    line-height: 12px;
`;

const Label = styled.Text`
    ${GenericText}
    font-family: 'Gotham-Medium';
    font-size: 14px;
    line-height: 16px;
`;

export const Text = {
    Display1,
    Display2,
    Title1,
    Title2,
    Title3,
    Title4,
    Title5,
    Title6,
    Title6Bold,
    Body,
    BodySmall,
    BodySmallBold,
    BodySmallX,
    BodySmallXX,
    Label,
};
