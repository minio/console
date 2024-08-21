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

import React, { Fragment } from "react";
import styled from "styled-components";
import get from "lodash/get";
import { Box } from "mds";
import { Link } from "react-router-dom";
import { widgetCommon } from "../Common/FormComponents/common/styleLibrary";

interface ISubInterface {
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
}

const CommonCardItem = styled.div(({ theme }) => ({
  ...widgetCommon(theme),
  "& .metricText": {
    fontSize: 70,
    lineHeight: 1.1,
    color: get(theme, "signalColors.main", "#07193E"),
    fontWeight: "bold",
  },
  "& .unitText": {
    fontSize: 10,
    color: get(theme, "mutedText", "#87888d"),
    fontWeight: "normal",
  },
  "& .subHeaderContainer": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  "& .subMessage": {
    fontSize: 10,
    color: get(theme, "mutedText", "#87888d"),
    "&.bold": {
      fontWeight: "bold",
    },
  },
  "& .headerContainer": {
    display: "flex",
    justifyContent: "space-between",
  },
  "& .viewAll": {
    fontSize: 10,
    color: get(theme, "signalColors.danger", "#C83B51"),
    textTransform: "capitalize",

    "& a, & a:hover, & a:visited, & a:active": {
      color: get(theme, "signalColors.danger", "#C83B51"),
    },
  },
}));

const CommonCard = ({
  title,
  metricValue,
  metricUnit,
  subMessage,
  moreLink,
  rightComponent,
  extraMargin = false,
}: ICommonCard) => {
  const SubHeader = () => {
    return (
      <Fragment>
        <div className={"subHeaderContainer"}>
          <div className={"leftSide"}>
            <div>
              <span className={"metricText"}>
                {metricValue}
                <span className={"unitText"}>{metricUnit}</span>
              </span>
            </div>
            {subMessage && (
              <Box
                sx={{
                  fontWeight: subMessage.fontWeight || "normal",
                }}
              >
                {subMessage.message}
              </Box>
            )}
          </div>
          <div className={"rightSide"}>{rightComponent}</div>
        </div>
      </Fragment>
    );
  };

  const Header = () => {
    return (
      <Fragment>
        <div className={"headerContainer"}>
          <span className={"titleContainer"}>{title}</span>
          {moreLink && (
            <Fragment>
              <span className={"viewAll"}>
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
      <Box
        withBorders
        sx={{
          height: 200,
          padding: 16,
          margin: extraMargin ? "10px 20px 10px 0" : "",
        }}
      >
        {metricValue !== "" && (
          <CommonCardItem>
            <Header />
            <SubHeader />
          </CommonCardItem>
        )}
      </Box>
    </Fragment>
  );
};

export default CommonCard;
