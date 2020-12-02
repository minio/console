import React from "react";
import Grid from "@material-ui/core/Grid";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { predefinedList } from "../common/styleLibrary";

interface IPredefinedList {
  classes: any;
  label?: string;
  content: any;
  multiLine?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    ...predefinedList,
  });

const PredefinedList = ({
  classes,
  label = "",
  content,
  multiLine = false,
}: IPredefinedList) => {
  return (
    <React.Fragment>
      {label !== "" && (
        <Grid item xs={12} className={classes.predefinedTitle}>
          {label}
        </Grid>
      )}
      <Grid item xs={12} className={classes.predefinedList}>
        <Grid
          item
          xs={12}
          className={
            multiLine ? classes.innerContentMultiline : classes.innerContent
          }
        >
          {content}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(PredefinedList);
