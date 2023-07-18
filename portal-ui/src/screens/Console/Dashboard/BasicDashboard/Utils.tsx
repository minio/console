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

export const STATUS_COLORS = {
  RED: "#C83B51",
  GREEN: "#4CCB92",
  YELLOW: "#E7A219",
};

export const getDriveStatusColor = (
  activeDisks: number,
  totalDrives: number,
) => {
  if (activeDisks <= totalDrives / 2) {
    return STATUS_COLORS.RED;
  }
  if (totalDrives !== 2 && activeDisks === totalDrives / 2 + 1) {
    return STATUS_COLORS.YELLOW;
  }
  if (activeDisks === totalDrives) {
    return STATUS_COLORS.GREEN;
  }
};

export const serverStatusColor = (health_status: string) => {
  switch (health_status) {
    case "offline":
      return STATUS_COLORS.RED;
    case "online":
      return STATUS_COLORS.GREEN;
    default:
      return STATUS_COLORS.YELLOW;
  }
};
export const getNetworkStatusColor = (
  activeNetwork: number,
  networkTotal: number,
) => {
  if (activeNetwork <= networkTotal / 2) {
    return STATUS_COLORS.RED;
  }
  if (activeNetwork === networkTotal / 2 + 1) {
    return STATUS_COLORS.YELLOW;
  }
  if (activeNetwork === networkTotal) {
    return STATUS_COLORS.GREEN;
  }
};
