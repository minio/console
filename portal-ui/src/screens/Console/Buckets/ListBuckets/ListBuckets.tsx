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

import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button, LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Bucket, BucketList } from "../types";
import { AddIcon, BucketsIcon } from "../../../../icons";
import { AppState } from "../../../../store";
import { setErrorSnackMessage } from "../../../../actions";
import {
  containerForHeader,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import DeleteBucket from "./DeleteBucket";
import PageHeader from "../../Common/PageHeader/PageHeader";
import BucketListItem from "./BucketListItem";
import BulkReplicationModal from "./BulkReplicationModal";
import HelpBox from "../../../../common/HelpBox";
import { ISessionResponse } from "../../types";
import BoxIconButton from "../../Common/BoxIconButton/BoxIconButton";
import RefreshIcon from "../../../../icons/RefreshIcon";
import AButton from "../../Common/AButton/AButton";
import MultipleBucketsIcon from "../../../../icons/MultipleBucketsIcon";
import SelectMultipleIcon from "../../../../icons/SelectMultipleIcon";
import SecureComponent from "../../../../common/SecureComponent/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import PageLayout from "../../Common/Layout/PageLayout";
import SearchBox from "../../Common/SearchBox";

const styles = (theme: Theme) =>
  createStyles({
    bulkSelect: {
      marginLeft: 8,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
      "&.MuiButton-contained": {
        backgroundColor: theme.palette.primary.main,
      },
    },
    addBucket: {
      marginLeft: 8,
    },
    bucketList: {
      marginTop: 25,
    },
    searchField: {
      ...searchField.searchField,
      minWidth: 380,
      "@media (max-width: 900px)": {
        minWidth: 220,
      },
    },
    ...containerForHeader(theme.spacing(4)),
  });

interface IListBucketsProps {
  classes: any;
  history: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  session: ISessionResponse;
}

const ListBuckets = ({
  classes,
  history,
  setErrorSnackMessage,
  session,
}: IListBucketsProps) => {
  const [records, setRecords] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedBucket, setSelectedBucket] = useState<string>("");
  const [filterBuckets, setFilterBuckets] = useState<string>("");
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);
  const [replicationModalOpen, setReplicationModalOpen] =
    useState<boolean>(false);

  const [bulkSelect, setBulkSelect] = useState<boolean>(false);

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
          .catch((err: ErrorResponseHandler) => {
            setLoading(false);
            setErrorSnackMessage(err);
          });
      };
      fetchRecords();
    }
  }, [loading, setErrorSnackMessage]);

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
      <PageLayout>
        <Grid item xs={12} className={classes.actionsTray} display="flex">
          <SearchBox
            onChange={setFilterBuckets}
            placeholder="Search Buckets"
            overrideClass={classes.searchField}
          />

          <Grid
            item
            xs={12}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
          >
            <BoxIconButton
              variant={bulkSelect ? "contained" : "outlined"}
              tooltip={"Select Multiple"}
              onClick={() => {
                setBulkSelect(!bulkSelect);
              }}
              size={"small"}
              className={classes.bulkSelect}
            >
              <SelectMultipleIcon />
            </BoxIconButton>
            <BoxIconButton
              variant="outlined"
              tooltip={"Set Replication"}
              onClick={() => {
                setReplicationModalOpen(true);
              }}
              disabled={selectedBuckets.length === 0}
              size={"small"}
            >
              <MultipleBucketsIcon />
            </BoxIconButton>
            <BoxIconButton
              color="primary"
              aria-label="Refresh"
              tooltip={"Refresh"}
              onClick={() => {
                setLoading(true);
              }}
              size="large"
            >
              <RefreshIcon />
            </BoxIconButton>
            <SecureComponent
              scopes={[IAM_SCOPES.S3_CREATE_BUCKET]}
              resource={CONSOLE_UI_RESOURCE}
            >
              <Button
                variant="contained"
                color="primary"
                endIcon={<AddIcon />}
                onClick={() => {
                  history.push("/add-bucket");
                }}
                className={classes.addBucket}
              >
                Create Bucket
              </Button>
            </SecureComponent>
          </Grid>
        </Grid>

        {loading && <LinearProgress />}
        {!loading && (
          <Grid item xs={12} className={classes.bucketList}>
            {filteredRecords.map((bucket, index) => {
              return (
                <BucketListItem
                  bucket={bucket}
                  key={`bucketListItem-${index.toString()}`}
                  onDelete={confirmDeleteBucket}
                  onSelect={selectListBuckets}
                  selected={selectedBuckets.includes(bucket.name)}
                  bulkSelect={bulkSelect}
                />
              );
            })}
            {filteredRecords.length === 0 && filterBuckets !== "" && (
              <Grid
                container
                justifyContent={"center"}
                alignContent={"center"}
                alignItems={"center"}
              >
                <Grid item xs={8}>
                  <HelpBox
                    iconComponent={<BucketsIcon />}
                    title={"No Results"}
                    help={
                      <Fragment>
                        No buckets match the filtering condition
                      </Fragment>
                    }
                  />
                </Grid>
              </Grid>
            )}
            {filteredRecords.length === 0 && filterBuckets === "" && (
              <Grid
                container
                justifyContent={"center"}
                alignContent={"center"}
                alignItems={"center"}
              >
                <Grid item xs={8}>
                  <HelpBox
                    iconComponent={<BucketsIcon />}
                    title={"Buckets"}
                    help={
                      <Fragment>
                        MinIO uses buckets to organize objects. A bucket is
                        similar to a folder or directory in a filesystem, where
                        each bucket can hold an arbitrary number of objects.
                        <SecureComponent
                          scopes={[IAM_SCOPES.S3_CREATE_BUCKET]}
                          resource={CONSOLE_UI_RESOURCE}
                        >
                          <br />
                          <br />
                          To get started,&nbsp;
                          <AButton
                            onClick={() => {
                              history.push("/add-bucket");
                            }}
                          >
                            Create a Bucket.
                          </AButton>
                        </SecureComponent>
                      </Fragment>
                    }
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </PageLayout>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  session: state.console.session,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
});

export default connector(withStyles(styles)(ListBuckets));
