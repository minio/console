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

import { Autocomplete, Box, TextField } from "@mui/material";

import s3Regions from "./s3-regions";
import gcsRegions from "./gcs-regions";
import azRegions from "./azure-regions";

const getRegions = (type: string): any => {
  if (type === "s3") {
    return s3Regions;
  }
  if (type === "gcs") {
    return gcsRegions;
  }
  if (type === "azure") {
    return azRegions;
  }

  return [];
};

const RegionSelect = ({
  type,
  onChange,
  inputProps,
}: {
  type: "minio" | "s3" | "gcs" | "azure" | "unsupported";
  onChange: (obj: any) => void;
  inputProps?: any;
}) => {
  const regionList = getRegions(type);
  const [value, setValue] = React.useState("");

  return (
    <Autocomplete
      sx={{
        "& .MuiOutlinedInput-root": {
          padding: 0,
          paddingLeft: "10px",
          fontSize: 13,
          fontWeight: 600,
        },
        "& .MuiAutocomplete-inputRoot": {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e5e5e5",
            borderWidth: 1,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#07193E",
            borderWidth: 1,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#07193E",
            borderWidth: 1,
          },
        },
      }}
      freeSolo
      selectOnFocus
      handleHomeEndKeys
      onChange={(event, newValue) => {
        let newVal: any = newValue;

        if (typeof newValue === "string") {
          newVal = {
            label: newValue,
          };
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          newVal = {
            label: newValue.inputValue,
          };
        } else {
          newVal = newValue;
        }
        setValue(newVal);
        onChange(newVal?.value);
      }}
      value={value}
      onInputChange={(e: any) => {
        const { target: { value = "" } = {} } = e || {};
        onChange(value);
      }}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.value;
      }}
      options={regionList}
      filterOptions={(opts: any[], state: any) => {
        const filterText = state.inputValue.toLowerCase();

        return opts.filter((opt) =>
          `${opt.label.toLowerCase()}${opt.value.toLowerCase()}`.includes(
            filterText,
          ),
        );
      }}
      renderOption={(props: any, opt: any) => {
        return (
          <li {...props}>
            <Box
              sx={{
                display: "flex",
                flexFlow: "column",
                alignItems: "baseline",
                padding: "4px",
                borderBottom: "1px solid #eaeaea",
                cursor: "pointer",
                width: "100%",

                "& .label": {
                  fontSize: "13px",
                  fontWeight: 500,
                },
                "& .value": {
                  fontSize: "11px",
                  fontWeight: 400,
                },
              }}
            >
              <span className="label">{opt.value}</span>
              <span className="value">{opt.label}</span>
            </Box>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField {...params} {...inputProps} fullWidth />
      )}
    />
  );
};

export default RegionSelect;
