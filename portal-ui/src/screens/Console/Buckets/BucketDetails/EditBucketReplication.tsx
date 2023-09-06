// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
  BackLink,
  Box,
  BucketReplicationIcon,
  Button,
  FormLayout,
  Grid,
  HelpBox,
  InputBox,
  PageLayout,
  ReadBox,
  Switch,
} from "mds";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import { setErrorSnackMessage, setHelpName } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../../HelpMenu";
import { api } from "api";
import { errorToHandler } from "api/errors";
import QueryMultiSelector from "screens/Console/Common/FormComponents/QueryMultiSelector/QueryMultiSelector";

const EditBucketReplication = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let params = new URLSearchParams(document.location.search);

  const bucketName = params.get("bucketName") || "";
  const ruleID = params.get("ruleID") || "";

  useEffect(() => {
    dispatch(setHelpName("bucket-replication-edit"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backLink = IAM_PAGES.BUCKETS + `/${bucketName}/admin/replication`;

  const [editLoading, setEditLoading] = useState<boolean>(true);
  const [saveEdit, setSaveEdit] = useState<boolean>(false);
  const [priority, setPriority] = useState<string>("1");
  const [destination, setDestination] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [repDeleteMarker, setRepDeleteMarker] = useState<boolean>(false);
  const [metadataSync, setMetadataSync] = useState<boolean>(false);
  const [initialTags, setInitialTags] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [targetStorageClass, setTargetStorageClass] = useState<string>("");
  const [repExisting, setRepExisting] = useState<boolean>(false);
  const [repDelete, setRepDelete] = useState<boolean>(false);
  const [ruleState, setRuleState] = useState<boolean>(false);

  useEffect(() => {
    if (editLoading && bucketName && ruleID) {
      api.buckets

        .getBucketReplicationRule(bucketName, ruleID)
        .then((res) => {
          setPriority(res.data.priority ? res.data.priority.toString() : "");
          const pref = res.data.prefix || "";
          const tag = res.data.tags || "";
          setPrefix(pref);
          setInitialTags(tag);
          setTags(tag);
          setDestination(res.data.destination?.bucket || "");
          setRepDeleteMarker(res.data.delete_marker_replication || false);
          setTargetStorageClass(res.data.storageClass || "");
          setRepExisting(!!res.data.existingObjects);
          setRepDelete(!!res.data.deletes_replication);
          setRuleState(res.data.status === "Enabled");
          setMetadataSync(!!res.data.metadata_replication);

          setEditLoading(false);
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
          setEditLoading(false);
        });
    }
  }, [editLoading, dispatch, bucketName, ruleID]);

  useEffect(() => {
    if (saveEdit && bucketName && ruleID) {
      const remoteBucketsInfo = {
        arn: destination,
        ruleState: ruleState,
        prefix: prefix,
        tags: tags,
        replicateDeleteMarkers: repDeleteMarker,
        replicateDeletes: repDelete,
        replicateExistingObjects: repExisting,
        replicateMetadata: metadataSync,
        priority: parseInt(priority),
        storageClass: targetStorageClass,
      };

      api.buckets
        .updateMultiBucketReplication(bucketName, ruleID, remoteBucketsInfo)
        .then(() => {
          navigate(backLink);
        })
        .catch((err) => {
          dispatch(setErrorSnackMessage(errorToHandler(err.error)));
          setSaveEdit(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    saveEdit,
    bucketName,
    ruleID,
    destination,
    prefix,
    tags,
    repDeleteMarker,
    priority,
    repDelete,
    repExisting,
    ruleState,
    metadataSync,
    targetStorageClass,
    dispatch,
  ]);

  return (
    <Fragment>
      <PageHeaderWrapper
        label={
          <BackLink
            label={"Edit Bucket Replication"}
            onClick={() => navigate(backLink)}
          />
        }
        actions={<HelpMenu />}
      />
      <PageLayout>
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setSaveEdit(true);
          }}
        >
          <FormLayout
            containerPadding={false}
            withBorders={false}
            helpBox={
              <HelpBox
                iconComponent={<BucketReplicationIcon />}
                title="Bucket Replication Configuration"
                help={
                  <Fragment>
                    <Box sx={{ paddingTop: "10px" }}>
                      For each write operation to the bucket, MinIO checks all
                      configured replication rules for the bucket and applies
                      the matching rule with highest configured priority.
                    </Box>
                    <Box sx={{ paddingTop: "10px" }}>
                      MinIO supports enabling replication of existing objects in
                      a bucket.
                    </Box>
                    <Box sx={{ paddingTop: "10px" }}>
                      MinIO does not enable existing object replication by
                      default. Objects created before replication was configured
                      or while replication is disabled are not synchronized to
                      the target deployment unless replication of existing
                      objects is enabled.
                    </Box>
                    <Box sx={{ paddingTop: "10px" }}>
                      MinIO supports replicating delete operations, where MinIO
                      synchronizes deleting specific object versions and new
                      delete markers. Delete operation replication uses the same
                      replication process as all other replication operations.
                    </Box>{" "}
                  </Fragment>
                }
              />
            }
          >
            <Switch
              checked={ruleState}
              id="ruleState"
              name="ruleState"
              label="Rule State"
              onChange={(e) => {
                setRuleState(e.target.checked);
              }}
            />
            <ReadBox label={"Destination"} sx={{ width: "100%" }}>
              {destination}
            </ReadBox>
            <InputBox
              id="priority"
              name="priority"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.validity.valid) {
                  setPriority(e.target.value);
                }
              }}
              label="Priority"
              value={priority}
              pattern={"[0-9]*"}
            />
            <InputBox
              id="storageClass"
              name="storageClass"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTargetStorageClass(e.target.value);
              }}
              placeholder="STANDARD_IA,REDUCED_REDUNDANCY etc"
              label="Storage Class"
              value={targetStorageClass}
            />
            <fieldset className={"inputItem"}>
              <legend>Object Filters</legend>
              <InputBox
                id="prefix"
                name="prefix"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPrefix(e.target.value);
                }}
                placeholder="prefix"
                label="Prefix"
                value={prefix}
              />
              <QueryMultiSelector
                name="tags"
                label="Tags"
                elements={initialTags}
                onChange={(vl: string) => {
                  setTags(vl);
                }}
                keyPlaceholder="Tag Key"
                valuePlaceholder="Tag Value"
                withBorder
              />
            </fieldset>
            <fieldset className={"inputItem"}>
              <legend>Replication Options</legend>
              <Switch
                checked={repExisting}
                id="repExisting"
                name="repExisting"
                label="Existing Objects"
                onChange={(e) => {
                  setRepExisting(e.target.checked);
                }}
                description={"Replicate existing objects"}
              />
              <Switch
                checked={metadataSync}
                id="metadatataSync"
                name="metadatataSync"
                label="Metadata Sync"
                onChange={(e) => {
                  setMetadataSync(e.target.checked);
                }}
                description={"Metadata Sync"}
              />
              <Switch
                checked={repDeleteMarker}
                id="deleteMarker"
                name="deleteMarker"
                label="Delete Marker"
                onChange={(e) => {
                  setRepDeleteMarker(e.target.checked);
                }}
                description={"Replicate soft deletes"}
              />
              <Switch
                checked={repDelete}
                id="repDelete"
                name="repDelete"
                label="Deletes"
                onChange={(e) => {
                  setRepDelete(e.target.checked);
                }}
                description={"Replicate versioned deletes"}
              />
            </fieldset>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
                gap: 10,
                paddingTop: 10,
              }}
            >
              <Button
                id={"cancel-edit-replication"}
                type="button"
                variant="regular"
                disabled={editLoading || saveEdit}
                onClick={() => {
                  navigate(backLink);
                }}
                label={"Cancel"}
              />
              <Button
                id={"save-replication"}
                type="submit"
                variant="callAction"
                disabled={editLoading || saveEdit}
                label={"Save"}
              />
            </Grid>
          </FormLayout>
        </form>
      </PageLayout>
    </Fragment>
  );
};

export default EditBucketReplication;
