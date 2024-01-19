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

// This object contains variables that will be used across form components.

import React from "react";
import { Box } from "mds";
import { replaceUnicodeChar } from "../../../../../../common/utils";

interface IIconWithLabel {
  icon: React.ReactNode;
  strings: string[];
}

const IconWithLabel = ({ icon, strings }: IIconWithLabel) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        "& .min-icon": {
          width: 16,
          height: 16,
          marginRight: 4,
          minWidth: 16,
          minHeight: 16,
        },
        "& .fileNameText": {
          whiteSpace: "pre",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }}
    >
      {icon}
      <span className={"fileNameText"}>
        {replaceUnicodeChar(strings[strings.length - 1])}
      </span>
    </Box>
  );
};

export default IconWithLabel;
