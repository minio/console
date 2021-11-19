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

const ClustersIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 9"
    >
      <path d="M1.1 3.979h7.8v1H1.1z" />
      <path d="M2.607 7.618l3.9-6.756.865.5-3.899 6.756z" />
      <path d="M2.602 1.348l.866-.5 3.9 6.755-.865.5z" />
      <path d="M7.2 8.379H2.7l-2.2-3.9 2.2-3.9h4.5l2.2 3.9-2.2 3.9zm-3.9-1h3.3l1.7-2.9-1.7-2.9H3.3l-1.7 2.9 1.7 2.9z" />
      <path d="M6.7 4.479c0 .9-.7 1.7-1.7 1.7-.9 0-1.7-.7-1.7-1.7 0-.9.7-1.7 1.7-1.7.9 0 1.7.8 1.7 1.7zM2.2 4.479c0 .6-.5 1.1-1.1 1.1-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1zM10 4.479c0 .6-.5 1.1-1.1 1.1-.6 0-1.1-.5-1.1-1.1 0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1zM3.6 6.879c.5.3.7 1 .4 1.5-.3.5-1 .7-1.5.4-.5-.3-.7-1-.4-1.5.3-.5 1-.7 1.5-.4zM7.5.179c.5.3.7 1 .4 1.5-.3.5-1 .7-1.5.4-.5-.3-.7-1-.4-1.5.3-.6 1-.7 1.5-.4zM6.4 6.879c.5-.3 1.2-.1 1.5.4.3.5.1 1.2-.4 1.5-.5.3-1.2.1-1.5-.4-.3-.5-.1-1.2.4-1.5zM2.5.179c.5-.3 1.2-.1 1.5.4.3.5.1 1.2-.4 1.5-.5.3-1.2.1-1.5-.4-.3-.5-.1-1.2.4-1.5z" />
    </svg>
  );
};

export default ClustersIcon;
