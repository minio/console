//  This file is part of MinIO Console Server
//  Copyright (c) 2022 MinIO, Inc.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.
import React from "react";
import styled from "styled-components";
import get from "lodash/get";
import { calculateBytes } from "../../../common/utils";

const SpeedTestUnitBase = styled.table(({ theme }) => ({
  "& .objectGeneralTitle": {
    lineHeight: 1,
    fontSize: 50,
    color: get(theme, "mutedText", "#87888d"),
  },
  "& .generalUnit": {
    color: get(theme, "fontColor", "#000"),
    fontSize: 12,
    fontWeight: "bold",
  },
  "& .testUnitRes": {
    fontSize: 60,
    color: get(theme, "signalColors.main", "#07193E"),
    fontWeight: "bold",
    textAlign: "right",
  },
  "& .metricValContainer": {
    lineHeight: 1,
    verticalAlign: "bottom",
  },
  "& .objectsUnitRes": {
    fontSize: 22,
    marginTop: 6,
    color: get(theme, "mutedText", "#87888d"),
    fontWeight: "bold",
    textAlign: "right",
  },
  "& .objectsUnit": {
    color: get(theme, "mutedText", "#87888d"),
    fontSize: 16,
    fontWeight: "bold",
  },
  "& .iconTd": {
    verticalAlign: "bottom",
  },
}));

const SpeedTestUnit = ({
  title,
  icon,
  throughput,
  objects,
}: {
  title: any;
  icon: any;
  throughput: string;
  objects: number;
}) => {
  const avg = calculateBytes(throughput);

  let total = "0";
  let unit = "";

  if (avg.total !== 0) {
    total = avg.total.toString();
    unit = `${avg.unit}/s`;
  }

  return (
    <SpeedTestUnitBase>
      <tr>
        <td className={"objectGeneralTitle"}>{title}</td>
        <td className={"iconTd"}>{icon}</td>
      </tr>
      <tr>
        <td className={`metricValContainer testUnitRes`}>{total}</td>
        <td className={`metricValContainer generalUnit`}>{unit}</td>
      </tr>
      <tr>
        <td className={`metricValContainer objectsUnitRes`}>{objects}</td>
        <td className={`metricValContainer objectsUnit`}>
          {objects !== 0 && "Objs/S"}
        </td>
      </tr>
    </SpeedTestUnitBase>
  );
};
export default SpeedTestUnit;
