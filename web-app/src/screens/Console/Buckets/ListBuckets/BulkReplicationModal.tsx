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
import {
  Box,
  CheckCircleIcon,
  FormLayout,
  InputBox,
  ReadBox,
  Select,
  Switch,
  Tooltip,
  WarnIcon,
  Wizard,
} from "mds";
import get from "lodash/get";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { getBytes, k8sScalarUnitsExcluding } from "../../../../common/utils";
import InputUnitMenu from "../../Common/FormComponents/InputUnitMenu/InputUnitMenu";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { api } from "api";
import { MultiBucketResponseItem } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import { SelectorTypes } from "../../../../common/types";

interface IBulkReplicationModal {
  open: boolean;
  closeModalAndRefresh: (clearSelection: boolean) => any;
  buckets: string[];
}

const AddBulkReplicationModal = ({
  open,
  closeModalAndRefresh,
  buckets,
}: IBulkReplicationModal) => {
  const dispatch = useAppDispatch();
  const [bucketsToAlter, setBucketsToAlter] = useState<string[]>([]);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [externalLoading, setExternalLoading] = useState<boolean>(false);
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [targetURL, setTargetURL] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [useTLS, setUseTLS] = useState<boolean>(true);
  const [replicationMode, setReplicationMode] = useState<"async" | "sync">(
    "async",
  );
  const [bandwidthScalar, setBandwidthScalar] = useState<string>("100");
  const [bandwidthUnit, setBandwidthUnit] = useState<string>("Gi");
  const [healthCheck, setHealthCheck] = useState<string>("60");
  const [relationBuckets, setRelationBuckets] = useState<string[]>([]);
  const [remoteBucketsOpts, setRemoteBucketOpts] = useState<string[]>([]);
  const [responseItem, setResponseItem] = useState<
    MultiBucketResponseItem[] | undefined
  >([]);

  const optionsForBucketsDrop: SelectorTypes[] = remoteBucketsOpts.map(
    (remoteBucketName: string) => {
      return {
        label: remoteBucketName,
        value: remoteBucketName,
      };
    },
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

    api.bucketsReplication
      .setMultiBucketReplication(remoteBucketsInfo)
      .then((response) => {
        setAddLoading(false);

        const states = response.data.replicationState;
        setResponseItem(states);

        const filterErrors = states?.filter(
          (itm) => itm.errorString && itm.errorString !== "",
        );

        if (filterErrors?.length === 0) {
          closeModalAndRefresh(true);
        } else {
          setTimeout(() => {
            removeSuccessItems(states);
          }, 500);
        }
      })
      .catch((err) => {
        setAddLoading(false);
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
      });
  };

  const retrieveRemoteBuckets = (
    wizardPageJump: (page: number | string) => void,
  ) => {
    const remoteConnectInfo = {
      accessKey: accessKey,
      secretKey: secretKey,
      targetURL: targetURL,
      useTLS,
    };
    setExternalLoading(true);

    api.listExternalBuckets
      .listExternalBuckets(remoteConnectInfo)
      .then((res) => {
        const buckets = get(res.data, "buckets", []);

        if (buckets && buckets.length > 0) {
          const arrayReplaceBuckets = buckets.map((element: any) => {
            return element.name;
          });

          setRemoteBucketOpts(arrayReplaceBuckets);
        }

        wizardPageJump("++");
        setExternalLoading(false);
      })
      .catch((err) => {
        setExternalLoading(false);
        dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
      });
  };

  const stateOfItem = (initialBucket: string) => {
    if (responseItem && responseItem.length > 0) {
      const bucketResponse = responseItem.find(
        (item) => item.originBucket === initialBucket,
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
          <Box
            sx={{
              color: "#42C91A",
            }}
          >
            <CheckCircleIcon />
          </Box>
        );
      case "n/a":
        return null;
      default:
        if (errString) {
          return (
            <Box
              sx={{
                color: "#C72C48",
              }}
            >
              <Tooltip tooltip={errString} placement="top">
                <WarnIcon />
              </Tooltip>
            </Box>
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
          <Select
            label=""
            id={`assign-bucket-${indexItem}`}
            name={`assign-bucket-${indexItem}`}
            value={relationBuckets[indexItem]}
            onChange={(value) => {
              updateItem(indexItem, value);
            }}
            options={optionsForBucketsDrop}
            disabled={addLoading}
          />
        </Fragment>
      );
    }
    return (
      <Fragment>
        <InputBox
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

  const removeSuccessItems = (
    responseItem: MultiBucketResponseItem[] | undefined,
  ) => {
    let newBucketsToAlter = [...bucketsToAlter];
    let newRelationBuckets = [...relationBuckets];

    responseItem?.forEach((successElement) => {
      const errorString = get(successElement, "errorString", "");

      if (!errorString || errorString === "") {
        const indexToRemove = newBucketsToAlter.indexOf(
          successElement.originBucket || "",
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
      <Wizard
        loadingStep={addLoading || externalLoading}
        wizardSteps={[
          {
            label: "Remote Configuration",
            componentRender: (
              <Fragment>
                <FormLayout containerPadding={false} withBorders={false}>
                  <ReadBox
                    label="Local Buckets to replicate"
                    sx={{ maxWidth: "440px", width: "100%" }}
                  >
                    {bucketsToAlter.join(", ")}
                  </ReadBox>
                  <h4>Remote Endpoint Configuration</h4>
                  <span style={{ fontSize: 14 }}>
                    Please avoid the use of root credentials for this feature
                    <br />
                    <br />
                  </span>
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
                    id="targetURL"
                    name="targetURL"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setTargetURL(e.target.value);
                    }}
                    placeholder="play.min.io:9000"
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
                      setReplicationMode(value as "sync" | "async");
                    }}
                    label="Replication Mode"
                    value={replicationMode}
                    options={[
                      { label: "Asynchronous", value: "async" },
                      { label: "Synchronous", value: "sync" },
                    ]}
                  />
                  {replicationMode === "async" && (
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
                </FormLayout>
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
                <span style={{ fontSize: 14 }}>
                  Please select / type the desired remote bucket were you want
                  the local data to be replicated.
                </span>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "auto auto 45px",
                    alignItems: "center",
                    justifyContent: "stretch",
                    "& .hide": {
                      opacity: 0,
                      transitionDuration: "0.3s",
                    },
                  }}
                >
                  {bucketsToAlter.map((bucketName: string, index: number) => {
                    const errorItem = stateOfItem(bucketName);
                    return (
                      <Fragment
                        key={`buckets-assignation-${index.toString()}-${bucketName}`}
                      >
                        <div className={errorItem === "" ? "hide" : ""}>
                          {bucketName}
                        </div>
                        <div className={errorItem === "" ? "hide" : ""}>
                          {itemDisplayBulk(index)}
                        </div>
                        <div className={errorItem === "" ? "hide" : ""}>
                          {responseItem && responseItem.length > 0 && (
                            <LogoToShow errString={errorItem} />
                          )}
                        </div>
                      </Fragment>
                    );
                  })}
                </Box>
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

export default AddBulkReplicationModal;
