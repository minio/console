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
  Select,
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
import { getBytes, k8sScalarUnitsExcluding } from "common/utils";
import get from "lodash/get";
import InputUnitMenu from "screens/Console/Common/FormComponents/InputUnitMenu/InputUnitMenu";

const AddBucketReplication = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  let params = new URLSearchParams(document.location.search);
  const bucketName = params.get("bucketName") || "";
  const nextPriority = params.get("nextPriority") || "1";
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [priority, setPriority] = useState<string>(nextPriority);
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [targetURL, setTargetURL] = useState<string>("");
  const [targetStorageClass, setTargetStorageClass] = useState<string>("");
  const [prefix, setPrefix] = useState<string>("");
  const [targetBucket, setTargetBucket] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [useTLS, setUseTLS] = useState<boolean>(true);
  const [repDeleteMarker, setRepDeleteMarker] = useState<boolean>(true);
  const [repDelete, setRepDelete] = useState<boolean>(true);
  const [metadataSync, setMetadataSync] = useState<boolean>(true);
  const [repExisting, setRepExisting] = useState<boolean>(true);
  const [tags, setTags] = useState<string>("");
  const [replicationMode, setReplicationMode] = useState<"async" | "sync">(
    "async",
  );
  const [bandwidthScalar, setBandwidthScalar] = useState<string>("100");
  const [bandwidthUnit, setBandwidthUnit] = useState<string>("Gi");
  const [healthCheck, setHealthCheck] = useState<string>("60");
  const [validated, setValidated] = useState<boolean>(false);
  const backLink = IAM_PAGES.BUCKETS + `/${bucketName}/admin/replication`;
  useEffect(() => {
    dispatch(setHelpName("bucket-replication-add"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addRecord = () => {
    const replicate = [
      {
        originBucket: bucketName,
        destinationBucket: targetBucket,
      },
    ];

    const hc = parseInt(healthCheck);

    const endURL = `${useTLS ? "https://" : "http://"}${targetURL}`;

    const remoteBucketsInfo = {
      accessKey: accessKey,
      secretKey: secretKey,
      targetURL: endURL,
      region: region,
      bucketsRelation: replicate,
      syncMode: replicationMode,
      bandwidth:
        replicationMode === "async"
          ? parseInt(getBytes(bandwidthScalar, bandwidthUnit, true))
          : 0,
      healthCheckPeriod: hc,
      prefix: prefix,
      tags: tags,
      replicateDeleteMarkers: repDeleteMarker,
      replicateDeletes: repDelete,
      replicateExistingObjects: repExisting,
      priority: parseInt(priority),
      storageClass: targetStorageClass,
      replicateMetadata: metadataSync,
    };

    api.bucketsReplication
      .setMultiBucketReplication(remoteBucketsInfo)
      .then((res) => {
        setAddLoading(false);

        const states = get(res.data, "replicationState", []);

        if (states.length > 0) {
          const itemVal = states[0];

          setAddLoading(false);

          if (itemVal.errorString && itemVal.errorString !== "") {
            dispatch(
              setErrorSnackMessage({
                errorMessage: "There was an error",
                detailedError: itemVal.errorString,
              }),
            );
            // navigate(backLink);
            return;
          }
          navigate(backLink);
          return;
        }
        dispatch(
          setErrorSnackMessage({
            errorMessage: "No changes applied",
            detailedError: "",
          }),
        );
      })
      .catch((err) => {
        console.log("this is an error!");
        setAddLoading(false);
        dispatch(setErrorSnackMessage(errorToHandler(err.error)));
      });
  };

  useEffect(() => {
    !validated &&
      accessKey.length >= 3 &&
      secretKey.length >= 8 &&
      targetBucket.length >= 3 &&
      targetURL.length > 0 &&
      setValidated(true);
  }, [targetURL, accessKey, secretKey, targetBucket, validated]);

  useEffect(() => {
    if (
      validated &&
      (accessKey.length < 3 ||
        secretKey.length < 8 ||
        targetBucket.length < 3 ||
        targetURL.length < 1)
    ) {
      setValidated(false);
    }
  }, [targetURL, accessKey, secretKey, targetBucket, validated]);

  return (
    <Fragment>
      <PageHeaderWrapper
        label={
          <BackLink
            label={"Add Bucket Replication Rule - " + bucketName}
            onClick={() => navigate(backLink)}
          />
        }
        actions={<HelpMenu />}
      />
      <PageLayout>
        <FormLayout
          title="Add Replication Rule"
          icon={<BucketReplicationIcon />}
          helpBox={
            <HelpBox
              iconComponent={<BucketReplicationIcon />}
              title="Bucket Replication Configuration"
              help={
                <Fragment>
                  <Box sx={{ paddconngTop: "10px" }}>
                    The bucket selected in this deployment acts as the “source”
                    while the configured remote deployment acts as the “target”.
                  </Box>
                  <Box sx={{ paddingTop: "10px" }}>
                    For each write operation to this "source" bucket, MinIO
                    checks all configured replication rules and applies the
                    matching rule with highest configured priority.
                  </Box>
                  <Box sx={{ paddingTop: "10px" }}>
                    MinIO supports automatically replicating existing objects in
                    a bucket; this setting is enabled by default. Please note
                    that objects created before replication was configured or
                    while replication is disabled are not synchronized to the
                    target deployment in case this setting is not enabled.
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
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              setAddLoading(true);
              addRecord();
            }}
          >
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
              id="targetURL"
              name="targetURL"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTargetURL(e.target.value);
              }}
              placeholder="play.min.io"
              label="Target URL"
              value={targetURL}
            />

            <Switch
              checked={useTLS}
              id="useTLS"
              name="useTLS"
              label="Use TLS"
              onChange={(e) => {
                setUseTLS(e.target.checked);
              }}
              value="yes"
            />

            <InputBox
              id="accessKey"
              name="accessKey"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAccessKey(e.target.value);
              }}
              label="Access Key"
              value={accessKey}
            />

            <InputBox
              id="secretKey"
              name="secretKey"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSecretKey(e.target.value);
              }}
              label="Secret Key"
              value={secretKey}
            />

            <InputBox
              id="targetBucket"
              name="targetBucket"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTargetBucket(e.target.value);
              }}
              label="Target Bucket"
              value={targetBucket}
            />

            <InputBox
              id="region"
              name="region"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setRegion(e.target.value);
              }}
              label="Region"
              value={region}
            />

            <Select
              id="replication_mode"
              name="replication_mode"
              onChange={(value) => {
                setReplicationMode(value as "async" | "sync");
              }}
              label="Replication Mode"
              value={replicationMode}
              options={[
                { label: "Asynchronous", value: "async" },
                { label: "Synchronous", value: "sync" },
              ]}
            />

            {replicationMode === "async" && (
              <Box className={"inputItem"}>
                <InputBox
                  type="number"
                  id="bandwidth_scalar"
                  name="bandwidth_scalar"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.validity.valid) {
                      setBandwidthScalar(e.target.value as string);
                    }
                  }}
                  label="Bandwidth"
                  value={bandwidthScalar}
                  min="0"
                  pattern={"[0-9]*"}
                  overlayObject={
                    <InputUnitMenu
                      id={"quota_unit"}
                      onUnitChange={(newValue) => {
                        setBandwidthUnit(newValue);
                      }}
                      unitSelected={bandwidthUnit}
                      unitsList={k8sScalarUnitsExcluding(["Ki"])}
                      disabled={false}
                    />
                  }
                />
              </Box>
            )}

            <InputBox
              id="healthCheck"
              name="healthCheck"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setHealthCheck(e.target.value as string);
              }}
              label="Health Check Duration"
              value={healthCheck}
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
                elements={""}
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
                id={"cancel"}
                type="button"
                variant="regular"
                disabled={addLoading}
                onClick={() => {
                  navigate(backLink);
                }}
                label={"Cancel"}
              />
              <Button
                id={"submit"}
                type="submit"
                variant="callAction"
                color="primary"
                disabled={addLoading || !validated}
                label={"Save"}
              />
            </Grid>
          </form>
        </FormLayout>
      </PageLayout>
    </Fragment>
  );
};
export default AddBucketReplication;
