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
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Bucket, BucketList } from "../types";
import {
  AddIcon,
  BucketsIcon,
  LifecycleConfigIcon,
  SelectAllIcon,
} from "../../../../icons";
import {
  containerForHeader,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import PageHeader from "../../Common/PageHeader/PageHeader";
import BucketListItem from "./BucketListItem";
import BulkReplicationModal from "./BulkReplicationModal";
import HelpBox from "../../../../common/HelpBox";
import RefreshIcon from "../../../../icons/RefreshIcon";
import AButton from "../../Common/AButton/AButton";
import MultipleBucketsIcon from "../../../../icons/MultipleBucketsIcon";
import SelectMultipleIcon from "../../../../icons/SelectMultipleIcon";
import { SecureComponent } from "../../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import PageLayout from "../../Common/Layout/PageLayout";
import SearchBox from "../../Common/SearchBox";
import VirtualizedList from "../../Common/VirtualizedList/VirtualizedList";
import RBIconButton from "../BucketDetails/SummaryItems/RBIconButton";
import BulkLifecycleModal from "./BulkLifecycleModal";
import hasPermission from "../../../../common/SecureComponent/accessControl";
import { setErrorSnackMessage } from "../../../../systemSlice";

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
    bucketList: {
      marginTop: 25,
      height: "calc(100vh - 210px)",
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
}

const ListBuckets = ({ classes }: IListBucketsProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [records, setRecords] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterBuckets, setFilterBuckets] = useState<string>("");
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);
  const [replicationModalOpen, setReplicationModalOpen] =
    useState<boolean>(false);
  const [lifecycleModalOpen, setLifecycleModalOpen] = useState<boolean>(false);

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
            dispatch(setErrorSnackMessage(err));
          });
      };
      fetchRecords();
    }
  }, [loading, dispatch]);

  const filteredRecords = records.filter((b: Bucket) => {
    if (filterBuckets === "") {
      return true;
    } else {
      return b.name.indexOf(filterBuckets) >= 0;
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

  const closeBulkLifecycleModal = (unselectAll: boolean) => {
    setLifecycleModalOpen(false);

    if (unselectAll) {
      setSelectedBuckets([]);
    }
  };

  const renderItemLine = (index: number) => {
    const bucket = filteredRecords[index] || null;
    if (bucket) {
      return (
        <BucketListItem
          bucket={bucket}
          onSelect={selectListBuckets}
          selected={selectedBuckets.includes(bucket.name)}
          bulkSelect={bulkSelect}
        />
      );
    }
    return null;
  };

  const selectAllBuckets = () => {
    if (selectedBuckets.length === filteredRecords.length) {
      setSelectedBuckets([]);
      return;
    }

    const selectAllBuckets = filteredRecords.map((bucket) => {
      return bucket.name;
    });

    setSelectedBuckets(selectAllBuckets);
  };

  const canCreateBucket = hasPermission("*", [IAM_SCOPES.S3_CREATE_BUCKET]);

  return (
    <Fragment>
      {replicationModalOpen && (
        <BulkReplicationModal
          open={replicationModalOpen}
          buckets={selectedBuckets}
          closeModalAndRefresh={closeBulkReplicationModal}
        />
      )}
      {lifecycleModalOpen && (
        <BulkLifecycleModal
          buckets={selectedBuckets}
          closeModalAndRefresh={closeBulkLifecycleModal}
          open={lifecycleModalOpen}
        />
      )}
      <PageHeader label={"Buckets"} />
      <PageLayout>
        <Grid item xs={12} className={classes.actionsTray} display="flex">
          <SearchBox
            onChange={setFilterBuckets}
            placeholder="Search Buckets"
            overrideClass={classes.searchField}
            value={filterBuckets}
          />

          <Grid
            item
            xs={12}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
          >
            <RBIconButton
              tooltip={
                bulkSelect ? "Unselect Buckets" : "Select Multiple Buckets"
              }
              onClick={() => {
                setBulkSelect(!bulkSelect);
                setSelectedBuckets([]);
              }}
              text={""}
              icon={<SelectMultipleIcon />}
              color={"primary"}
              variant={bulkSelect ? "contained" : "outlined"}
            />

            {bulkSelect && (
              <RBIconButton
                tooltip={
                  selectedBuckets.length === filteredRecords.length
                    ? "Unselect All Buckets"
                    : "Select All Buckets"
                }
                onClick={selectAllBuckets}
                text={""}
                icon={<SelectAllIcon />}
                color={"primary"}
                variant={"outlined"}
              />
            )}

            <RBIconButton
              tooltip={"Set Lifecycle"}
              onClick={() => {
                setLifecycleModalOpen(true);
              }}
              text={""}
              icon={<LifecycleConfigIcon />}
              disabled={selectedBuckets.length === 0}
              color={"primary"}
              variant={"outlined"}
            />

            <RBIconButton
              tooltip={"Set Replication"}
              onClick={() => {
                setReplicationModalOpen(true);
              }}
              text={""}
              icon={<MultipleBucketsIcon />}
              disabled={selectedBuckets.length === 0}
              color={"primary"}
              variant={"outlined"}
            />

            <RBIconButton
              tooltip={"Refresh"}
              onClick={() => {
                setLoading(true);
              }}
              text={""}
              icon={<RefreshIcon />}
              color={"primary"}
              variant={"outlined"}
            />

            <RBIconButton
              tooltip={"Create Bucket"}
              onClick={() => {
                navigate(IAM_PAGES.ADD_BUCKETS);
              }}
              text={"Create Bucket"}
              icon={<AddIcon />}
              color={"primary"}
              variant={"contained"}
              disabled={!canCreateBucket}
            />
          </Grid>
        </Grid>

        {loading && <LinearProgress />}
        {!loading && (
          <Grid item xs={12} className={classes.bucketList}>
            {filteredRecords.length !== 0 && (
              <VirtualizedList
                rowRenderFunction={renderItemLine}
                totalItems={filteredRecords.length}
              />
            )}
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
                              navigate(IAM_PAGES.ADD_BUCKETS);
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

export default withStyles(styles)(ListBuckets);
