import React from "react";
import FeatureNotAvailable from "./FeatureNotAvailable";
import PageLayout from "../Layout/PageLayout";
import PageHeaderWrapper from "../PageHeaderWrapper/PageHeaderWrapper";

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
      <PageHeaderWrapper label={pageHeaderText} />
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
