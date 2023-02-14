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
import { Theme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { destinationList, DestType } from "./utils";
import {
  settingsCommon,
  typesSelection,
} from "../Common/FormComponents/common/styleLibrary";
import PageLayout from "../Common/Layout/PageLayout";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import { Box } from "@mui/material";
import NotificationEndpointTypeSelectorHelpBox from "../Account/NotificationEndpointTypeSelectorHelpBox";
import { BackLink } from "mds";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";

interface INotificationTypeSelector {
  classes: any;
}

const withLogos = destinationList.filter((elService) => elService.logo !== "");
const database = withLogos.filter(
  (elService) => elService.category === DestType.DB
);
const queue = withLogos.filter(
  (elService) => elService.category === DestType.Queue
);
const functions = withLogos.filter(
  (elService) => elService.category === DestType.Func
);

const styles = (theme: Theme) =>
  createStyles({
    ...settingsCommon,
    ...typesSelection,
  });

const EventTypeSelector = ({ classes }: INotificationTypeSelector) => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <PageHeaderWrapper
        label={
          <Fragment>
            <BackLink
              label={"Event Destinations"}
              onClick={() => navigate(IAM_PAGES.EVENT_DESTINATIONS)}
            />
          </Fragment>
        }
        actions={<React.Fragment />}
      />
      <PageLayout>
        <Box
          sx={{
            display: "grid",
            padding: "16px",
            gap: "8px",
            gridTemplateColumns: {
              md: "2fr 1.2fr",
              xs: "1fr",
            },
            border: "1px solid #eaeaea",
          }}
        >
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, paddingBottom: 15 }}>
              Queue
            </div>
            <div className={classes.iconContainer}>
              {queue.map((item) => {
                return (
                  <button
                    key={`icon-${item.targetTitle}`}
                    className={classes.lambdaNotif}
                    onClick={() => {
                      navigate(
                        `${IAM_PAGES.EVENT_DESTINATIONS_ADD}/${item.actionTrigger}`
                      );
                    }}
                  >
                    <div className={classes.lambdaNotifIcon}>
                      <img
                        src={item.logo}
                        className={classes.logoButton}
                        alt={item.targetTitle}
                      />
                    </div>

                    <div className={classes.lambdaNotifTitle}>
                      <b>{item.targetTitle}</b>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, paddingBottom: 15 }}>
              Database
            </div>
            <div className={classes.iconContainer}>
              {database.map((item) => {
                return (
                  <button
                    key={`icon-${item.targetTitle}`}
                    className={classes.lambdaNotif}
                    onClick={() => {
                      navigate(
                        `${IAM_PAGES.EVENT_DESTINATIONS_ADD}/${item.actionTrigger}`
                      );
                    }}
                  >
                    <div className={classes.lambdaNotifIcon}>
                      <img
                        src={item.logo}
                        className={classes.logoButton}
                        alt={item.targetTitle}
                      />
                    </div>

                    <div className={classes.lambdaNotifTitle}>
                      <b>{item.targetTitle}</b>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, paddingBottom: 15 }}>
              Functions
            </div>
            <div className={classes.iconContainer}>
              {functions.map((item) => {
                return (
                  <button
                    key={`icon-${item.targetTitle}`}
                    className={classes.lambdaNotif}
                    onClick={() => {
                      navigate(
                        `${IAM_PAGES.EVENT_DESTINATIONS_ADD}/${item.actionTrigger}`
                      );
                    }}
                  >
                    <div className={classes.lambdaNotifIcon}>
                      <img
                        src={item.logo}
                        className={classes.logoButton}
                        alt={item.targetTitle}
                      />
                    </div>

                    <div className={classes.lambdaNotifTitle}>
                      <b>{item.targetTitle}</b>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <NotificationEndpointTypeSelectorHelpBox />
        </Box>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(EventTypeSelector);
