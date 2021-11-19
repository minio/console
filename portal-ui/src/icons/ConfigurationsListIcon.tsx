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

import React, { SVGProps } from "react";

const ConfigurationsListIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
    >
      <rect width="1.433" height="1" />
      <rect width="7.828" height="1" transform="translate(2.172)" />
      <rect width="1.433" height="1" transform="translate(0 6)" />
      <rect width="1.433" height="1" transform="translate(0 3)" />
      <rect width="1.433" height="1" transform="translate(0 9)" />
      <rect width="1.368" height="0.569" transform="translate(6.316 9)" />
      <path d="M5.566,9.569v-.31l-.238-.138-.269.155-.65.375L4.034,9V9H2.172v1H5.566Z" />
      <path d="M9.966,9l-.375.65-.65-.375-.269-.155-.238.138V10H10V9H9.967Z" />
      <path d="M3.625,6.793l.269-.155V6.362l-.269-.155L3.266,6H2.172V7H3.266Z" />
      <path d="M8.434,3.431v.31l.238.138.269-.155.649-.375L9.966,4V4H10V3H8.434Z" />
      <path d="M4.034,4l.375-.65.65.375.269.155.238-.138V3H2.172V4H4.033Z" />
      <path d="M9.356,5.929,10,5.558,9.316,4.373l-.644.372-.988-.571V3.431H6.316v.743l-.988.571-.644-.372L4,5.558l.644.371V7.071L4,7.442l.684,1.185.644-.372.988.571v.743H7.684V8.826l.988-.571.644.372L10,7.442l-.644-.371ZM7,7.278A.778.778,0,1,1,7.778,6.5.779.779,0,0,1,7,7.278Z" />
    </svg>
  );
};

export default ConfigurationsListIcon;
