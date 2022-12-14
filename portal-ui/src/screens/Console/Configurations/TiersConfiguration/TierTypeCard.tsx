// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { Box } from "@mui/material";

import { Button } from "@mui/material";

type TierTypeCardProps = {
  onClick: (name: string) => void;
  icon?: any;
  name: string;
};
const TierTypeCard = ({ onClick, icon, name }: TierTypeCardProps) => {
  return (
    <Button
      onClick={() => {
        onClick(name);
      }}
      sx={{
        height: "10px",
        width: "275px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 5,
        border: "1px solid #E5E5E5",
        borderRadius: 2,
        cursor: "pointer",
        "&:hover": {
          background: "#ebebeb",
        },
      }}
    >
      {icon ? (
        <Box
          sx={{
            "& .min-icon": {
              height: "30px",
              width: "30px",
            },
          }}
        >
          {icon}
        </Box>
      ) : null}

      <div
        style={{
          fontWeight: 600,
          marginLeft: 20,
          fontSize: 14,
        }}
      >
        {name}
      </div>
    </Button>
  );
};

export default TierTypeCard;
