import React, { Fragment, useEffect } from "react";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { BackLink } from "mds";
import { useNavigate } from "react-router-dom";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import { useAppDispatch } from "../../../store";
import { setHelpName } from "../../../systemSlice";

const GroupDetailsHeader = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHelpName("group_details"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
      actions={<HelpMenu />}
    />
  );
};

export default GroupDetailsHeader;
