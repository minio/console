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
import { SelectChangeEvent, Tooltip } from "@mui/material";
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  modalBasic,
  wizardCommon,
} from "../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../actions";
import { BulkReplicationItem, BulkReplicationResponse } from "../types";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import PredefinedList from "../../Common/FormComponents/PredefinedList/PredefinedList";
import api from "../../../../common/api";
import GenericWizard from "../../Common/GenericWizard/GenericWizard";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import { SelectorTypes } from "../../Common/FormComponents/RadioGroupSelector/RadioGroupSelector";
import { getBytes, k8sfactorForDropdown } from "../../../../common/utils";
import { ErrorResponseHandler } from "../../../../common/types";

interface IBulkReplicationModal {
  open: boolean;
  closeModalAndRefresh: (clearSelection: boolean) => any;
  classes: any;
  buckets: string[];
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    buttonContainer: {
      textAlign: "right",
    },
    remoteBucketList: {
      display: "grid",
      gridTemplateColumns: "auto auto 45px",
      alignItems: "center",
      justifyContent: "stretch",
    },
    errorIcon: {
      color: "#C72C48",
    },
    successIcon: {
      color: "#42C91A",
    },
    hide: {
      opacity: 0,
      transitionDuration: "0.3s",
    },
    ...modalBasic,
    ...wizardCommon,
  });

