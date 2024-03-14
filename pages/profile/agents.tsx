import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { ProfileService } from "../../services/profile/profile.http";

const Favorites = (props) => {
  let { t } = useTranslation("common");
  const [agents, setAgents] = useState([]);

  const tabs = [
    {
      label: t("notifications"),
      path: "/profile",
    },
    {
      label: t("favorites"),
      path: "/profile/favorites",
    },
    {
      label: t("savedApartments"),
      path: "/profile/flats",
    },
  ];

  useEffect(() => {
    ProfileService.getAgents()
      .then((res) => {
        setAgents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return "";
};

export default Favorites;
