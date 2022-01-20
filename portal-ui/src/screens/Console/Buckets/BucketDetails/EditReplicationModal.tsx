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
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import { Button } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import QueryMultiSelector from "../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import { BucketReplicationIcon } from "../../../../icons";
import {
  createTenantCommon,
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../../Common/FormComponents/common/styleLibrary";
import { BucketReplicationRule } from "../types";
import { connect } from "react-redux";
import { setModalErrorSnackMessage } from "../../../../actions";
import api from "../../../../common/api";
import { ErrorResponseHandler } from "../../../../common/types";
import PredefinedList from "../../Common/FormComponents/PredefinedList/PredefinedList";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

interface IEditReplicationModal {
  closeModalAndRefresh: (refresh: boolean) => void;
  open: boolean;
  classes: any;
  bucketName: string;
  ruleID: string;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    multiContainer: {
      display: "flex",
      alignItems: "center",
    },
    sizeFactorContainer: {
      "& label": {
        display: "none",
      },
      "& div:first-child": {
        marginBottom: 0,
      },
    },
    ...spacingUtils,
    ...createTenantCommon,
    ...formFieldStyles,
    ...modalStyleUtils,
    modalFormScrollable: {
      ...modalStyleUtils.modalFormScrollable,
      paddingRight: 10,
    },
  });

const EditReplicationModal = ({
  closeModalAndRefresh,
  open,
  classes,
  bucketName,
  ruleID,
  setModalErrorSnackMessage,
}: IEditReplicationModal) => {
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
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}/replication/${ruleID}`)
        .then((res: BucketReplicationRule) => {
          setPriority(res.priority.toString());
          const pref = res.prefix || "";
          const tag = res.tags || "";
          setPrefix(pref);
          setInitialTags(tag);
          setTags(tag);
          setDestination(res.destination.bucket);
          setRepDeleteMarker(res.delete_marker_replication);
          setTargetStorageClass(res.storageClass || "");
          setRepExisting(!!res.existingObjects);
          setRepDelete(!!res.deletes_replication);
          setRuleState(res.status === "Enabled");
          setMetadataSync(!!res.metadata_replication);

          setEditLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setModalErrorSnackMessage(err);
          setEditLoading(false);
        });
    }
  }, [editLoading, setModalErrorSnackMessage, bucketName, ruleID]);

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

      api
        .invoke(
          "PUT",
          `/api/v1/buckets/${bucketName}/replication/${ruleID}`,
          remoteBucketsInfo
        )
        .then(() => {
          setSaveEdit(false);
          closeModalAndRefresh(true);
        })
        .catch((err: ErrorResponseHandler) => {
          setModalErrorSnackMessage(err);
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
    setModalErrorSnackMessage,
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
        <Grid container>
          <Grid item xs={12} className={classes.modalFormScrollable}>
            <Grid item xs={12} className={classes.formFieldRow}>
              <FormSwitchWrapper
                checked={ruleState}
                id="ruleState"
                name="ruleState"
                label="Rule State"
                onChange={(e) => {
                  setRuleState(e.target.checked);
                }}
                value={ruleState}
              />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <PredefinedList label={"Destination"} content={destination} />
            </Grid>
            <Grid item xs={12} className={classes.formFieldRow}>
              <InputBoxWrapper
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
            </Grid>
            <Grid
              item
              xs={12}
              className={`${classes.spacerTop} ${classes.formFieldRow}`}
            >
              <InputBoxWrapper
                id="storageClass"
                name="storageClass"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTargetStorageClass(e.target.value);
                }}
                placeholder="STANDARD_IA,REDUCED_REDUNDANCY etc"
                label="Storage Class"
                value={targetStorageClass}
              />
            </Grid>
            <Grid item xs={12}>
              <fieldset className={classes.fieldGroup}>
                <legend className={classes.descriptionText}>
                  Object Filters
                </legend>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <InputBoxWrapper
                    id="prefix"
                    name="prefix"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPrefix(e.target.value);
                    }}
                    placeholder="prefix"
                    label="Prefix"
                    value={prefix}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
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
                </Grid>
              </fieldset>
            </Grid>
            <Grid item xs={12}>
              <fieldset className={classes.fieldGroup}>
                <legend className={classes.descriptionText}>
                  Replication Options
                </legend>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <FormSwitchWrapper
                    checked={repExisting}
                    id="repExisting"
                    name="repExisting"
                    label="Existing Objects"
                    onChange={(e) => {
                      setRepExisting(e.target.checked);
                    }}
                    value={repExisting}
                    description={"Replicate existing objects"}
                  />
                </Grid>
                <FormSwitchWrapper
                  checked={metadataSync}
                  id="metadatataSync"
                  name="metadatataSync"
                  label="Metadata Sync"
                  onChange={(e) => {
                    setMetadataSync(e.target.checked);
                  }}
                  value={metadataSync}
                  description={"Metadata Sync"}
                />
                <Grid item xs={12} className={classes.formFieldRow}>
                  <FormSwitchWrapper
                    checked={repDeleteMarker}
                    id="deleteMarker"
                    name="deleteMarker"
                    label="Delete Marker"
                    onChange={(e) => {
                      setRepDeleteMarker(e.target.checked);
                    }}
                    value={repDeleteMarker}
                    description={"Replicate soft deletes"}
                  />
                </Grid>
                <Grid item xs={12} className={classes.formFieldRow}>
                  <FormSwitchWrapper
                    checked={repDelete}
                    id="repDelete"
                    name="repDelete"
                    label="Deletes"
                    onChange={(e) => {
                      setRepDelete(e.target.checked);
                    }}
                    value={repDelete}
                    description={"Replicate versioned deletes"}
                  />
                </Grid>
              </fieldset>
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.modalButtonBar}>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              disabled={editLoading || saveEdit}
              onClick={() => {
                closeModalAndRefresh(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={editLoading || saveEdit}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </ModalWrapper>
  );
};
const connector = connect(null, {
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(EditReplicationModal));
