import React from "react";
import s3Regions from "./s3-regions.json";
import gcsRegions from "./gcs-regions.json";
import azRegions from "./azure-regions.json";
import { Autocomplete, Box, TextField } from "@mui/material";

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
            filterText
          )
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
                  fontSize: "16px",
                  fontWeight: 500,
                },
                "& .value": {
                  fontSize: "12px",
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
