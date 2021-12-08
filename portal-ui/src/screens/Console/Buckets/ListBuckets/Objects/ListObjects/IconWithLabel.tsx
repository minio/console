import React from "react";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";

const styles = (theme: Theme) =>
  createStyles({
    fileName: {
      display: "flex",
      alignItems: "center",
      "& .min-icon": {
        width: 16,
        height: 16,
        marginRight: 4,
      },
    },
    fileNameText: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  });

const IconWithLabel = (props: {
  classes: any;
  icon: JSX.Element;
  strings: string[];
}) => {
  return (
    <div className={props.classes.fileName}>
      {props.icon}
      <span className={props.classes.fileNameText}>
        {props.strings[props.strings.length - 1]}
      </span>
    </div>
  );
};

export default withStyles(styles)(IconWithLabel);
