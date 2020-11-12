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

import React, { useEffect, useState } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import Moment from "react-moment";
import api from "../../../../common/api";
import { Bucket, BucketList } from "../types";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import AddBucket from "./AddBucket";
import DeleteBucket from "./DeleteBucket";
import { MinTablePaginationActions } from "../../../../common/MinTablePaginationActions";
import { CreateIcon } from "../../../../icons";
import { niceBytes } from "../../../../common/utils";
import { AppState } from "../../../../store";
import { connect } from "react-redux";
import { addBucketOpen, addBucketReset } from "../actions";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import PageHeader from "../../Common/PageHeader/PageHeader";

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
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

interface IListBucketsProps {
  classes: any;
  addBucketOpen: typeof addBucketOpen;
  addBucketModalOpen: boolean;
  addBucketReset: typeof addBucketReset;
}

const ListBuckets = ({
  classes,
  addBucketOpen,
  addBucketModalOpen,
  addBucketReset,
}: IListBucketsProps) => {
  const [records, setRecords] = useState<Bucket[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [filterBuckets, setFilterBuckets] = useState<string>("");

  useEffect(() => {
    if (loading) {
      const fetchRecords = () => {
        setLoading(true);
        const offset = page * rowsPerPage;
        api
          .invoke(
            "GET",
            `/api/v1/buckets?offset=${offset}&limit=${rowsPerPage}`
          )
          .then((res: BucketList) => {
            setLoading(false);
            setRecords(res.buckets || []);
            setTotalRecords(!res.buckets ? 0 : res.total);
            setError("");
            // if we get 0 results, and page > 0 , go down 1 page
            if (
              (res.buckets === undefined ||
                res.buckets == null ||
                res.buckets.length === 0) &&
              page > 0
            ) {
              const newPage = page - 1;
              setPage(newPage);
              setLoading(true);
            }
          })
          .catch((err: any) => {
            setLoading(false);
            setError(err);
          });
      };
      fetchRecords();
    }
  }, [loading, page, rowsPerPage]);

  const closeAddModalAndRefresh = (refresh: boolean) => {
    addBucketOpen(false);
    addBucketReset();

    if (refresh) {
      setLoading(true);
    }
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      setLoading(true);
    }
  };

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    setLoading(true);
  }, [page, rowsPerPage]);

  const confirmDeleteBucket = (bucket: string) => {
    setDeleteOpen(true);
    setSelectedBucket(bucket);
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
    { type: "view", to: `/buckets`, sendOnlyId: true },
    { type: "delete", onClick: confirmDeleteBucket, sendOnlyId: true },
  ];

  const offset = page * rowsPerPage;

  const displayParsedDate = (date: string) => {
    return <Moment>{date}</Moment>;
  };

  const filteredRecords = records.filter((b: Bucket) => {
    if (filterBuckets === "") {
      return true;
    } else {
      if (b.name.indexOf(filterBuckets) >= 0) {
        return true;
      } else {
        return false;
      }
    }
  });

  const showInPage = filteredRecords;

  return (
    <React.Fragment>
      {addBucketModalOpen && (
        <AddBucket
          open={addBucketModalOpen}
          closeModalAndRefresh={closeAddModalAndRefresh}
        />
      )}
      {deleteOpen && (
        <DeleteBucket
          deleteOpen={deleteOpen}
          selectedBucket={selectedBucket}
          closeDeleteModalAndRefresh={(refresh: boolean) => {
            closeDeleteModalAndRefresh(refresh);
          }}
        />
      )}
      <PageHeader label={"Buckets"} />
      <Grid container>
        {error !== "" && <span className={classes.error}>{error}</span>}
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12} className={classes.actionsTray}>
            <TextField
              placeholder="Search Buckets"
              className={classes.searchField}
              id="search-resource"
              label=""
              onChange={(val) => {
                setFilterBuckets(val.target.value);
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
                addBucketOpen(true);
              }}
            >
              Create Bucket
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
                {
                  label: "Creation Date",
                  elementKey: "creation_date",
                  renderFunction: displayParsedDate,
                },
                {
                  label: "Size",
                  elementKey: "size",
                  renderFunction: niceBytes,
                  width: 60,
                  contentTextAlign: "right",
                },
              ]}
              isLoading={loading}
              records={showInPage}
              entityName="Buckets"
              idField="name"
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapState = (state: AppState) => ({
  addBucketModalOpen: state.buckets.open,
});

const connector = connect(mapState, {
  addBucketOpen: addBucketOpen,
  addBucketReset: addBucketReset,
});

export default connector(withStyles(styles)(ListBuckets));
