import { useTranslation } from "react-i18next"
import { Grid } from "components/layout"
import { ToNow } from "components/display"
import { SignBytesRequest } from "../utils"
import { isJSON } from "utils/json"
import { capitalize } from "@mui/material"
import { FinderLink } from "components/general"
import { AccAddress } from "@terra-money/feather.js"
import { InputWrapper, SummaryTable, TextArea } from "@terra-money/station-ui"
import { truncate } from "@terra-money/terra-utils"

const SignBytesDetails = ({ origin, timestamp, bytes }: SignBytesRequest) => {
  const { t } = useTranslation()

  const contents = [
    { label: t("Timestamp"), value: <ToNow update>{timestamp}</ToNow> },
  ]

  const content = bytes.toString("utf-8")

  return (
    <Grid gap={12}>
      <SummaryTable rows={contents.filter(({ value }) => !!value)} />

      <InputWrapper label={t("Sign bytes")}>
        {isJSON(content) ? (
          <SummaryTable
            rows={Object.entries(JSON.parse(content)).map(([key, value]) => ({
              label: capitalize(key),
              value:
                typeof value === "string" && AccAddress.validate(value) ? (
                  <FinderLink value={value}>
                    {truncate(value, [10, 14])}
                  </FinderLink>
                ) : typeof value === "object" ? (
                  JSON.stringify(value)
                ) : (
                  (value as any).toString()
                ),
            }))}
          />
        ) : (
          <TextArea readOnly={true} value={bytes.toString("utf-8")} />
        )}
      </InputWrapper>
    </Grid>
  )
}

export default SignBytesDetails
