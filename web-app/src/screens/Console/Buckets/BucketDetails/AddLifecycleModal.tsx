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

import get from "lodash/get";
import {
  Accordion,
  AlertIcon,
  Button,
  FormLayout,
  Grid,
  HelpTip,
  InputBox,
  LifecycleConfigIcon,
  ProgressBar,
  RadioGroup,
  Select,
  Switch,
} from "mds";
import { useSelector } from "react-redux";
import { api } from "api";
import { BucketVersioningResponse } from "api/consoleApi";
import { errorToHandler } from "api/errors";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import { selDistSet, setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { ITiersDropDown } from "../types";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import QueryMultiSelector from "../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import InputUnitMenu from "../../Common/FormComponents/InputUnitMenu/InputUnitMenu";
import { IAM_PAGES } from "common/SecureComponent/permissions";

interface IReplicationModal {
  open: boolean;
  closeModalAndRefresh: (refresh: boolean) => any;
  bucketName: string;
}

const AddLifecycleModal = ({
  open,
  closeModalAndRefresh,
  bucketName,
}: IReplicationModal) => {
  const dispatch = useAppDispatch();
  const distributedSetup = useSelector(selDistSet);
  const [loadingTiers, setLoadingTiers] = useState<boolean>(true);
  const [tiersList, setTiersList] = useState<ITiersDropDown[]>([]);
  const [addLoading, setAddLoading] = useState(false);
  const [versioningInfo, setVersioningInfo] =
    useState<BucketVersioningResponse | null>(null);
  const [prefix, setPrefix] = useState("");
  const [tags, setTags] = useState<string>("");
  const [storageClass, setStorageClass] = useState("");

  const [ilmType, setIlmType] = useState<"expiry" | "transition">("expiry");
  const [targetVersion, setTargetVersion] = useState<"current" | "noncurrent">(
    "current",
  );
  const [lifecycleDays, setLifecycleDays] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [expiredObjectDM, setExpiredObjectDM] = useState<boolean>(false);
  const [expiredAllVersionsDM, setExpiredAllVersionsDM] =
    useState<boolean>(false);
  const [loadingVersioning, setLoadingVersioning] = useState<boolean>(true);
  const [expandedAdv, setExpandedAdv] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [expiryUnit, setExpiryUnit] = useState<string>("days");

  /*To be removed on component replacement*/
  const formFieldRowFilter = {
    "& .MuiPaper-root": { padding: 0 },
  };

  useEffect(() => {
    if (loadingTiers) {
      api.admin
        .tiersListNames()
        .then((res) => {
          const tiersList: string[] | null = get(res.data, "items", []);

          if (tiersList !== null && tiersList.length >= 1) {
            const objList = tiersList.map((tierName: string) => {
              return { label: tierName, value: tierName };
            });

            setTiersList(objList);
            if (objList.length > 0) {
              setStorageClass(objList[0].value);
            }
          }
          setLoadingTiers(false);
        })
        .catch((err) => {
          setLoadingTiers(false);
          dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        });
    }
  }, [dispatch, loadingTiers]);

  useEffect(() => {
    let valid = true;

    if (ilmType !== "expiry") {
      if (storageClass === "") {
        valid = false;
      }
    }
    if (!lifecycleDays || parseInt(lifecycleDays) === 0) {
      valid = false;
    }
    if (parseInt(lifecycleDays) > 2147483647) {
      //values over int32 cannot be parsed
      valid = false;
    }
    setIsFormValid(valid);
  }, [ilmType, lifecycleDays, storageClass]);

  useEffect(() => {
    if (loadingVersioning && distributedSetup) {
      api.buckets
        .getBucketVersioning(bucketName)
        .then((res) => {
          setVersioningInfo(res.data);
          setLoadingVersioning(false);
        })
        .catch((err) => {
          dispatch(setModalErrorSnackMessage(errorToHandler(err)));
          setLoadingVersioning(false);
        });
    }
  }, [loadingVersioning, dispatch, bucketName, distributedSetup]);

  const addRecord = () => {
    let rules = {};

    if (ilmType === "expiry") {
      let expiry: { [key: string]: number } = {};

      if (targetVersion === "current") {
        expiry["expiry_days"] = parseInt(lifecycleDays);
      } else if (expiryUnit === "days") {
        expiry["noncurrentversion_expiration_days"] = parseInt(lifecycleDays);
      } else {
        expiry["newer_noncurrentversion_expiration_versions"] =
          parseInt(lifecycleDays);
      }

      rules = {
        ...expiry,
      };
    } else {
      let transition: { [key: string]: number | string } = {};
      if (targetVersion === "current") {
        transition["transition_days"] = parseInt(lifecycleDays);
        transition["storage_class"] = storageClass;
      } else if (expiryUnit === "days") {
        transition["noncurrentversion_transition_days"] =
          parseInt(lifecycleDays);
        transition["noncurrentversion_transition_storage_class"] = storageClass;
      }

      rules = {
        ...transition,
      };
    }

    const lifecycleInsert = {
      type: ilmType,
      prefix,
      tags,
      expired_object_delete_marker: expiredObjectDM,
      expired_object_delete_all: expiredAllVersionsDM,
      ...rules,
    };

    api.buckets
      .addBucketLifecycle(bucketName, lifecycleInsert)
      .then(() => {
        setAddLoading(false);
        closeModalAndRefresh(true);
      })
      .catch((err) => {
        setAddLoading(false);
        dispatch(setModalErrorSnackMessage(errorToHandler(err)));
      });
  };
  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      title="Add Lifecycle Rule"
      titleIcon={<LifecycleConfigIcon />}
    >
      {loadingTiers && (
        <Grid container>
          <Grid item xs={12}>
            <ProgressBar />
          </Grid>
        </Grid>
      )}

      {!loadingTiers && (
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setAddLoading(true);
            addRecord();
          }}
        >
          <FormLayout withBorders={false} containerPadding={false}>
            <RadioGroup
              currentValue={ilmType}
              id="ilm_type"
              name="ilm_type"
              label="Type of Lifecycle"
              onChange={(e) => {
                setIlmType(e.target.value as "expiry" | "transition");
              }}
              selectorOptions={[
                { value: "expiry", label: "Expiry" },
                { value: "transition", label: "Transition" },
              ]}
              helpTip={
                <Fragment>
                  Select{" "}
                  <a
                    target="blank"
                    href="https://min.io/docs/minio/kubernetes/upstream/administration/object-management/create-lifecycle-management-expiration-rule.html"
                  >
                    Expiry
                  </a>{" "}
                  to delete Objects per this rule. Select{" "}
                  <a
                    target="blank"
                    href="https://min.io/docs/minio/kubernetes/upstream/administration/object-management/transition-objects-to-minio.html"
                  >
                    Transition
                  </a>{" "}
                  to move Objects to a remote storage{" "}
                  <a
                    target="blank"
                    href="https://min.io/docs/minio/windows/administration/object-management/transition-objects-to-minio.html#configure-the-remote-storage-tier"
                  >
                    Tier
                  </a>{" "}
                  per this rule.
                </Fragment>
              }
              helpTipPlacement="right"
            />
            {versioningInfo?.status === "Enabled" && (
              <Select
                value={targetVersion}
                id="object_version"
                name="object_version"
                label="Object Version"
                onChange={(value) => {
                  setTargetVersion(value as "current" | "noncurrent");
                }}
                options={[
                  { value: "current", label: "Current Version" },
                  { value: "noncurrent", label: "Non-Current Version" },
                ]}
                helpTip={
                  <Fragment>
                    Select whether to apply the rule to current or non-current
                    Object
                    <a
                      target="blank"
                      href="https://min.io/docs/minio/kubernetes/upstream/administration/object-management/create-lifecycle-management-expiration-rule.html#expire-versioned-objects"
                    >
                      {" "}
                      Versions
                    </a>
                  </Fragment>
                }
                helpTipPlacement="right"
              />
            )}

            <InputBox
              error={
                lifecycleDays && !isFormValid
                  ? parseInt(lifecycleDays) <= 0
                    ? `Number of ${expiryUnit} to retain must be greater than zero`
                    : parseInt(lifecycleDays) > 2147483647
                      ? `Number of ${expiryUnit} must be less than or equal to 2147483647`
                      : ""
                  : ""
              }
              id="expiry_days"
              name="expiry_days"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.validity.valid) {
                  setLifecycleDays(e.target.value);
                }
              }}
              pattern={"[0-9]*"}
              label="After"
              value={lifecycleDays}
              overlayObject={
                <Fragment>
                  <Grid container sx={{ justifyContent: "center" }}>
                    <InputUnitMenu
                      id={"expire-current-unit"}
                      unitSelected={expiryUnit}
                      unitsList={[
                        { label: "Days", value: "days" },
                        { label: "Versions", value: "versions" },
                      ]}
                      disabled={
                        targetVersion !== "noncurrent" || ilmType !== "expiry"
                      }
                      onUnitChange={(newValue) => {
                        setExpiryUnit(newValue);
                      }}
                    />
                    {ilmType === "expiry" && targetVersion === "noncurrent" && (
                      <HelpTip
                        content={
                          <Fragment>
                            Select to set expiry by days or newer noncurrent
                            versions
                          </Fragment>
                        }
                        placement="right"
                      >
                        {" "}
                        <AlertIcon style={{ width: 15, height: 15 }} />
                      </HelpTip>
                    )}
                  </Grid>
                </Fragment>
              }
            />

            {ilmType === "expiry" ? (
              <Fragment />
            ) : (
              <Select
                label="To Tier"
                id="storage_class"
                name="storage_class"
                value={storageClass}
                onChange={(value) => {
                  setStorageClass(value as string);
                }}
                options={tiersList}
                helpTip={
                  <Fragment>
                    Configure a{" "}
                    <a
                      href={IAM_PAGES.TIERS_ADD}
                      color="secondary"
                      style={{ textDecoration: "underline" }}
                    >
                      remote tier
                    </a>{" "}
                    to receive transitioned Objects
                  </Fragment>
                }
                helpTipPlacement="right"
              />
            )}
            <Grid item xs={12} sx={formFieldRowFilter}>
              <Accordion
                title={"Filters"}
                id={"lifecycle-filters"}
                expanded={expanded}
                onTitleClick={() => setExpanded(!expanded)}
              >
                <Grid item xs={12}>
                  <InputBox
                    id="prefix"
                    name="prefix"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setPrefix(e.target.value);
                    }}
                    label="Prefix"
                    value={prefix}
                  />
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
              </Accordion>
            </Grid>
            {ilmType === "expiry" && targetVersion === "noncurrent" && (
              <Grid item xs={12} sx={formFieldRowFilter}>
                <Accordion
                  title={"Advanced"}
                  id={"lifecycle-advanced-filters"}
                  expanded={expandedAdv}
                  onTitleClick={() => setExpandedAdv(!expandedAdv)}
                  sx={{ marginTop: 15 }}
                >
                  <Grid item xs={12}>
                    <Switch
                      value="expired_delete_marker"
                      id="expired_delete_marker"
                      name="expired_delete_marker"
                      checked={expiredObjectDM}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setExpiredObjectDM(event.target.checked);
                      }}
                      label={"Expire Delete Marker"}
                      description={
                        "Remove the reference to the object if no versions are left"
                      }
                    />
                    <Switch
                      value="expired_delete_all"
                      id="expired_delete_all"
                      name="expired_delete_all"
                      checked={expiredAllVersionsDM}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        setExpiredAllVersionsDM(event.target.checked);
                      }}
                      label={"Expire All Versions"}
                      description={
                        "Removes all the versions of the object already expired"
                      }
                    />
                  </Grid>
                </Accordion>
              </Grid>
            )}

            <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
              <Button
                id={"reset"}
                type="button"
                variant="regular"
                disabled={addLoading}
                onClick={() => {
                  closeModalAndRefresh(false);
                }}
                label={"Cancel"}
              />
              <Button
                id={"save-lifecycle"}
                type="submit"
                variant="callAction"
                color="primary"
                disabled={addLoading || !isFormValid}
                label={"Save"}
              />
            </Grid>
            {addLoading && (
              <Grid item xs={12}>
                <ProgressBar />
              </Grid>
            )}
          </FormLayout>
        </form>
      )}
    </ModalWrapper>
  );
};

export default AddLifecycleModal;
