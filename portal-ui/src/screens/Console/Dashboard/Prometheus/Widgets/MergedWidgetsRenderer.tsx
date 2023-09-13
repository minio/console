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

import React from "react";
import { componentToUse } from "../widgetUtils";
import { IDashboardPanel } from "../types";
import MergedWidgets from "../MergedWidgets";
import EntityStateItemRenderer from "./EntityStateItemRenderer";
import NetworkItem from "./NetworkItem";
import DashboardItemBox from "../../DashboardItemBox";

const MergedWidgetsRenderer = ({
  info,
  timeStart,
  timeEnd,
  loading,
  apiPrefix,
}: {
  info: IDashboardPanel;
  timeStart: any;
  timeEnd: any;
  loading: boolean;
  apiPrefix: string;
}) => {
  const { mergedPanels = [], title = "", id } = info;
  const [leftPanel, rightPanel] = mergedPanels;

  const renderById = () => {
    if ([500, 501].includes(id)) {
      return (
        <DashboardItemBox>
          <EntityStateItemRenderer
            info={info}
            timeStart={timeStart}
            timeEnd={timeEnd}
            apiPrefix={apiPrefix}
          />
        </DashboardItemBox>
      );
    }

    if (id === 502) {
      return (
        <DashboardItemBox>
          <NetworkItem
            apiPrefix={apiPrefix}
            timeEnd={timeEnd}
            timeStart={timeStart}
            value={info}
          />
        </DashboardItemBox>
      );
    }

    return (
      <MergedWidgets
        title={title}
        leftComponent={componentToUse(
          leftPanel,
          timeStart,
          timeEnd,
          loading,
          apiPrefix,
        )}
        rightComponent={componentToUse(
          rightPanel,
          timeStart,
          timeEnd,
          loading,
          apiPrefix,
        )}
      />
    );
  };

  return renderById();
};

export default MergedWidgetsRenderer;
