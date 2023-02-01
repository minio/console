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
import { servicesList } from "./utils";
import {
  settingsCommon,
  typesSelection,
} from "../Common/FormComponents/common/styleLibrary";
import PageLayout from "../Common/Layout/PageLayout";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import ContentBox from "../Common/ContentBox";
import { Box } from "@mui/material";
import NotificationEndpointTypeSelectorHelpBox from "../Account/NotificationEndpointTypeSelectorHelpBox";
import { BackLink, PageHeader } from "mds";

interface INotificationTypeSelector {
  classes: any;
}

const withLogos = servicesList.filter((elService) => elService.logo !== "");

const styles = (theme: Theme) =>
  createStyles({
    ...settingsCommon,
    ...typesSelection,
  });

const NotificationTypeSelector = ({ classes }: INotificationTypeSelector) => {
  const navigate = useNavigate();
  return (
    <Fragment>
      <PageHeader
        label={
          <Fragment>
            <BackLink
              label={"Notification Targets"}
              onClick={() => navigate(IAM_PAGES.NOTIFICATIONS_ENDPOINTS)}
            />
          </Fragment>
        }
        actions={<React.Fragment />}
      />
      <PageLayout>
        <Box
          sx={{
            display: "grid",
            padding: "25px",
            gap: "25px",
            gridTemplateColumns: {
              md: "2fr 1.2fr",
              xs: "1fr",
            },
            border: "1px solid #eaeaea",
          }}
        >
          <ContentBox>
            <div style={{ fontSize: 16, fontWeight: 600, paddingBottom: 15 }}>
              Select Target Type
            </div>
            <div className={classes.iconContainer}>
              {withLogos.map((item) => {
                return (
                  <button
                    key={`icon-${item.targetTitle}`}
                    className={classes.lambdaNotif}
                    onClick={() => {
                      navigate(
                        `${IAM_PAGES.NOTIFICATIONS_ENDPOINTS_ADD}/${item.actionTrigger}`
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
          </ContentBox>
          <NotificationEndpointTypeSelectorHelpBox />
        </Box>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(NotificationTypeSelector);
