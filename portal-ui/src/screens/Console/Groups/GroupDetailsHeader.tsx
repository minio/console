import React, { Fragment } from "react";
import PageHeader from "../Common/PageHeader/PageHeader";
import { Link } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";

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
          <Link to={IAM_PAGES.GROUPS} className={classes.breadcrumLink}>
            Groups
          </Link>
        </Fragment>
      }
      actions={<React.Fragment />}
    />
  );
};

export default withStyles(styles)(GroupDetailsHeader);
