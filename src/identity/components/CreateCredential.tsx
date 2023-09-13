import { Form, FormItem, Input, TextArea } from "components/form"
import { useTranslation } from "react-i18next"

import styles from "./CreateCredential.module.scss"
import { Button } from "components/general"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { LoadingCircular } from "components/feedback"
import {
  LocalStorageServices,
  approveMethod,
  receiveMethod,
} from "identity/services"
import { IdentityServices } from "identity/services/Identity.services"
import { ExtensionService } from "identity/services/Extension.service"

interface FormValues {
  data: string
}

export const CreateCredential = (props: { setPage: any }) => {
  const { t } = useTranslation()
  const [isDisabled, setDisable] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)

  const form = useForm<FormValues>({ mode: "onChange" })
  const {
    register,
    //trigger,
    watch,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = form

  const { data } = watch()

  const submit = ({ data }: FormValues) => {
    if (isDisabled) return
    setLoading(true)
    const activeIdentity = LocalStorageServices.getActiveAccount()
    if (activeIdentity === null) {
      throw new Error("no active identity")
    }
    receiveMethod(Buffer.from(data))
      .then((c) => {
        props.setPage("identity")
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <FormItem label={t("Credential Data")}>
        <TextArea cols={6} {...register("data")}></TextArea>
      </FormItem>

      <div className={styles.button__padding}></div>
      <section className={styles.button__conainer}>
        <Button color="primary" disabled={isDisabled} type="submit">
          {isLoading ? (
            <>
              <LoadingCircular size={18} /> Loading...
            </>
          ) : (
            <>Create</>
          )}
        </Button>
      </section>
    </Form>
  )
}
