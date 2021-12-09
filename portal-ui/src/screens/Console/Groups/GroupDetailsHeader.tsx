import React, { Fragment } from "react";
import PageHeader from "../Common/PageHeader/PageHeader";
import { Link } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";

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
          <Link to={"/groups"} className={classes.breadcrumLink}>
            Groups
          </Link>
        </Fragment>
      }
      actions={<React.Fragment />}
    />
  );
};

export default withStyles(styles)(GroupDetailsHeader);
