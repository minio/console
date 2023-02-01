import React from "react";
import FeatureNotAvailable from "./FeatureNotAvailable";
import PageLayout from "../Layout/PageLayout";
import { PageHeader } from "mds";

const FeatureNotAvailablePage = ({
  pageHeaderText = "",
  icon = null,
  title = "",
  message = null,
}: {
  pageHeaderText?: string;
  icon?: any;
  title?: string;
  message?: any;
}) => {
  return (
    <React.Fragment>
      <PageHeader label={pageHeaderText} />
      <PageLayout>
        <FeatureNotAvailable
          iconComponent={icon}
          title={title}
          message={message}
        />
      </PageLayout>
    </React.Fragment>
  );
};

export default FeatureNotAvailablePage;
