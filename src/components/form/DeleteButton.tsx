import { SubmitButton } from "station-ui"
import DeleteIcon from "@mui/icons-material/Delete"
import { useTranslation } from "react-i18next"

const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation()
  return (
    <SubmitButton
      label={t("Remove")}
      icon={<DeleteIcon />}
      variant="warning"
      onClick={onClick}
    />
  )
}
export default DeleteButton