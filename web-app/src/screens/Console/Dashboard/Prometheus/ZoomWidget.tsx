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

import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { IDashboardPanel } from "./types";
import { componentToUse } from "./widgetUtils";
import { closeZoomPage } from "../dashboardSlice";
import { useAppDispatch } from "../../../../store";

interface IZoomWidget {
  widgetRender: number;
  value: IDashboardPanel | null;
  modalOpen: boolean;
  timeStart: any;
  timeEnd: any;
  apiPrefix: string;
}

const ZoomWidget = ({
  value,
  modalOpen,
  timeStart,
  timeEnd,
  apiPrefix,
}: IZoomWidget) => {
  const dispatch = useAppDispatch();
  if (!value) {
    return null;
  }

  return (
    <ModalWrapper
      title={value.title}
      onClose={() => {
        dispatch(closeZoomPage());
      }}
      modalOpen={modalOpen}
      wideLimit={false}
      sx={{
        padding: 0,
      }}
    >
      <Fragment>
        {componentToUse(value, timeStart, timeEnd, true, apiPrefix, true)}
      </Fragment>
    </ModalWrapper>
  );
};

export default ZoomWidget;
