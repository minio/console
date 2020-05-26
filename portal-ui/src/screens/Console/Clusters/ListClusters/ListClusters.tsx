// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { Button } from "@material-ui/core";
import { CreateIcon } from "../../../../icons";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import { MinTablePaginationActions } from "../../../../common/MinTablePaginationActions";
import AddCluster from "./AddCluster";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import DeleteCluster from "./DeleteCluster";
import { Link } from "react-router-dom";

interface IClustersList {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },

    addSideBar: {
      width: "320px",
      padding: "20px",
    },
    errorBlock: {
      color: "red",
    },
    tableToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0),
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    actionsTray: {
      textAlign: "right",
      "& button": {
        marginLeft: 10,
      },
    },
    searchField: {
      background: "#FFFFFF",
      padding: 12,
      borderRadius: 5,
      boxShadow: "0px 3px 6px #00000012",
    },
  });

const ListClusters = ({ classes }: IClustersList) => {
  const [createClusterOpen, setCreateClusterOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterClusters, setFilterClusters] = useState<string>("");
  const [records, setRecords] = useState<any[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  const closeAddModalAndRefresh = (reloadData: boolean) => {
    setCreateClusterOpen(false);

    if (reloadData) {
      setIsLoading(true);
    }
  };

  const closeDeleteModalAndRefresh = (reloadData: boolean) => {
    setDeleteOpen(false);

    if (reloadData) {
      setIsLoading(true);
    }
  };

  const confirmDeleteCluster = (cluster: string) => {
    setSelectedCluster(cluster);
    setDeleteOpen(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rPP = parseInt(event.target.value, 10);
    setPage(0);
    setRowsPerPage(rPP);
  };

  const tableActions = [
    { type: "view", to: `/clusters`, sendOnlyId: true },
    { type: "delete", onClick: confirmDeleteCluster, sendOnlyId: true },
  ];

  const filteredRecords = records
    .slice(offset, offset + rowsPerPage)
    .filter((b: any) => {
      if (filterClusters === "") {
        return true;
      } else {
        if (b.name.indexOf(filterClusters) >= 0) {
          return true;
        } else {
          return false;
        }
      }
    });

  return (
    <React.Fragment>
      {createClusterOpen && (
        <AddCluster
          open={createClusterOpen}
          closeModalAndRefresh={closeAddModalAndRefresh}
        />
      )}
      {deleteOpen && (
        <DeleteCluster
          deleteOpen={deleteOpen}
          selectedCluster={selectedCluster}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h6">Clusters</Typography>
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>
        <Grid item xs={12} className={classes.actionsTray}>
          <TextField
            placeholder="Search Clusters"
            className={classes.searchField}
            id="search-resource"
            label=""
            onChange={(val) => {
              setFilterClusters(val.target.value);
            }}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<CreateIcon />}
            onClick={() => {
              setCreateClusterOpen(true);
            }}
          >
            Create Cluster
          </Button>
        </Grid>
        <Grid item xs={12}>
          <br />
        </Grid>
        <Grid item xs={12}>
          <TableWrapper
            itemActions={tableActions}
            columns={[
              { label: "Name", elementKey: "name" },
              { label: "Capacity", elementKey: "capacity" },
              { label: "# of Zones", elementKey: "zones_counter" },
            ]}
            isLoading={isLoading}
            records={filteredRecords}
            entityName="Clusters"
            idField="name"
            paginatorConfig={{
              rowsPerPageOptions: [5, 10, 25],
              colSpan: 3,
              count: filteredRecords.length,
              rowsPerPage: rowsPerPage,
              page: page,
              SelectProps: {
                inputProps: { "aria-label": "rows per page" },
                native: true,
              },
              onChangePage: handleChangePage,
              onChangeRowsPerPage: handleChangeRowsPerPage,
              ActionsComponent: MinTablePaginationActions,
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(ListClusters);
