// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import { Card, CardHeader } from "@mui/material";
import { Link } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import makeStyles from "@mui/styles/makeStyles";
import React, { Fragment } from "react";
import { widgetCommon } from "../Common/FormComponents/common/styleLibrary";

export interface ISubInterface {
  message: string;
  fontWeight?: "normal" | "bold";
}

interface ICommonCard {
  title: string;
  metricValue: any;
  metricUnit?: string;
  subMessage?: ISubInterface;
  moreLink?: string;
  rightComponent?: any;
  extraMargin?: boolean;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...widgetCommon,
    cardRoot: {
      ...widgetCommon.singleValueContainer,
      "&.MuiPaper-root": {
        borderRadius: 10,
      },
    },
    cardsContainer: {
      maxHeight: 440,
      overflowY: "auto",
      overflowX: "hidden",
    },
    metricText: {
      fontSize: 70,
      lineHeight: 1.1,
      color: "#07193E",
      fontWeight: "bold",
    },
    unitText: {
      fontSize: 10,
      color: "#767676",
      fontWeight: "normal",
    },
    subHearderContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    subMessage: {
      fontSize: 10,
      color: "#767676",
      "&.bold": {
        fontWeight: "bold",
      },
    },
    headerContainer: {
      display: "flex",
      justifyContent: "space-between",
    },
    viewAll: {
      fontSize: 10,
      color: "#C83B51",
      textTransform: "capitalize",

      "& a, & a:hover, & a:visited, & a:active": {
        color: "#C83B51",
      },
    },
    extraMargin: {
      margin: "10px 20px 10px 0",
    },
  });

const cardSubStyles = makeStyles({
  root: { backgroundColor: "#fff", padding: 0 },
  title: {
    ...widgetCommon.titleContainer,
  },
  content: {
    maxWidth: "100%",
  },
});

const CommonCard = ({
  title,
  metricValue,
  metricUnit,
  subMessage,
  moreLink,
  rightComponent,
  extraMargin = false,
  classes,
}: ICommonCard) => {
  const subStyles = cardSubStyles();
  const SubHeader = () => {
    return (
      <Fragment>
        <div className={classes.subHearderContainer}>
          <div className={classes.leftSide}>
            <div>
              <span className={classes.metricText}>
                {metricValue}
                <span className={classes.unitText}>{metricUnit}</span>
              </span>
            </div>
            {subMessage && (
              <div
                className={`${classes.subMessage} ${
                  subMessage.fontWeight ? subMessage.fontWeight : ""
                }`}
              >
                {subMessage.message}
              </div>
            )}
          </div>
          <div className={classes.rightSide}>{rightComponent}</div>
        </div>
      </Fragment>
    );
  };

  const Header = () => {
    return (
      <Fragment>
        <div className={classes.headerContainer}>
          <span className={classes.title}>{title}</span>
          {moreLink && (
            <Fragment>
              <span className={classes.viewAll}>
                <Link to={moreLink}>View All</Link>
              </span>
            </Fragment>
          )}
        </div>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <Card
        className={`${classes.cardRoot} ${
          extraMargin ? classes.extraMargin : ""
        }`}
      >
        {metricValue !== "" && (
          <CardHeader
            title={<Header />}
            subheader={
              <Fragment>
                <SubHeader />
              </Fragment>
            }
            classes={{
              root: subStyles.root,
              title: subStyles.title,
              content: subStyles.content,
            }}
          />
        )}
      </Card>
    </Fragment>
  );
};

export default withStyles(styles)(CommonCard);
