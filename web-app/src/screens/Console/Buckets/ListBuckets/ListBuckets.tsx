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
import {
  AddIcon,
  BucketsIcon,
  Button,
  HelpBox,
  LifecycleConfigIcon,
  MultipleBucketsIcon,
  PageLayout,
  RefreshIcon,
  SelectAllIcon,
  SelectMultipleIcon,
  Grid,
  breakPoints,
  ProgressBar,
  ActionLink,
} from "mds";

import { actionsTray } from "../../Common/FormComponents/common/styleLibrary";
import { SecureComponent } from "../../../../common/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PERMISSIONS,
  IAM_ROLES,
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../common/SecureComponent/permissions";
import { setErrorSnackMessage, setHelpName } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { useSelector } from "react-redux";
import { selFeatures } from "../../consoleSlice";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import { api } from "../../../../api";
import { Bucket } from "../../../../api/consoleApi";
import { errorToHandler } from "../../../../api/errors";
import HelpMenu from "../../HelpMenu";
import AutoColorIcon from "../../Common/Components/AutoColorIcon";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import SearchBox from "../../Common/SearchBox";
import VirtualizedList from "../../Common/VirtualizedList/VirtualizedList";
import BulkLifecycleModal from "./BulkLifecycleModal";
import hasPermission from "../../../../common/SecureComponent/accessControl";
import BucketListItem from "./BucketListItem";
import BulkReplicationModal from "./BulkReplicationModal";

const ListBuckets = () => {
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
    dispatch(setHelpName("ob_bucket_list"));
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      const fetchRecords = () => {
        setLoading(true);
        api.buckets.listBuckets().then((res) => {
          if (res.data) {
            setLoading(false);
            setRecords(res.data.buckets || []);
          } else if (res.error) {
            setLoading(false);
            dispatch(setErrorSnackMessage(errorToHandler(res.error)));
          }
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
      {!obOnly && (
        <PageHeaderWrapper label={"Buckets"} actions={<HelpMenu />} />
      )}

      <PageLayout>
        <Grid item xs={12} sx={actionsTray.actionsTray}>
          {obOnly && (
            <Grid item xs>
              <AutoColorIcon marginRight={15} marginTop={10} />
            </Grid>
          )}
          {hasBuckets && (
            <SearchBox
              onChange={setFilterBuckets}
              placeholder="Search Buckets"
              value={filterBuckets}
              sx={{
                minWidth: 380,
                [`@media (max-width: ${breakPoints.md}px)`]: {
                  minWidth: 220,
                },
              }}
            />
          )}

          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 5,
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
                            "configure lifecycle for the selected buckets",
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
                        "create a bucket",
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

        {loading && <ProgressBar />}
        {!loading && (
          <Grid
            item
            xs={12}
            sx={{
              marginTop: 25,
              height: "calc(100vh - 211px)",
              "&.isEmbedded": {
                height: "calc(100vh - 128px)",
              },
            }}
            className={obOnly ? "isEmbedded" : ""}
          >
            {filteredRecords.length !== 0 && (
              <VirtualizedList
                rowRenderFunction={renderItemLine}
                totalItems={filteredRecords.length}
              />
            )}
            {filteredRecords.length === 0 && filterBuckets !== "" && (
              <Grid container>
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
              <Grid container>
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
                              "view the buckets on this server",
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
                          <ActionLink
                            onClick={() => {
                              navigate(IAM_PAGES.ADD_BUCKETS);
                            }}
                          >
                            Create a Bucket.
                          </ActionLink>
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

export default ListBuckets;
