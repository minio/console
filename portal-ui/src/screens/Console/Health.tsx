import React from "react";
import { HealthMenuIcon } from "mds";
import FeatureNotAvailablePage from "./Common/Components/FeatureNotAvailablePage";

const Health = () => {
  return (
    <FeatureNotAvailablePage
      icon={<HealthMenuIcon />}
      pageHeaderText={"Health"}
      title={"Health"}
      message={<div>This feature is currently not available</div>}
    />
  );
};

export default Health;
