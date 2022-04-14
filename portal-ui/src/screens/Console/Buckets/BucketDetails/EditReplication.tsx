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
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import { Button } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import QueryMultiSelector from "../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import {
  containerForHeader,
  createTenantCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import { BucketReplicationRule } from "../types";
import { connect } from "react-redux";
import { setErrorSnackMessage, setSnackBarMessage } from "../../../../actions";
import api from "../../../../common/api";
import { ErrorResponseHandler } from "../../../../common/types";
import PredefinedList from "../../Common/FormComponents/PredefinedList/PredefinedList";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import BackLink from "../../../../common/BackLink";
import PageLayout from "../../Common/Layout/PageLayout";
import PageHeader from "../../Common/PageHeader/PageHeader";
import { BucketReplicationIcon } from "../../../../icons";

interface IEditReplication {
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setSnackBarMessage: typeof setSnackBarMessage;
  match: any;
  history: any;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      marginTop: 24,
      textAlign: "right",
      "& .MuiButton-root": {
        marginLeft: 8,
      },
    },
    error: {
      color: "#b53b4b",
      border: "1px solid #b53b4b",
      padding: 8,
      borderRadius: 3,
    },
    title: {
      marginBottom: 8,
    },
    headTitle: {
      fontWeight: "bold",
      fontSize: 16,
      paddingLeft: 8,
    },
    h6title: {
      fontWeight: "bold",
      color: "#000000",
      fontSize: 20,
      paddingBottom: 8,
    },
    fieldGroup: {
      ...createTenantCommon.fieldGroup,
    },
    ...containerForHeader(theme.spacing(4)),
  });

const EditReplication = ({
  setErrorSnackMessage,
  setSnackBarMessage,
  match,
  history,
  classes,
}: IEditReplication) => {
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
  const bucketName = match.params["bucketName"];
  const ruleID = match.params["rule"];

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
          setErrorSnackMessage(err);
          setEditLoading(false);
        });
    }
  }, [editLoading, setErrorSnackMessage, bucketName, ruleID]);

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
          setSnackBarMessage("Successfully modified replication rule");
        })
        .catch((err: ErrorResponseHandler) => {
          setErrorSnackMessage(err);
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
    setSnackBarMessage,
    setErrorSnackMessage,
  ]);

  return (
    <Fragment>
      <PageHeader
        label={
          <BackLink
            label={"Back to Replication Rules"}
            to={`/buckets/${bucketName}/admin/replication`}
          />
        }
      />
      <PageLayout>
        <Grid item xs={12} className={classes.boxy}>
          <Grid container spacing={1}>
            <Grid
              item
              xs={12}
              container
              className={classes.title}
              alignItems={"center"}
            >
              <Grid item xs={"auto"}>
                <BucketReplicationIcon />
              </Grid>
              <Grid item xs className={classes.headTitle}>
                Edit Replication Rule
              </Grid>
            </Grid>
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
          <Grid item xs={12} className={classes.buttonContainer}>
            <Button
              type="button"
              variant="outlined"
              color="primary"
              disabled={editLoading || saveEdit}
              onClick={() => {
                history.push(`/buckets/${bucketName}/admin/replication`);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="contained"
              color="primary"
              disabled={editLoading || saveEdit}
              onClick={() => {
                setSaveEdit(true);
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};
const connector = connect(null, {
  setErrorSnackMessage,
  setSnackBarMessage,
});

export default connector(withStyles(styles)(EditReplication));
