import React from "react";
import Typography from "@material-ui/core/Typography";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: theme.palette.error.main,
    },
  });

interface IErrorBlockProps {
  classes: any;
  errorMessage: string;
  withBreak?: boolean;
}

const ErrorBlock = ({
  classes,
  errorMessage,
  withBreak = true,
}: IErrorBlockProps) => {
  return (
    <React.Fragment>
      {withBreak && <br />}
      <Typography component="p" variant="body1" className={classes.errorBlock}>
        {errorMessage}
      </Typography>
    </React.Fragment>
  );
};

export default withStyles(styles)(ErrorBlock);
