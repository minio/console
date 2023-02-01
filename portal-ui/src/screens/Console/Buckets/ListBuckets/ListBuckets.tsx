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

import { useNavigate } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import {
  AddIcon,
  BucketsIcon,
  Button,
  HelpBox,
  LifecycleConfigIcon,
  MultipleBucketsIcon,
  PageHeader,
  RefreshIcon,
  SelectAllIcon,
  SelectMultipleIcon,
} from "mds";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Bucket, BucketList } from "../types";
import {
  containerForHeader,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import BucketListItem from "./BucketListItem";
import BulkReplicationModal from "./BulkReplicationModal";
import { SecureComponent } from "../../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PERMISSIONS,
  IAM_ROLES,
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../common/SecureComponent/permissions";
import PageLayout from "../../Common/Layout/PageLayout";
import SearchBox from "../../Common/SearchBox";
import VirtualizedList from "../../Common/VirtualizedList/VirtualizedList";
import BulkLifecycleModal from "./BulkLifecycleModal";
import hasPermission from "../../../../common/SecureComponent/accessControl";
import { setErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { useSelector } from "react-redux";
import { selFeatures } from "../../consoleSlice";
import AutoColorIcon from "../../Common/Components/AutoColorIcon";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import AButton from "../../Common/AButton/AButton";
import { setLoadingObjects } from "../../ObjectBrowser/objectBrowserSlice";

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
      height: "calc(100vh - 211px)",
      "&.isEmbedded": {
        height: "calc(100vh - 128px)",
      },
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [records, setRecords] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterBuckets, setFilterBuckets] = useState<string>("");
  const [selectedBuckets, setSelectedBuckets] = useState<string[]>([]);
  const [replicationModalOpen, setReplicationModalOpen] =
    useState<boolean>(false);
  const [lifecycleModalOpen, setLifecycleModalOpen] = useState<boolean>(false);
  const [canPutLifecycle, setCanPutLifecycle] = useState<boolean>(false);
  const [bulkSelect, setBulkSelect] = useState<boolean>(false);

  const features = useSelector(selFeatures);
  const obOnly = !!features?.includes("object-browser-only");

  useEffect(() => {
    if (loading) {
      const fetchRecords = () => {
        setLoading(true);
        api
          .invoke("GET", `/api/v1/buckets`)
          .then((res: BucketList) => {
            setLoading(false);
            setRecords(res.buckets || []);
            dispatch(setLoadingObjects(true));
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

  const hasBuckets = records.length > 0;

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

  useEffect(() => {
    var failLifecycle = false;
    selectedBuckets.forEach((bucket: string) => {
      hasPermission(bucket, IAM_PERMISSIONS[IAM_ROLES.BUCKET_LIFECYCLE], true)
        ? setCanPutLifecycle(true)
        : (failLifecycle = true);
    });
    failLifecycle ? setCanPutLifecycle(false) : setCanPutLifecycle(true);
  }, [selectedBuckets]);

  const renderItemLine = (index: number) => {
    const bucket = filteredRecords[index] || null;
    if (bucket) {
      return (
        <BucketListItem
          bucket={bucket}
          onSelect={selectListBuckets}
          selected={selectedBuckets.includes(bucket.name)}
          bulkSelect={bulkSelect}
          noManage={obOnly}
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
  const canListBuckets = hasPermission("*", [
    IAM_SCOPES.S3_LIST_BUCKET,
    IAM_SCOPES.S3_ALL_LIST_BUCKET,
  ]);

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
      {!obOnly && <PageHeader label={"Buckets"} />}
      <PageLayout>
        <Grid item xs={12} className={classes.actionsTray} display="flex">
          {obOnly && (
            <Grid item xs>
              <AutoColorIcon marginRight={15} marginTop={10} />
            </Grid>
          )}
          {hasBuckets && (
            <SearchBox
              onChange={setFilterBuckets}
              placeholder="Search Buckets"
              overrideClass={classes.searchField}
              value={filterBuckets}
            />
          )}

          <Grid
            item
            xs={12}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            sx={{
              "& button": {
                marginLeft: "8px",
              },
            }}
          >
            {!obOnly && (
              <Fragment>
                <TooltipWrapper
                  tooltip={
                    !hasBuckets
                      ? ""
                      : bulkSelect
                      ? "Unselect Buckets"
                      : "Select Multiple Buckets"
                  }
                >
                  <Button
                    id={"multiple-bucket-seection"}
                    onClick={() => {
                      setBulkSelect(!bulkSelect);
                      setSelectedBuckets([]);
                    }}
                    icon={<SelectMultipleIcon />}
                    variant={bulkSelect ? "callAction" : "regular"}
                    disabled={!hasBuckets}
                  />
                </TooltipWrapper>

                {bulkSelect && (
                  <TooltipWrapper
                    tooltip={
                      !hasBuckets
                        ? ""
                        : selectedBuckets.length === filteredRecords.length
                        ? "Unselect All Buckets"
                        : "Select All Buckets"
                    }
                  >
                    <Button
                      id={"select-all-buckets"}
                      onClick={selectAllBuckets}
                      icon={<SelectAllIcon />}
                      variant={"regular"}
                    />
                  </TooltipWrapper>
                )}

                <TooltipWrapper
                  tooltip={
                    !hasBuckets
                      ? ""
                      : !canPutLifecycle
                      ? permissionTooltipHelper(
                          IAM_PERMISSIONS[IAM_ROLES.BUCKET_LIFECYCLE],
                          "configure lifecycle for the selected buckets"
                        )
                      : selectedBuckets.length === 0
                      ? bulkSelect
                        ? "Please select at least one bucket on which to configure Lifecycle"
                        : "Use the Select Multiple Buckets button to choose buckets on which to configure Lifecycle"
                      : "Set Lifecycle"
                  }
                >
                  <Button
                    id={"set-lifecycle"}
                    onClick={() => {
                      setLifecycleModalOpen(true);
                    }}
                    icon={<LifecycleConfigIcon />}
                    variant={"regular"}
                    disabled={selectedBuckets.length === 0 || !canPutLifecycle}
                  />
                </TooltipWrapper>

                <TooltipWrapper
                  tooltip={
                    !hasBuckets
                      ? ""
                      : selectedBuckets.length === 0
                      ? bulkSelect
                        ? "Please select at least one bucket on which to configure Replication"
                        : "Use the Select Multiple Buckets button to choose buckets on which to configure Replication"
                      : "Set Replication"
                  }
                >
                  <Button
                    id={"set-replication"}
                    onClick={() => {
                      setReplicationModalOpen(true);
                    }}
                    icon={<MultipleBucketsIcon />}
                    variant={"regular"}
                    disabled={selectedBuckets.length === 0}
                  />
                </TooltipWrapper>
              </Fragment>
            )}

            <TooltipWrapper tooltip={"Refresh"}>
              <Button
                id={"refresh-buckets"}
                onClick={() => {
                  setLoading(true);
                }}
                icon={<RefreshIcon />}
                variant={"regular"}
              />
            </TooltipWrapper>

            {!obOnly && (
              <TooltipWrapper
                tooltip={
                  canCreateBucket
                    ? ""
                    : permissionTooltipHelper(
                        [IAM_SCOPES.S3_CREATE_BUCKET],
                        "create a bucket"
                      )
                }
              >
                <Button
                  id={"create-bucket"}
                  onClick={() => {
                    navigate(IAM_PAGES.ADD_BUCKETS);
                  }}
                  icon={<AddIcon />}
                  variant={"callAction"}
                  disabled={!canCreateBucket}
                  label={"Create Bucket"}
                />
              </TooltipWrapper>
            )}
          </Grid>
        </Grid>

        {loading && <LinearProgress />}
        {!loading && (
          <Grid
            item
            xs={12}
            className={`${classes.bucketList} ${obOnly ? "isEmbedded" : ""}`}
          >
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
            {!hasBuckets && (
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
                        {canListBuckets ? (
                          ""
                        ) : (
                          <Fragment>
                            <br />
                            {permissionTooltipHelper(
                              [
                                IAM_SCOPES.S3_LIST_BUCKET,
                                IAM_SCOPES.S3_ALL_LIST_BUCKET,
                              ],
                              "view the buckets on this server"
                            )}
                            <br />
                          </Fragment>
                        )}
                        <SecureComponent
                          scopes={[IAM_SCOPES.S3_CREATE_BUCKET]}
                          resource={CONSOLE_UI_RESOURCE}
                        >
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
