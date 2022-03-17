import React, { Fragment } from "react";
import PageHeader from "../Common/PageHeader/PageHeader";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import BackLink from "../../../common/BackLink";

const styles = (theme: Theme) =>
  createStyles({
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
  });

type DetailsHeaderProps = {
  classes: any;
};

const GroupDetailsHeader = ({ classes }: DetailsHeaderProps) => {
  return (
    <PageHeader
      label={
        <Fragment>
          <BackLink to={IAM_PAGES.GROUPS} label={"Groups"} />
        </Fragment>
      }
      actions={<React.Fragment />}
    />
  );
};

export default withStyles(styles)(GroupDetailsHeader);
