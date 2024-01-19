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

import React, { Fragment } from "react";
import { InputBox, InputLabel, Box } from "mds";

interface IFilterInputWrapper {
  value: string;
  onChange: (txtVar: string) => any;
  label: string;
  placeholder?: string;
  id: string;
  name: string;
}

const FilterInputWrapper = ({
  label,
  onChange,
  value,
  placeholder = "",
  id,
  name,
}: IFilterInputWrapper) => {
  return (
    <Fragment>
      <Box
        sx={{
          flexGrow: 1,
          margin: "0 15px",
        }}
      >
        <InputLabel>{label}</InputLabel>
        <InputBox
          placeholder={placeholder}
          id={id}
          name={name}
          label=""
          onChange={(val) => {
            onChange(val.target.value);
          }}
          sx={{
            "& input": {
              height: 30,
            },
          }}
          value={value}
        />
      </Box>
    </Fragment>
  );
};

export default FilterInputWrapper;
