import React, { Fragment } from "react";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { BackLink, PageHeader } from "mds";
import { useNavigate } from "react-router-dom";

const GroupDetailsHeader = () => {
  const navigate = useNavigate();
  return (
    <PageHeader
      label={
        <Fragment>
          <BackLink
            label={"Groups"}
            onClick={() => navigate(IAM_PAGES.GROUPS)}
          />
        </Fragment>
      }
      actions={<React.Fragment />}
    />
  );
};

export default GroupDetailsHeader;
