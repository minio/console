// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { Fragment } from "react";
import BoxIconButton from "../../../Common/BoxIconButton/BoxIconButton";
import { IconButtonProps } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";

type DeleteButtonProps = {
  onClick: (e: any) => void;
  text?: string;
  disabled?: boolean;
  size?: string;
  tooltip?: string;
  classes?: any;
  icon?: React.ReactNode;
  showLabelAlways?: boolean;
  [x: string]: any;
};

type RBIconProps = Partial<IconButtonProps> & DeleteButtonProps;

const useStyles = makeStyles((theme: Theme) => {
  const getButtonColor = (props: RBIconProps) => {
    const { variant, color } = props;

    let tgtColor = theme.palette.primary.main;

    if (color === "primary" && variant === "contained") {
      tgtColor = theme.palette.primary.contrastText;
    } else if (color === "primary" && variant === "outlined") {
      tgtColor = theme.palette.primary.main;
    } else if (color === "secondary") {
      tgtColor = theme.palette.secondary.main;
    }

    return tgtColor;
  };

  return {
    root: {
      padding: "7px",
      color: (props: RBIconProps) => getButtonColor(props),
      borderColor: (props: RBIconProps) =>
        props.color === "secondary"
          ? theme.palette.secondary.main
          : theme.palette.primary.main,
      "& svg.min-icon": {
        width: 12,
        marginLeft: (props: RBIconProps) => (props.text ? "5px" : "0px"),
        "@media (max-width: 900px)": {
          width: 16,
          marginLeft: "0px !important",
        },
      },
    },
  };
});

const RBIconButton = (props: RBIconProps) => {
  const classes = useStyles(props);

  const {
    onClick,
    text = "",
    disabled = false,
    tooltip,
    icon = null,
    className = "",
    showLabelAlways = false,
    ...restProps
  } = props;

  return (
    <BoxIconButton
      className={className}
      classes={classes}
      tooltip={tooltip || text}
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      size="medium"
      sx={{
        "& span": {
          fontSize: 14,
          "@media (max-width: 900px)": {
            "&:not(.MuiBadge-root, .MuiBadge-badge)": {
              display: showLabelAlways ? "inline" : "none",
              marginRight: showLabelAlways ? "7px" : "",
            },
          },
        },
      }}
      {...restProps}
    >
      {text !== "" && (
        <Fragment>
          <span>{text}</span>
        </Fragment>
      )}
      {icon}
    </BoxIconButton>
  );
};
export default RBIconButton;
