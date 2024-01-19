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

import React, { useEffect, useState } from "react";
import {
  BucketReplicationIcon,
  Button,
  FormLayout,
  InputBox,
  ReadBox,
  Switch,
  Grid,
} from "mds";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import QueryMultiSelector from "../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { api } from "api";
import { errorToHandler } from "api/errors";

interface IEditReplicationModal {
  closeModalAndRefresh: (refresh: boolean) => void;
  open: boolean;
  bucketName: string;
  ruleID: string;
}

const EditReplicationModal = ({
  closeModalAndRefresh,
  open,
  bucketName,
  ruleID,
}: IEditReplicationModal) => {
  const dispatch = useAppDispatch();
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
    if (editLoading) {
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
          dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
          setEditLoading(false);
        });
    }
  }, [editLoading, dispatch, bucketName, ruleID]);

  useEffect(() => {
    if (saveEdit) {
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
          setSaveEdit(false);
          closeModalAndRefresh(true);
        })
        .catch((err) => {
          dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
          setSaveEdit(false);
        });
    }
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
    closeModalAndRefresh,
    dispatch,
  ]);

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      title="Edit Bucket Replication"
      titleIcon={<BucketReplicationIcon />}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setSaveEdit(true);
        }}
      >
        <FormLayout containerPadding={false} withBorders={false}>
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
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"cancel-edit-replication"}
              type="button"
              variant="regular"
              disabled={editLoading || saveEdit}
              onClick={() => {
                closeModalAndRefresh(false);
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
    </ModalWrapper>
  );
};

export default EditReplicationModal;
