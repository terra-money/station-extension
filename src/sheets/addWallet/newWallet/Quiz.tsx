import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import numeral from 'numeral';
import { shuffle } from '../../../utils';
import { useCreateWallet } from './NewWalletWizard';

import * as GS from '../../styles';
import * as S from './NewWallet.styled';
import { Text, Button, TextButton } from 'components';
import { useTheme } from '@react-navigation/native';
import { Alert } from 'react-native';

export interface QuizItem {
    index: number;
    answer: string;
}

const QuizComponent = () => {
    const theme = useTheme();
    const { setStep, values, createWallet } = useCreateWallet();
    const { mnemonic } = values;

    /* quiz */
    const { quiz, hint, win } = useMemo(() => createQuiz(mnemonic), [mnemonic]);
    const [answers, setAnswers] = useState<[string, string]>(['', '']);

    /* submit */

    const submit = () => {
        console.log('answers', answers);
        if (win(answers)) {
            createWallet(330);
        } else {
            Alert.alert('Write down the mnemonic and choose the correct word');
        }
    };

    return (
        <>
            <GS.VerticalStack>
                {quiz.map(({ index }, i) => (
                    <S.QuizBlock
                        // do not translate this unless you find a simple way to handle ordinal
                        key={index}>
                        <Text.Title6Bold>{`${numeral(index + 1).format('0o')} word`}</Text.Title6Bold>
                        <S.QuizButtonsWrapper>
                            {hint.map(word => {
                                const handleClick = () => {
                                    const next = [...answers];
                                    next[i] = word;
                                    setAnswers(next as [string, string]);
                                };

                                return (
                                    <Button
                                        onPress={handleClick}
                                        active={answers[i] === word}
                                        key={word}
                                        text={word}
                                        height="46px"
                                        width="46%"
                                    />
                                );
                            })}
                        </S.QuizButtonsWrapper>
                    </S.QuizBlock>
                ))}
                <TextButton text={`I haven't written the mnemonic`} onPress={() => setStep(1)} />
            </GS.VerticalStack>
            <Button marginTop="auto" height="48px" text="Submit" onPress={submit} />
        </>
    );
};

const createQuiz = (mnemonic: string) => {
    const deck = mnemonic.split(' ').map((answer, index) => ({ index, answer }));
    const draw = shuffle(deck).slice(0, 6);
    const quiz = draw.slice(0, 2) as [QuizItem, QuizItem];

    return {
        quiz,
        hint: shuffle(draw.map(({ answer }) => answer)),
        win: (answers: [string, string]) => answers.every((answer, index) => quiz[index].answer === answer),
    };
};

export const Quiz = React.memo(QuizComponent);
