import React, { Fragment } from "react";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { BackLink } from "mds";
import { useNavigate } from "react-router-dom";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";

const GroupDetailsHeader = () => {
  const navigate = useNavigate();
  return (
    <PageHeaderWrapper
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
