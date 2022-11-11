import { t } from "i18next";
import React from "react";
import { HealthMenuIcon } from "../../icons/SidebarMenus";
import FeatureNotAvailablePage from "./Common/Components/FeatureNotAvailablePage";

const Health = () => {
  return (
    <FeatureNotAvailablePage
      icon={<HealthMenuIcon />}
      pageHeaderText={"Health"}
      title={"Health"}
      message={<div>{t("This feature is currently not available")}</div>}
    />
  );
};

export default Health;