const AddBulkReplicationModal = ({
  open,
  closeModalAndRefresh,
  classes,
  buckets,
  setModalErrorSnackMessage,
}: IBulkReplicationModal) => {
  const [bucketsToAlter, setBucketsToAlter] = useState<string[]>([]);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [externalLoading, setExternalLoading] = useState<boolean>(false);
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [targetURL, setTargetURL] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [useTLS, setUseTLS] = useState<boolean>(true);
  const [replicationMode, setReplicationMode] = useState<string>("async");
  const [bandwidthScalar, setBandwidthScalar] = useState<string>("100");
  const [bandwidthUnit, setBandwidthUnit] = useState<string>("Gi");
  const [healthCheck, setHealthCheck] = useState<string>("60");
  const [relationBuckets, setRelationBuckets] = useState<string[]>([]);
  const [remoteBucketsOpts, setRemoteBucketOpts] = useState<string[]>([]);
  const [responseItem, setResponseItem] = useState<BulkReplicationItem[]>([]);

  const optionsForBucketsDrop: SelectorTypes[] = remoteBucketsOpts.map(
    (remoteBucketName: string) => {
      return {
        label: remoteBucketName,
        value: remoteBucketName,
      };
    }
  );

  useEffect(() => {
    if (relationBuckets.length === 0) {
      const bucketsAlter: string[] = [];
      const relationBucketsAlter: string[] = [];

      buckets.forEach((item: string) => {
        bucketsAlter.push(item);
        relationBucketsAlter.push("");
      });

      setRelationBuckets(relationBucketsAlter);
      setBucketsToAlter(bucketsAlter);
    }
  }, [buckets, relationBuckets.length]);

  const addRecord = () => {
    setAddLoading(true);
    const replicate = bucketsToAlter.map((bucketName, index) => {
      return {
        originBucket: bucketName,
        destinationBucket: relationBuckets[index],
      };
    });

    const endURL = `${useTLS ? "https://" : "http://"}${targetURL}`;
    const hc = parseInt(healthCheck);

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
    };

    api
      .invoke("POST", "/api/v1/buckets-replication", remoteBucketsInfo)
      .then((response: BulkReplicationResponse) => {
        setAddLoading(false);

        const states = response.replicationState;
        setResponseItem(states);

        const filterErrors = states.filter(
          (itm) => itm.errorString && itm.errorString !== ""
        );

        if (filterErrors.length === 0) {
          closeModalAndRefresh(true);
        } else {
          setTimeout(() => {
            removeSuccessItems(states);
          }, 500);
        }
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  const retrieveRemoteBuckets = (
    wizardPageJump: (page: number | string) => void
  ) => {
    const remoteConnectInfo = {
      accessKey: accessKey,
      secretKey: secretKey,
      targetURL: targetURL,
      useTLS,
    };
    setExternalLoading(true);

    api
      .invoke("POST", "/api/v1/list-external-buckets", remoteConnectInfo)
      .then((dataReturn) => {
        const buckets = get(dataReturn, "buckets", []);

        if (buckets && buckets.length > 0) {
          const arrayReplaceBuckets = buckets.map((element: any) => {
            return element.name;
          });

          setRemoteBucketOpts(arrayReplaceBuckets);
        }

        wizardPageJump("++");
        setExternalLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        setExternalLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  const stateOfItem = (initialBucket: string) => {
    if (responseItem.length > 0) {
      const bucketResponse = responseItem.find(
        (item) => item.originBucket === initialBucket
      );

      if (bucketResponse) {
        const errString = get(bucketResponse, "errorString", "");

        if (errString) {
          return errString;
        }

        return "";
      }
    }
    return "n/a";
  };

  const LogoToShow = ({ errString }: { errString: string }) => {
    switch (errString) {
      case "":
        return (
          <div className={classes.successIcon}>
            <CheckCircleOutlineIcon />
          </div>
        );
      case "n/a":
        return null;
      default:
        if (errString) {
          return (
            <div className={classes.errorIcon}>
              <Tooltip title={errString} placement="top-start">
                <ErrorOutlineIcon />
              </Tooltip>
            </div>
          );
        }
    }
    return null;
  };

  const updateItem = (indexItem: number, value: string) => {
    const updatedList = [...relationBuckets];
    updatedList[indexItem] = value;
    setRelationBuckets(updatedList);
  };

  const itemDisplayBulk = (indexItem: number) => {
    if (remoteBucketsOpts.length > 0) {
      return (
        <Fragment>
          <SelectWrapper
            label=""
            id={`assign-bucket-${indexItem}`}
            name={`assign-bucket-${indexItem}`}
            value={relationBuckets[indexItem]}
            onChange={(e: SelectChangeEvent<string>) => {
              updateItem(indexItem, e.target.value as string);
            }}
            options={optionsForBucketsDrop}
            disabled={addLoading}
          />
        </Fragment>
      );
    }
    return (
      <Fragment>
        <InputBoxWrapper
          id={`assign-bucket-${indexItem}`}
          name={`assign-bucket-${indexItem}`}
          label=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            updateItem(indexItem, event.target.value);
          }}
          value={relationBuckets[indexItem]}
          disabled={addLoading}
        />
      </Fragment>
    );
  };

  const removeSuccessItems = (responseItem: BulkReplicationItem[]) => {
    let newBucketsToAlter = [...bucketsToAlter];
    let newRelationBuckets = [...relationBuckets];

    responseItem.forEach((successElement) => {
      const errorString = get(successElement, "errorString", "");

      if (!errorString || errorString === "") {
        const indexToRemove = newBucketsToAlter.indexOf(
          successElement.originBucket
        );

        newBucketsToAlter.splice(indexToRemove, 1);
        newRelationBuckets.splice(indexToRemove, 1);
      }
    });

    setBucketsToAlter(newBucketsToAlter);
    setRelationBuckets(newRelationBuckets);
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      title="Set Multiple Bucket Replication"
    >
      <GenericWizard
        loadingStep={addLoading || externalLoading}
        wizardSteps={[
          {
            label: "Remote Configuration",
            componentRender: (
              <Fragment>
                <Grid item xs={12}>
                  <PredefinedList
                    label="Local Buckets to replicate"
                    content={bucketsToAlter.join(", ")}
                  />
                </Grid>
                <h4>Remote Endpoint Configuration</h4>
                <span className={classes.descriptionText}>
                  Please avoid the use of root credentials for this feature
                </span>
                <br />
                <br />
                <Grid item xs={12}>
                  <InputBoxWrapper
                    id="accessKey"
                    name="accessKey"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setAccessKey(e.target.value);
                    }}
                    label="Access Key"
                    value={accessKey}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputBoxWrapper
                    id="secretKey"
                    name="secretKey"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setSecretKey(e.target.value);
                    }}
                    label="Secret Key"
                    value={secretKey}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputBoxWrapper
                    id="targetURL"
                    name="targetURL"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setTargetURL(e.target.value);
                    }}
                    placeholder="play.min.io:9000"
                    label="Target URL"
                    value={targetURL}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormSwitchWrapper
                    checked={useTLS}
                    id="useTLS"
                    name="useTLS"
                    label="Use TLS"
                    onChange={(e) => {
                      setUseTLS(e.target.checked);
                    }}
                    value="yes"
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputBoxWrapper
                    id="region"
                    name="region"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setRegion(e.target.value);
                    }}
                    label="Region"
                    value={region}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SelectWrapper
                    id="replication_mode"
                    name="replication_mode"
                    onChange={(e: SelectChangeEvent<string>) => {
                      setReplicationMode(e.target.value as string);
                    }}
                    label="Replication Mode"
                    value={replicationMode}
                    options={[
                      { label: "Asynchronous", value: "async" },
                      { label: "Synchronous", value: "sync" },
                    ]}
                  />
                </Grid>
                {replicationMode === "async" && (
                  <Grid item xs={12}>
                    <div className={classes.multiContainer}>
                      <div>
                        <InputBoxWrapper
                          type="number"
                          id="bandwidth_scalar"
                          name="bandwidth_scalar"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setBandwidthScalar(e.target.value as string);
                          }}
                          label="Bandwidth"
                          value={bandwidthScalar}
                          min="0"
                        />
                      </div>
                      <div className={classes.sizeFactorContainer}>
                        <SelectWrapper
                          label={"Unit"}
                          id="bandwidth_unit"
                          name="bandwidth_unit"
                          value={bandwidthUnit}
                          onChange={(e: SelectChangeEvent<string>) => {
                            setBandwidthUnit(e.target.value as string);
                          }}
                          options={k8sfactorForDropdown()}
                        />
                      </div>
                    </div>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <InputBoxWrapper
                    id="healthCheck"
                    name="healthCheck"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setHealthCheck(e.target.value as string);
                    }}
                    label="Health Check Duration"
                    value={healthCheck}
                  />
                </Grid>
              </Fragment>
            ),
            buttons: [
              {
                type: "custom",
                label: "Next",
                enabled: !externalLoading,
                action: retrieveRemoteBuckets,
              },
            ],
          },
          {
            label: "Bucket Assignments",
            componentRender: (
              <Fragment>
                <h3>Remote Bucket Assignments</h3>
                <span className={classes.descriptionText}>
                  Please select / type the desired remote bucket were you want
                  the local data to be replicated.
                </span>
                <div className={classes.remoteBucketList}>
                  {bucketsToAlter.map((bucketName: string, index: number) => {
                    const errorItem = stateOfItem(bucketName);
                    return (
                      <Fragment
                        key={`buckets-assignation-${index.toString()}-${bucketName}`}
                      >
                        <div className={errorItem === "" ? classes.hide : ""}>
                          {bucketName}
                        </div>
                        <div className={errorItem === "" ? classes.hide : ""}>
                          {itemDisplayBulk(index)}
                        </div>
                        <div className={errorItem === "" ? classes.hide : ""}>
                          {responseItem.length > 0 && (
                            <LogoToShow errString={errorItem} />
                          )}
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </Fragment>
            ),
            buttons: [
              {
                type: "back",
                label: "Back",
                enabled: true,
              },
              {
                type: "next",
                label: "Create",
                enabled: !addLoading,
                action: addRecord,
              },
            ],
          },
        ]}
        forModal
      />
    </ModalWrapper>
  );
};

const connector = connect(null, {
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(AddBulkReplicationModal));
