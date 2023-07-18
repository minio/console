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

import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BackLink, Box, FormLayout, PageLayout } from "mds";
import { destinationList, DestType } from "./utils";
import { typesSelection } from "../Common/FormComponents/common/styleLibrary";
import { IAM_PAGES } from "../../../common/SecureComponent/permissions";
import NotificationEndpointTypeSelectorHelpBox from "../Account/NotificationEndpointTypeSelectorHelpBox";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import DestinationButton from "./DestinationButton";

import HelpMenu from "../HelpMenu";
import { useAppDispatch } from "../../../store";
import { setHelpName } from "../../../systemSlice";

const withLogos = destinationList.filter((elService) => elService.logo !== "");
const database = withLogos.filter(
  (elService) => elService.category === DestType.DB,
);
const queue = withLogos.filter(
  (elService) => elService.category === DestType.Queue,
);
const functions = withLogos.filter(
  (elService) => elService.category === DestType.Func,
);

const EventTypeSelector = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHelpName("notification_type_selector"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        actions={<HelpMenu />}
      />
      <PageLayout>
        <FormLayout helpBox={<NotificationEndpointTypeSelectorHelpBox />}>
          <Box>
            <Box sx={{ fontSize: 16, fontWeight: 600, paddingBottom: 15 }}>
              Queue
            </Box>
            <Box sx={{ ...typesSelection.iconContainer }}>
              {queue.map((item) => {
                return (
                  <DestinationButton
                    destinationType={item.actionTrigger}
                    srcImage={item.logo}
                    title={item.targetTitle}
                    key={`icon-${item.targetTitle}`}
                  />
                );
              })}
            </Box>
            <Box sx={{ fontSize: 16, fontWeight: 600, paddingBottom: 15 }}>
              Database
            </Box>
            <Box sx={{ ...typesSelection.iconContainer }}>
              {database.map((item) => {
                return (
                  <DestinationButton
                    destinationType={item.actionTrigger}
                    srcImage={item.logo}
                    title={item.targetTitle}
                    key={`icon-${item.targetTitle}`}
                  />
                );
              })}
            </Box>
            <Box sx={{ fontSize: 16, fontWeight: 600, paddingBottom: 15 }}>
              Functions
            </Box>
            <Box sx={{ ...typesSelection.iconContainer }}>
              {functions.map((item) => {
                return (
                  <DestinationButton
                    destinationType={item.actionTrigger}
                    srcImage={item.logo}
                    title={item.targetTitle}
                    key={`icon-${item.targetTitle}`}
                  />
                );
              })}
            </Box>
          </Box>
        </FormLayout>
      </PageLayout>
    </Fragment>
  );
};

export default EventTypeSelector;
