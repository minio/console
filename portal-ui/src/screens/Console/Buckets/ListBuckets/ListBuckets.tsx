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
import { Box, Button } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import { Bucket, BucketList, HasPermissionResponse } from "../types";
import {
  AddIcon,
  BucketsIcon,
  TenantsIcon,
  WatchIcon,
} from "../../../../icons";
import { AppState } from "../../../../store";
import { addBucketOpen, addBucketReset } from "../actions";
import { setErrorSnackMessage } from "../../../../actions";
import { containerForHeader } from "../../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import AddBucket from "./AddBucket";
import DeleteBucket from "./DeleteBucket";
import PageHeader from "../../Common/PageHeader/PageHeader";
import BucketListItem from "./BucketListItem";
import BulkReplicationModal from "./BulkReplicationModal";
import SearchIcon from "../../../../icons/SearchIcon";
import HelpBox from "../../../../common/HelpBox";

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
        marginRight: 6,
      },
      "& .MuiButton-contained": {
        color: "white",
      },
    },
    bulkSelect: {
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
      marginRight: 8,
    },
    theaderSearch: {
      borderColor: theme.palette.grey["200"],
      "& .MuiInputBase-input": {
        paddingTop: 10,
        paddingBottom: 10,
      },
      "& .MuiInputBase-root": {
        "& .MuiInputAdornment-root": {
          "& .MuiSvgIcon-root": {
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
    constrainedContainer: {
      maxWidth: 1180,
    },
    link: {
      textDecoration: "underline",
      color: theme.palette.info.main,
    },
  });

interface IListBucketsProps {
  classes: any;
  history: any;
  addBucketOpen: typeof addBucketOpen;
  addBucketModalOpen: boolean;
  addBucketReset: typeof addBucketReset;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const ListBuckets = ({
  classes,
  history,
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

  const [bulkSelect, setBulkSelect] = useState<boolean>(false);

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
        .catch((err: ErrorResponseHandler) => {
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
          .catch((err: ErrorResponseHandler) => {
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
      <PageHeader
        label={"Buckets"}
        actions={
          <Fragment>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              className={classes.actionHeaderItems}
            >
              <Box display={{ xs: "none", sm: "none", md: "block" }}>
                <Grid item>
                  <div className={classes.theaderSearchLabel}>
                    Search Buckets:
                  </div>
                </Grid>
              </Box>
              <Box display={{ xs: "block", sm: "block", md: "none" }}>
                <TextField
                  className={classes.theaderSearch}
                  variant={"outlined"}
                  id="search-resource"
                  placeholder={"Filter Buckets"}
                  onChange={(val) => {
                    setFilterBuckets(val.target.value);
                  }}
                  inputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Box display={{ xs: "none", sm: "none", md: "block" }}>
                <TextField
                  className={classes.theaderSearch}
                  variant={"outlined"}
                  id="search-resource"
                  onChange={(val) => {
                    setFilterBuckets(val.target.value);
                  }}
                  inputProps={{
                    disableUnderline: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              {canCreateBucket && (
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<AddIcon />}
                    onClick={() => {
                      addBucketOpen(true);
                    }}
                    className={classes.addBucket}
                  >
                    Create Bucket
                  </Button>
                </Grid>
              )}
            </Grid>
          </Fragment>
        }
      />
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12} className={classes.buttonTray}>
            <Button
              variant={bulkSelect ? "contained" : "outlined"}
              onClick={() => {
                setBulkSelect(!bulkSelect);
              }}
              endIcon={<WatchIcon />}
              size={"small"}
              className={classes.bulkSelect}
            >
              Bulk Select
            </Button>

            <Button
              variant="outlined"
              endIcon={<FileCopyIcon />}
              onClick={() => {
                setReplicationModalOpen(true);
              }}
              disabled={selectedBuckets.length === 0}
              size={"small"}
            >
              Set Replication
            </Button>
          </Grid>

          <Grid item xs={12}>
            <br />
          </Grid>
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
            {filteredRecords.length == 0 && (
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
                        <br />
                        <br />
                        To get started,&nbsp;
                        <a
                          className={classes.link}
                          onClick={() => {
                            addBucketOpen(true);
                          }}
                        >
                          Create a Bucket.
                        </a>
                      </Fragment>
                    }
                  />
                </Grid>
              </Grid>
            )}
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
