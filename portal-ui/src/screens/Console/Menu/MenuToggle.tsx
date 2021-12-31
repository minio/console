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

import React, { Suspense } from "react";
import OperatorLogo from "../../../icons/OperatorLogo";
import ConsoleLogo from "../../../icons/ConsoleLogo";
import { VersionIcon } from "../../../icons";
import { Box, IconButton } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";

type MenuToggleProps = {
  isOpen: boolean;
  isOperatorMode: boolean;
  onToggle: (nextState: boolean) => void;
};
const MenuToggle = ({ isOpen, isOperatorMode, onToggle }: MenuToggleProps) => {
  const stateClsName = isOpen ? "wide" : "mini";

  return (
    <Box
      className={`${stateClsName}`}
      sx={{
        marginLeft: "26px",
        marginTop: "28px",
        marginRight: "8px",
        display: "flex",
        minHeight: "36px",

        "&.mini": {
          flexFlow: "column",
          alignItems: "center",
          margin: "auto",
          marginTop: "28px",
        },
        "& .logo": {
          background: "transparent",
          "&.wide": {
            flex: "1",
            "& svg": {
              fill: "white",
              width: 120,
            },
          },
          "&.mini": {
            marginBottom: "5px",
            flex: "1",
            color: "#ffffff",
            "& svg": {
              width: 24,
              fill: "rgba(255, 255, 255, 0.8)",
            },
          },
        },
      }}
    >
      {isOpen ? (
        <div className={`logo ${stateClsName}`}>
          {isOperatorMode ? <OperatorLogo /> : <ConsoleLogo />}
        </div>
      ) : (
        <div className={`logo ${stateClsName}`}>
          <Suspense fallback={<div>...</div>}>
            <VersionIcon />
          </Suspense>
        </div>
      )}

      <IconButton
        className={`${stateClsName}`}
        sx={{
          "&.mini": {
            marginBottom: "10px",
            "&:hover": {
              background: "#081C42",
            },
          },

          "&:hover": {
            borderRadius: "50%",
            background: "#073052",
          },
          "& svg": {
            fill: "#ffffff",
          },
        }}
        onClick={() => {
          if (isOpen) {
            onToggle(false);
          } else {
            onToggle(true);
          }
        }}
        size="small"
      >
        {isOpen ? <ChevronLeft /> : <MenuIcon />}
      </IconButton>
    </Box>
  );
};

export default MenuToggle;
