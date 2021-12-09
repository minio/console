import React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "../../../icons/SearchIcon";
import TextField from "@mui/material/TextField";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { searchField } from "./FormComponents/common/styleLibrary";

const styles = (theme: Theme) =>
  createStyles({
    searchField: {
      ...searchField.searchField,
    },
    adornment: {},
  });

type SearchBoxProps = {
  placeholder?: string;
  classes: any;
  onChange: (value: string) => void;
  adornmentPosition?: "start" | "end";
  overrideClass?: any;
};

const SearchBox = ({
  placeholder = "",
  classes,
  onChange,
  adornmentPosition = "end",
  overrideClass,

}: SearchBoxProps) => {
  const inputProps = {
    disableUnderline: true,
    [`${adornmentPosition}Adornment`]: (
      <InputAdornment
        position={adornmentPosition}
        className={classes.adornment}
      >
        <SearchIcon />
      </InputAdornment>
    ),
  };
  return (
    <TextField
      placeholder={placeholder}
      className={overrideClass? overrideClass : classes.searchField}
      id="search-resource"
      label=""
      InputProps={inputProps}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      variant="standard"
    />
  );
};

export default withStyles(styles)(SearchBox);
