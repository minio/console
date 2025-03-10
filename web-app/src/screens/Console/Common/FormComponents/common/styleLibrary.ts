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

export const modalStyleUtils: any = {
  modalButtonBar: {
    marginTop: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalFormScrollable: {
    maxHeight: "calc(100vh - 300px)",
    overflowY: "auto",
    paddingTop: 10,
  },
};
