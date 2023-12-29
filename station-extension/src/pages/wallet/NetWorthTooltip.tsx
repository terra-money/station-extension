import { useTranslation } from "react-i18next"

const NetWorthTooltip = () => {
  const { t } = useTranslation()

  return (
    <article>
      <p>
        {t(
          "Portfolio value is the total value of your assets minus staked and unstaking tokens."
        )}
      </p>
    </article>
  )
}

export default NetWorthTooltip
