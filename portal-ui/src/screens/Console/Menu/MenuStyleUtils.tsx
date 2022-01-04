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

export const menuItemContainerStyles: any = {
  paddingLeft: 0,
  paddingBottom: "18px",
  "&.active div:nth-of-type(1)": {
    border: "2px solid #ffffff",
  },
  "&:hover": {
    background: "none",
    "& div:nth-of-type(1)": {
      background: "#073052",
      "& svg": {
        fill: "#ffffff",
      },
    },
  },
};
export const menuItemIconStyles: any = {
  width: 37,
  minWidth: 37,
  height: 37,
  background: "#00274D",
  border: "2px solid #002148",
  display: "flex",
  alignItems: "center",
  borderRadius: "50%",
  justifyContent: "center",

  "& svg": {
    width: 16,
    height: 16,
    fill: "#8399AB",
  },
};

export const menuItemTextStyles: any = {
  color: "#BCC7D1",
  fontSize: "14px",
  marginLeft: "11px",
  "& span": {
    fontSize: "14px",
  },
  "&.mini": {
    display: "none",
  },
};
