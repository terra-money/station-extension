import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import update from "immutability-helper"
import numeral from "numeral"
import shuffle from "utils/shuffle"
import { Form, FormItem } from "components/form"
import { useCreateWallet } from "./CreateWalletWizard"
import styles from "./Quiz.module.scss"
import {
  Banner,
  Button,
  CheckedButton,
  Flex,
  SubmitButton,
} from "@terra-money/station-ui"
import { FlexColumn } from "components/layout"

export interface QuizItem {
  index: number
  answer: string
}

const Quiz = () => {
  const { t } = useTranslation()
  const { setStep, values } = useCreateWallet()
  const { mnemonic } = values

  /* quiz */
  const { quiz, hint, win } = useMemo(() => createQuiz(mnemonic), [mnemonic])
  const [answers, setAnswers] = useState<[string, string]>(["", ""])

  /* submit */
  const { handleSubmit } = useForm()
  const [incorrect, setIncorrect] = useState(false)
  const submit = () => (win(answers) ? setStep(3) : setIncorrect(true))
  const reset = () => setStep(1)

  return (
    <Form onSubmit={handleSubmit(submit)} className={styles.quiz}>
      <FlexColumn gap={18} className={styles.hints__container}>
        {quiz.map(({ index }, i) => (
          <FormItem
            // do not translate this unless you find a simple way to handle ordinal
            label={`${numeral(index + 1).format("0o")} word`}
            key={index}
          >
            <section className={styles.hint}>
              {hint.map((word) => {
                const handleClick = () => {
                  const next = update(answers, { [i]: { $set: word } })
                  setAnswers(next)
                }

                return (
                  <CheckedButton
                    active={answers[i] === word}
                    onClick={handleClick}
                    key={word}
                  >
                    {word}
                  </CheckedButton>
                )
              })}
            </section>
          </FormItem>
        ))}

        {incorrect && (
          <Banner
            variant="error"
            title={t(
              "Write down the recovery phrase and choose the correct word"
            )}
          />
        )}

        <Flex gap={12} style={{ marginTop: 22 }}>
          <Button variant="secondary" onClick={reset} block>
            {t("Back")}
          </Button>
          <SubmitButton disabled={answers.some((answer) => !answer)}>
            {t("Confirm")}
          </SubmitButton>
        </Flex>
      </FlexColumn>
    </Form>
  )
}

export default Quiz

/* helpers */
const createQuiz = (mnemonic: string) => {
  const deck = mnemonic.split(" ").map((answer, index) => ({ index, answer }))
  const draw = shuffle(deck).slice(0, 6)
  const quiz = draw.slice(0, 2) as [QuizItem, QuizItem]

  return {
    quiz,
    hint: shuffle(draw.map(({ answer }) => answer)),
    win: (answers: [string, string]) =>
      answers.every((answer, index) => quiz[index].answer === answer),
  }
}
