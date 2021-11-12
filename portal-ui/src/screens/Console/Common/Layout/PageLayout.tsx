import React from "react";
import { Grid } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { pageContentStyles } from "../FormComponents/common/styleLibrary";

const styles = (theme: Theme) =>
  createStyles({
    pageContainer: {
      width: "100%",
    },
    ...pageContentStyles,
  });

type PageLayoutProps = {
  className?: string;
  classes?: any;
  children: any;
};

const PageLayout = ({ classes, className = "", children }: PageLayoutProps) => {
  return (
    <div className={classes.contentSpacer}>
      <Grid container>
        <Grid item xs={12} className={className}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(PageLayout);
