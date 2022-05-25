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
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";

interface IGeneralUsePaginator {
  classes: any;
  page: number;
  itemsPerPage?: number;
  entity: string;
  totalItems: number;
  onChange: (newPage: number) => void;
}

const styles = (theme: Theme) =>
  createStyles({
    paginatorContainer: {
      margin: "10px 0 18px",
      flexWrap: "wrap",
    },
    paginatorInformation: {
      color: "#848484",
      fontSize: 12,
      fontStyle: "italic",
      whiteSpace: "nowrap",
    },
    paginatorEntity: {
      color: "#767676",
      fontSize: 12,
      fontWeight: "bold",
    },
    paginationElement: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      color: "#848484",
      fontSize: 12,
    },
  });

const paginatorStyling = makeStyles({
  ul: {
    "& .MuiPaginationItem-root": {
      color: "#07193E",
      fontSize: 14,
      "&.Mui-selected": {
        backgroundColor: "transparent",
        fontWeight: "bold",
        "&::after": {
          backgroundColor: "#07193E",
          width: "100%",
          height: 3,
          content: '" "',
          position: "absolute",
          bottom: -3,
        },
      },
    },
  },
});

const GeneralUsePaginator = ({
  classes,
  page = 1,
  itemsPerPage = 5,
  entity,
  totalItems,
  onChange,
}: IGeneralUsePaginator) => {
  const paginatorStyles = paginatorStyling();

  const currentInitialItem = page * itemsPerPage - itemsPerPage + 1;
  const currentEndItem = currentInitialItem + itemsPerPage - 1;
  const displayCurrentEndItem =
    currentEndItem > totalItems ? totalItems : currentEndItem;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Fragment>
      <Grid container className={classes.paginatorContainer}>
        <Grid item xs={6}>
          <span className={classes.paginatorEntity}>{entity}</span>
          <br />
          <span className={classes.paginatorInformation}>
            Showing{" "}
            {totalPages > 1 ? (
              <Fragment>
                {currentInitialItem} - {displayCurrentEndItem} out of{" "}
              </Fragment>
            ) : null}
            {totalItems} Total {entity}
          </span>
        </Grid>
        <Grid item xs={6} className={classes.paginationElement}>
          {totalPages > 1 && (
            <Fragment>
              Go to:{" "}
              <Pagination
                count={totalPages}
                variant={"text"}
                siblingCount={3}
                page={page}
                size="small"
                hideNextButton
                hidePrevButton
                onChange={(_, newPage: number) => {
                  onChange(newPage);
                }}
                classes={{ ul: paginatorStyles.ul }}
              />
            </Fragment>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(GeneralUsePaginator);
