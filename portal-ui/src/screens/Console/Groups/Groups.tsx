// This file is part of MinIO Console Server
// Copyright (c) 2019 MinIO, Inc.
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

import React, { useEffect, useState } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import { Button } from "@material-ui/core";
import { CreateIcon } from "../../../icons";
import api from "../../../common/api";
import { MinTablePaginationActions } from "../../../common/MinTablePaginationActions";
import { GroupsList } from "./types";
import { stringSort } from "../../../utils/sortFunctions";
import AddGroup from "../Groups/AddGroup";
import DeleteGroup from "./DeleteGroup";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import SetPolicy from "../Policies/SetPolicy";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import PageHeader from "../Common/PageHeader/PageHeader";

interface IGroupsProps {
  classes: any;
  openGroupModal: any;
}

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
    paper: {
      // padding: theme.spacing(2),
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
    wrapCell: {
      maxWidth: "200px",
      whiteSpace: "normal",
      wordWrap: "break-word",
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
    ...containerForHeader(theme.spacing(4)),
  });

const Groups = ({ classes }: IGroupsProps) => {
  const [addGroupOpen, setGroupOpen] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [loading, isLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [policyOpen, setPolicyOpen] = useState<boolean>(false);

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

  useEffect(() => {
    isLoading(true);
  }, []);

  useEffect(() => {
    isLoading(true);
  }, [page, rowsPerPage]);

  useEffect(() => {
    if (loading) {
      const fetchRecords = () => {
        const offset = page * rowsPerPage;
        api
          .invoke("GET", `/api/v1/groups?offset=${offset}&limit=${rowsPerPage}`)
          .then((res: GroupsList) => {
            let resGroups: string[] = [];
            if (res.groups !== null) {
              resGroups = res.groups.sort(stringSort);
            }
            setRecords(resGroups);
            const total = !res.total ? 0 : res.total;
            setTotalRecords(total);
            setError("");
            isLoading(false);

            // if we get 0 results, and page > 0 , go down 1 page
            if ((!res.groups || res.groups.length === 0) && page > 0) {
              const newPage = page - 1;
              setPage(newPage);
            }
          })
          .catch((err) => {
            setError(err);
            isLoading(false);
          });
      };
      fetchRecords();
    }
  }, [loading, page, rowsPerPage]);

  const closeAddModalAndRefresh = () => {
    setGroupOpen(false);
    isLoading(true);
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);

    if (refresh) {
      isLoading(true);
    }
  };

  const filteredRecords = records.filter((elementItem) =>
    elementItem.includes(filter)
  );

  const viewAction = (group: any) => {
    setGroupOpen(true);
    setSelectedGroup(group);
  };

  const deleteAction = (group: any) => {
    setDeleteOpen(true);
    setSelectedGroup(group);
  };

  const setPolicyAction = (selectionElement: any): void => {
    setPolicyOpen(true);
    setSelectedGroup(selectionElement);
  };

  const tableActions = [
    { type: "view", onClick: viewAction },
    { type: "description", onClick: setPolicyAction },
    { type: "delete", onClick: deleteAction },
  ];

  return (
    <React.Fragment>
      {addGroupOpen && (
        <AddGroup
          open={addGroupOpen}
          selectedGroup={selectedGroup}
          closeModalAndRefresh={closeAddModalAndRefresh}
        />
      )}
      {deleteOpen && (
        <DeleteGroup
          deleteOpen={deleteOpen}
          selectedGroup={selectedGroup}
          closeDeleteModalAndRefresh={closeDeleteModalAndRefresh}
        />
      )}
      {setPolicyOpen && (
        <SetPolicy
          open={policyOpen}
          selectedGroup={selectedGroup}
          selectedUser={null}
          closeModalAndRefresh={() => {
            setPolicyOpen(false);
          }}
        />
      )}
      <PageHeader label={"Groups"} />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          {error !== "" ? <Grid container>{error}</Grid> : <React.Fragment />}
          <Grid item xs={12} className={classes.actionsTray}>
            <TextField
              placeholder="Search Groups"
              className={classes.searchField}
              id="search-resource"
              label=""
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setFilter(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<CreateIcon />}
              onClick={() => {
                setSelectedGroup(null);
                setGroupOpen(true);
              }}
            >
              Create Group
            </Button>
          </Grid>

          <Grid item xs={12}>
            <br />
          </Grid>
          <Grid item xs={12}>
            <TableWrapper
              itemActions={tableActions}
              columns={[{ label: "Name", elementKey: "" }]}
              isLoading={loading}
              records={filteredRecords}
              entityName="Groups"
              idField=""
              paginatorConfig={{
                rowsPerPageOptions: [5, 10, 25],
                colSpan: 3,
                count: totalRecords,
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
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(Groups);
