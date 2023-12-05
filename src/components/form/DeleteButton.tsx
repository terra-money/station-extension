import { Button } from "@terra-money/station-ui"
import DeleteIcon from "@mui/icons-material/Delete"
import { useTranslation } from "react-i18next"

const DeleteButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation()
  return (
    <Button
      label={t("Remove")}
      icon={<DeleteIcon />}
      variant="warning"
      onClick={onClick}
    />
  )
}
export default DeleteButton
