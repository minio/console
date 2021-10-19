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

import { IDashboardPanel } from "./Prometheus/types";

export const DASHBOARD_OPEN_ZOOM = "DASHBOARD/OPEN_ZOOM";
export const DASHBOARD_CLOSE_ZOOM = "DASHBOARD/CLOSE_ZOOM";

interface OpenChartZoom {
  type: typeof DASHBOARD_OPEN_ZOOM;
  widget: IDashboardPanel;
}

interface CloseChartZoom {
  type: typeof DASHBOARD_CLOSE_ZOOM;
}

export type ZoomActionTypes = OpenChartZoom | CloseChartZoom;

export function openZoomPage(widget: IDashboardPanel) {
  return {
    type: DASHBOARD_OPEN_ZOOM,
    widget,
  };
}

export function closeZoomPage() {
  return {
    type: DASHBOARD_CLOSE_ZOOM,
  };
}
