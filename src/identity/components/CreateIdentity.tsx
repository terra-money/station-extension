import { Form, FormItem, Input } from "components/form"
import { useTranslation } from "react-i18next"

import styles from "./CreateIdentity.module.scss"
import { Button } from "components/general"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { LoadingCircular } from "components/feedback"
import { LocalStorageServices } from "identity/services"
import { IdentityServices } from "identity/services/Identity.services"

interface FormValues {
  name: string
  seed?: string
}

export const CreateIdentity = (props: { setPage: any }) => {
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

  const { name, seed } = watch()

  useEffect(() => {
    if (name) {
      const account = LocalStorageServices.getAccountByName(name)
      if (account) {
        setError("name", {
          type: "deps",
          message: "Account name is used",
        })
      } else {
        clearErrors("name")
      }
    }
  }, [name, seed])

  function submit({ name, seed }: FormValues) {
    if (isDisabled) return
    setLoading(true)
    IdentityServices.createIdentity().then((identity) => {
      console.log("Saving:", name, identity.did.string())
      LocalStorageServices.saveAccount(name, identity.did.string(), true)
      console.log(LocalStorageServices.getActiveAccount())
      props.setPage("identity")
    })
  }

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <FormItem label={t("Name")} error={errors.name?.message}>
        <Input type="text" value={name} {...register("name")}></Input>
      </FormItem>

      <FormItem label={t("Seed phase (Optional)")}>
        <Input type="text" placeholder="Optional" {...register("seed")}></Input>
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
