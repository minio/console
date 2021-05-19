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

import React, { useEffect, useState, Fragment } from "react";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Moment from "react-moment";
import { Bucket, BucketList, HasPermissionResponse } from "../types";
import { CreateIcon } from "../../../../icons";
import { niceBytes } from "../../../../common/utils";
import { AppState } from "../../../../store";
import { addBucketOpen, addBucketReset } from "../actions";
import { setErrorSnackMessage } from "../../../../actions";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import AddBucket from "./AddBucket";
import DeleteBucket from "./DeleteBucket";
import PageHeader from "../../Common/PageHeader/PageHeader";
import BulkReplicationModal from "./BulkReplicationModal";

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
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const ListBuckets = ({
  classes,
  addBucketOpen,
  addBucketModalOpen,
  addBucketReset,
  setErrorSnackMessage,
}: IListBucketsProps) => {
  const [records, setRecords] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [filterBuckets, setFilterBuckets] = useState<string>("");
  const [loadingPerms, setLoadingPerms] = useState<boolean>(true);
  const [canCreateBucket, setCanCreateBucket] = useState<boolean>(false);
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);
  const [replicationModalOpen, setReplicationModalOpen] =
    useState<boolean>(false);

  // check the permissions for creating bucket
  useEffect(() => {
    if (loadingPerms) {
      api
        .invoke("POST", `/api/v1/has-permission`, {
          actions: [
            {
              id: "createBucket",
              action: "s3:CreateBucket",
            },
          ],
        })
        .then((res: HasPermissionResponse) => {
          setLoadingPerms(false);
          if (!res.permissions) {
            return;
          }
          const actions = res.permissions ? res.permissions : [];

          let canCreate = actions.find((s) => s.id === "createBucket");
          if (canCreate && canCreate.can) {
            setCanCreateBucket(true);
          } else {
            setCanCreateBucket(false);
          }

          setLoadingPerms(false);
        })
        .catch((err: any) => {
          setLoadingPerms(false);
          setErrorSnackMessage(err);
        });
    }
  }, [loadingPerms, setErrorSnackMessage]);

  useEffect(() => {
    if (loading) {
      const fetchRecords = () => {
        setLoading(true);
        api
          .invoke("GET", `/api/v1/buckets`)
          .then((res: BucketList) => {
            setLoading(false);
            setRecords(res.buckets || []);
          })
          .catch((err: any) => {
            setLoading(false);
            setErrorSnackMessage(err);
          });
      };
      fetchRecords();
    }
  }, [loading, setErrorSnackMessage]);

  const closeAddModalAndRefresh = (refresh: boolean) => {
    addBucketOpen(false);
    addBucketReset();

    if (refresh) {
      setLoading(true);
      setSelectedBuckets([]);
    }
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      setLoading(true);
      setSelectedBuckets([]);
    }
  };

  const confirmDeleteBucket = (bucket: string) => {
    setDeleteOpen(true);
    setSelectedBucket(bucket);
  };

  const tableActions = [
    { type: "view", to: `/buckets`, sendOnlyId: true },
    { type: "delete", onClick: confirmDeleteBucket, sendOnlyId: true },
  ];

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

  const selectListBuckets = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = e.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: string[] = [...selectedBuckets]; // We clone the selectedBuckets array

    if (checked) {
      // If the user has checked this field we need to push this to selectedBucketsList
      elements.push(value);
    } else {
      // User has unchecked this field, we need to remove it from the list
      elements = elements.filter((element) => element !== value);
    }
    setSelectedBuckets(elements);

    return elements;
  };

  const closeBulkReplicationModal = (unselectAll: boolean) => {
    setReplicationModalOpen(false);

    if (unselectAll) {
      setSelectedBuckets([]);
    }
  };

  return (
    <Fragment>
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
      {replicationModalOpen && (
        <BulkReplicationModal
          open={replicationModalOpen}
          buckets={selectedBuckets}
          closeModalAndRefresh={closeBulkReplicationModal}
        />
      )}
      <PageHeader label={"Buckets"} />
      <Grid container>
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
              startIcon={<FileCopyIcon />}
              onClick={() => {
                setReplicationModalOpen(true);
              }}
              disabled={selectedBuckets.length === 0}
            >
              Set Replication
            </Button>
            {canCreateBucket && (
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
            )}
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
              records={filteredRecords}
              entityName="Buckets"
              idField="name"
              selectedItems={selectedBuckets}
              onSelect={selectListBuckets}
            />
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  addBucketModalOpen: state.buckets.open,
});

const connector = connect(mapState, {
  addBucketOpen,
  addBucketReset,
  setErrorSnackMessage,
});

export default connector(withStyles(styles)(ListBuckets));
