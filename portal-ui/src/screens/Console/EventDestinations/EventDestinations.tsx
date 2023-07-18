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

import withSuspense from "../Common/Components/withSuspense";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../HelpMenu";
import { setHelpName } from "../../../systemSlice";
import { useAppDispatch } from "../../../store";

const ListNotificationEndpoints = withSuspense(
  React.lazy(() => import("./ListEventDestinations")),
);

const EventDestinations = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHelpName("event_destinations"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Fragment>
      <PageHeaderWrapper label="Event Destinations" actions={<HelpMenu />} />
      <ListNotificationEndpoints />
    </Fragment>
  );
};

export default EventDestinations;
