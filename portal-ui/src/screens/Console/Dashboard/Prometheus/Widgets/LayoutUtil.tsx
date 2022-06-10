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

import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

export type DLayoutColumnProps = {
  componentId: number;
  sx?: SxProps<Theme>;
};
export type DLayoutRowProps = {
  sx?: SxProps<Theme>;
  columns: DLayoutColumnProps[];
};

export const summaryPanelsLayout: DLayoutRowProps[] = [
  {
    sx: {
      minWidth: 0,
      display: "grid",
      gridTemplateColumns: {
        md: "1fr 1fr 1fr 1fr",
        sm: "1fr 1fr",
        xs: "1fr",
      },
      gap: "30px",
    },
    columns: [
      {
        componentId: 66,
      },
      {
        componentId: 44,
      },
      {
        componentId: 500,
      },
      {
        componentId: 501,
      },
    ],
  },
  {
    sx: {
      display: "grid",
      minWidth: 0, // important to avoid css grid blow out.
      gridTemplateColumns: {
        md: "1fr 1fr",
        xs: "1fr",
      },
      gap: "30px",
    },
    columns: [
      {
        componentId: 50,
      },
      {
        componentId: 502,
      },
    ],
  },
  {
    sx: {
      display: "grid",
      minWidth: 0,
      gridTemplateColumns: {
        md: "1fr 1fr 1fr",
        xs: "1fr",
      },
      gap: "30px",
    },
    columns: [
      {
        componentId: 80,
      },
      {
        componentId: 81,
      },
      {
        componentId: 1,
      },
    ],
  },
  {
    sx: {
      display: "grid",
      minWidth: 0,
      gridTemplateColumns: {
        sm: "1fr 1fr",
        xs: "1fr",
      },
      gap: "30px",
    },
    columns: [
      {
        componentId: 68,
      },
      {
        componentId: 52,
      },
    ],
  },
  {
    sx: {
      display: "grid",
      minWidth: 0,
      gridTemplateColumns: {
        sm: "1fr 1fr",
        xs: "1fr",
      },
      gap: "30px",
    },
    columns: [
      {
        componentId: 63,
      },
      {
        componentId: 70,
      },
    ],
  },
];

export const trafficPanelsLayout: DLayoutRowProps[] = [
  {
    sx: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "30px",
    },
    columns: [
      {
        componentId: 60,
      },
    ],
  },
  {
    sx: {
      display: "grid",
      minWidth: 0,
      gridTemplateColumns: {
        sm: "1fr 1fr",
        xs: "1fr",
      },
      gap: "30px",
    },
    columns: [
      {
        componentId: 71,
        sx: {
          flex: 1,
          width: "50%",
          flexShrink: 0,
        },
      },
      {
        componentId: 17,
        sx: {
          flex: 1,
          width: "50%",
          flexShrink: 0,
        },
      },
    ],
  },
  {
    sx: {
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "30px",
    },
    columns: [
      {
        componentId: 73,
      },
    ],
  },
];

export const resourcesPanelsLayout: DLayoutRowProps[] = [
  {
    sx: {
      display: "grid",
      minWidth: 0,
      gridTemplateColumns: "1fr 1fr",
      gap: "30px",
    },
    columns: [
      {
        componentId: 76,
      },
      {
        componentId: 77,
      },
    ],
  },
  {
    sx: {
      display: "grid",
      minWidth: 0,
      gridTemplateColumns: "1fr 1fr",
      gap: "30px",
    },
    columns: [
      {
        componentId: 82,
      },
      {
        componentId: 74,
      },
    ],
  },
];
export const resourcesPanelsLayoutAdvanced: DLayoutRowProps[] = [
  {
    sx: {
      display: "grid",
      minWidth: 0,
      gridTemplateColumns: "1fr 1fr",
      gap: "30px",
    },
    columns: [
      {
        componentId: 11,
      },
      {
        componentId: 8,
      },
    ],
  },
];

export const RowPanelLayout = ({ children }: { children: any }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "30px",
      }}
    >
      {children}
    </Box>
  );
};
