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
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "../../../../icons/SearchIcon";
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
    buttonTray: {
      textAlign: "right",
      "& .MuiButton-root": {
        fontSize: 12,
        borderColor: theme.palette.grey["300"],
        color: theme.palette.grey["300"],
        textTransform: "capitalize",
        marginLeft: 8,
      },
      "& .MuiButton-contained": {
        color: "white",
      },
    },
    bulkSelect: {
      marginLeft: 8,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
      },
      "&.MuiButton-contained": {
        backgroundColor: theme.palette.primary.main,
      },
    },
    theaderSearchLabel: {
      color: theme.palette.grey["400"],
      fontSize: 14,
      fontWeight: "bold",
    },
    addBucket: {
      marginLeft: 8,
    },
    theaderSearch: {
      borderColor: theme.palette.grey["200"],
      "& .MuiInputBase-input": {
        paddingTop: 10,
        paddingBottom: 10,
      },
      "& .MuiInputBase-root": {
        "& .MuiInputAdornment-root": {
          "& .min-icon": {
            color: theme.palette.grey["400"],
            height: 14,
          },
        },
      },
      actionHeaderItems: {
        "@media (min-width: 320px)": {
          marginTop: 8,
        },
      },
      marginRight: 10,
      marginLeft: 10,
    },
    ...containerForHeader(theme.spacing(4)),
    ...searchField,
    constrainedContainer: {
      maxWidth: 1180,
    },
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
      <Grid container className={classes.container}>
        <Grid item xs={12} className={classes.buttonTray}>
          <Grid container>
            <Grid item xs={12} sm>
              <TextField
                placeholder="Filter Buckets"
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
                  setFilterBuckets(e.target.value);
                }}
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={"auto"}>
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
        </Grid>

        <Grid item xs={12}>
          <br />
        </Grid>
        {loading && <LinearProgress />}
        {!loading && (
          <Grid item xs={12}>
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
      </Grid>
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
