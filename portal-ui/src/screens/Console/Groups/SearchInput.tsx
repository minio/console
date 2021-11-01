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

import React, { ChangeEvent } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "../../../icons/SearchIcon";
import TextField from "@mui/material/TextField";
import {
  actionsTray,
  searchField
} from "../Common/FormComponents/common/styleLibrary";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";


const styles = (theme: Theme) =>
  createStyles({
    ...searchField,
    ...actionsTray,
    searchFieldLabel: {
      marginRight: "10px",
      fontSize: "0.8rem"
    }
  });

type SearchInputProps = {
  classes?: any,
  onChange: (value: string) => void
}
const SearchInput = ({ classes = {}, onChange }: SearchInputProps) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent={"flex-end"}
      alignItems="center"
      className={classes.actionHeaderItems}
    >
      <Box display={{ xs: "none", sm: "none", md: "block" }}>
        <Grid item>
          <div className={classes.searchFieldLabel}>
            Search Groups:
          </div>
        </Grid>
      </Box>
      <Box display={{ xs: "none", sm: "block", md: "block" }} marginRight={10}>
        <TextField
          placeholder=""
          className={classes.searchField}
          label=""
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
          }}
          variant="standard"
        />
      </Box>
    </Grid>
  );
};

export default withStyles(styles)(SearchInput);
