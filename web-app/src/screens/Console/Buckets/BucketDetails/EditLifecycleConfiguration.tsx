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
  Button,
  FormLayout,
  Grid,
  InputBox,
  LifecycleConfigIcon,
  Loader,
  ProgressBar,
  RadioGroup,
  Select,
  Switch,
} from "mds";
import { api } from "api";
import { ApiError } from "api/consoleApi";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import { ITiersDropDown, LifeCycleItem } from "../types";
import {
  setErrorSnackMessage,
  setModalErrorSnackMessage,
} from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import QueryMultiSelector from "../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import { errorToHandler } from "../../../../api/errors";

interface IAddUserContentProps {
  closeModalAndRefresh: (reload: boolean) => void;
  selectedBucket: string;
  lifecycleRule: LifeCycleItem;
  open: boolean;
}

const EditLifecycleConfiguration = ({
  closeModalAndRefresh,
  selectedBucket,
  lifecycleRule,
  open,
}: IAddUserContentProps) => {
  const dispatch = useAppDispatch();
  const [loadingTiers, setLoadingTiers] = useState<boolean>(true);
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(false);
  const [tiersList, setTiersList] = useState<ITiersDropDown[]>([]);
  const [prefix, setPrefix] = useState("");
  const [storageClass, setStorageClass] = useState("");
  const [NCTransitionSC, setNCTransitionSC] = useState("");
  const [expiredObjectDM, setExpiredObjectDM] = useState<boolean>(false);
  const [expiredAllVersionsDM, setExpiredAllVersionsDM] =
    useState<boolean>(false);
  const [NCExpirationDays, setNCExpirationDays] = useState<string>("0");
  const [NCTransitionDays, setNCTransitionDays] = useState<string>("0");
  const [ilmType, setIlmType] = useState<"transition" | "expiry">("expiry");
  const [expiryDays, setExpiryDays] = useState<string>("0");
  const [transitionDays, setTransitionDays] = useState<string>("0");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [expandedAdv, setExpandedAdv] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  const ILM_TYPES = [
    { value: "expiry", label: "Expiry" },
    { value: "transition", label: "Transition" },
  ];

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
              setStorageClass(lifecycleRule.transition?.storage_class || "");
            }
          }
          setLoadingTiers(false);
        })
        .catch((err) => {
          setLoadingTiers(false);
          dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        });
    }
  }, [dispatch, loadingTiers, lifecycleRule.transition?.storage_class]);

  useEffect(() => {
    let valid = true;

    if (ilmType !== "expiry") {
      if (
        (transitionDays !== "0" && storageClass === "") ||
        (NCTransitionDays !== "0" && NCTransitionSC === "")
      ) {
        valid = false;
      }
    }
    setIsFormValid(valid);
  }, [
    ilmType,
    expiryDays,
    transitionDays,
    storageClass,
    NCTransitionDays,
    NCTransitionSC,
  ]);

  useEffect(() => {
    if (lifecycleRule.status === "Enabled") {
      setEnabled(true);
    }

    let transitionMode = false;

    if (lifecycleRule.transition) {
      if (
        lifecycleRule.transition.days &&
        lifecycleRule.transition.days !== 0
      ) {
        setTransitionDays(lifecycleRule.transition.days.toString());
        setIlmType("transition");
        transitionMode = true;
      }
      if (
        lifecycleRule.transition.noncurrent_transition_days &&
        lifecycleRule.transition.noncurrent_transition_days !== 0
      ) {
        setNCTransitionDays(
          lifecycleRule.transition.noncurrent_transition_days.toString(),
        );
        setIlmType("transition");
        transitionMode = true;
      }

      // Fallback to old rules by date
      if (
        lifecycleRule.transition.date &&
        lifecycleRule.transition.date !== "0001-01-01T00:00:00Z"
      ) {
        setIlmType("transition");
        transitionMode = true;
      }
    }

    if (lifecycleRule.expiration) {
      if (
        lifecycleRule.expiration.days &&
        lifecycleRule.expiration.days !== 0
      ) {
        setExpiryDays(lifecycleRule.expiration.days.toString());
        setIlmType("expiry");
        transitionMode = false;
      }
      if (
        lifecycleRule.expiration.noncurrent_expiration_days &&
        lifecycleRule.expiration.noncurrent_expiration_days !== 0
      ) {
        setNCExpirationDays(
          lifecycleRule.expiration.noncurrent_expiration_days.toString(),
        );
        setIlmType("expiry");
        transitionMode = false;
      }

      // Fallback to old rules by date
      if (
        lifecycleRule.expiration.date &&
        lifecycleRule.expiration.date !== "0001-01-01T00:00:00Z"
      ) {
        setIlmType("expiry");
        transitionMode = false;
      }
    }

    // Transition fields
    if (transitionMode) {
      setStorageClass(lifecycleRule.transition?.storage_class || "");
      setNCTransitionDays(
        lifecycleRule.transition?.noncurrent_transition_days?.toString() || "0",
      );
      setNCTransitionSC(
        lifecycleRule.transition?.noncurrent_storage_class || "",
      );
    } else {
      // Expiry fields
      setNCExpirationDays(
        lifecycleRule.expiration?.noncurrent_expiration_days?.toString() || "0",
      );
    }

    setExpiredObjectDM(!!lifecycleRule.expiration?.delete_marker);
    setExpiredAllVersionsDM(!!lifecycleRule.expiration?.delete_all);
    setPrefix(lifecycleRule.prefix || "");

    if (lifecycleRule.tags) {
      const tgs = lifecycleRule.tags.reduce(
        (stringLab: string, currItem: any, index: number) => {
          return `${stringLab}${index !== 0 ? "&" : ""}${currItem.key}=${
            currItem.value
          }`;
        },
        "",
      );

      setTags(tgs);
    }
  }, [lifecycleRule]);

  const saveRecord = (event: React.FormEvent) => {
    event.preventDefault();

    if (addLoading) {
      return;
    }
    setAddLoading(true);
    if (selectedBucket !== null && lifecycleRule !== null) {
      let rules = {};

      if (ilmType === "expiry") {
        let expiry: { [key: string]: number } = {};

        if (
          lifecycleRule.expiration?.days &&
          lifecycleRule.expiration?.days > 0
        ) {
          expiry["expiry_days"] = parseInt(expiryDays);
        }
        if (lifecycleRule.expiration?.noncurrent_expiration_days) {
          expiry["noncurrentversion_expiration_days"] =
            parseInt(NCExpirationDays);
        }

        rules = {
          ...expiry,
        };
      } else {
        let transition: { [key: string]: number | string } = {};

        if (
          lifecycleRule.transition?.days &&
          lifecycleRule.transition?.days > 0
        ) {
          transition["transition_days"] = parseInt(transitionDays);
          transition["storage_class"] = storageClass;
        }
        if (lifecycleRule.transition?.noncurrent_transition_days) {
          transition["noncurrentversion_transition_days"] =
            parseInt(NCTransitionDays);
          transition["noncurrentversion_transition_storage_class"] =
            NCTransitionSC;
        }

        rules = {
          ...transition,
        };
      }

      const lifecycleUpdate = {
        type: ilmType,
        disable: !enabled,
        prefix,
        tags,
        expired_object_delete_marker: expiredObjectDM,
        expired_object_delete_all: expiredAllVersionsDM,
        ...rules,
      };

      api.buckets
        .updateBucketLifecycle(
          selectedBucket,
          lifecycleRule.id,
          lifecycleUpdate,
        )
        .then((res) => {
          setAddLoading(false);
          closeModalAndRefresh(true);
        })
        .catch(async (eRes) => {
          setAddLoading(false);
          const err = (await eRes.json()) as ApiError;
          dispatch(setErrorSnackMessage(errorToHandler(err)));
        });
    }
  };

  let objectVersion = "";

  if (lifecycleRule.expiration) {
    if (lifecycleRule.expiration.days > 0) {
      objectVersion = "Current Version";
    } else if (lifecycleRule.expiration.noncurrent_expiration_days) {
      objectVersion = "Non-Current Version";
    }
  }

  if (lifecycleRule.transition) {
    if (lifecycleRule.transition.days > 0) {
      objectVersion = "Current Version";
    } else if (lifecycleRule.transition.noncurrent_transition_days) {
      objectVersion = "Non-Current Version";
    }
  }

  return (
    <ModalWrapper
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      modalOpen={open}
      title={"Edit Lifecycle Configuration"}
      titleIcon={<LifecycleConfigIcon />}
    >
      {!loadingTiers ? (
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            saveRecord(e);
          }}
        >
          <FormLayout containerPadding={false} withBorders={false}>
            <Switch
              label="Status"
              indicatorLabels={["Enabled", "Disabled"]}
              checked={enabled}
              value={"user_enabled"}
              id="rule_status"
              name="rule_status"
              onChange={(e) => {
                setEnabled(e.target.checked);
              }}
            />
            <InputBox
              id="id"
              name="id"
              label="Id"
              value={lifecycleRule.id}
              onChange={() => {}}
              disabled
            />
            {ilmType ? (
              <RadioGroup
                currentValue={ilmType}
                id="rule_type"
                name="rule_type"
                label="Rule Type"
                selectorOptions={ILM_TYPES}
                onChange={() => {}}
                disableOptions
              />
            ) : null}

            <InputBox
              id="object-version"
              name="object-version"
              label="Object Version"
              value={objectVersion}
              onChange={() => {}}
              disabled
            />

            {ilmType === "expiry" && lifecycleRule.expiration?.days && (
              <InputBox
                type="number"
                id="expiry_days"
                name="expiry_days"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setExpiryDays(e.target.value);
                }}
                label="Expiry Days"
                value={expiryDays}
                min="0"
              />
            )}

            {ilmType === "expiry" &&
              lifecycleRule.expiration?.noncurrent_expiration_days && (
                <InputBox
                  type="number"
                  id="noncurrentversion_expiration_days"
                  name="noncurrentversion_expiration_days"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNCExpirationDays(e.target.value);
                  }}
                  label="Non-current Expiration Days"
                  value={NCExpirationDays}
                  min="0"
                />
              )}
            {ilmType === "transition" && lifecycleRule.transition?.days && (
              <Fragment>
                <InputBox
                  type="number"
                  id="transition_days"
                  name="transition_days"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTransitionDays(e.target.value);
                  }}
                  label="Transition Days"
                  value={transitionDays}
                  min="0"
                />
                <Select
                  label="Tier"
                  id="storage_class"
                  name="storage_class"
                  value={storageClass}
                  onChange={(value) => {
                    setStorageClass(value);
                  }}
                  options={tiersList}
                />
              </Fragment>
            )}

            {ilmType === "transition" &&
              lifecycleRule.transition?.noncurrent_transition_days && (
                <Fragment>
                  <InputBox
                    type="number"
                    id="noncurrentversion_transition_days"
                    name="noncurrentversion_transition_days"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setNCTransitionDays(e.target.value);
                    }}
                    label="Non-current Transition Days"
                    value={NCTransitionDays}
                    min="0"
                  />
                  <Select
                    label="Non-current Version Transition Storage Class"
                    id="noncurrentversion_t_SC"
                    name="noncurrentversion_t_SC"
                    value={NCTransitionSC}
                    onChange={(value) => {
                      setNCTransitionSC(value);
                    }}
                    options={tiersList}
                  />
                </Fragment>
              )}
            <Grid item xs={12}>
              <Accordion
                title={"Filters"}
                id={"lifecycle-filters"}
                expanded={expanded}
                onTitleClick={() => setExpanded(!expanded)}
              >
                <InputBox
                  id="prefix"
                  name="prefix"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPrefix(e.target.value);
                  }}
                  label="Prefix"
                  value={prefix}
                />
                <QueryMultiSelector
                  name="tags"
                  label="Tags"
                  elements={tags}
                  onChange={(vl: string) => {
                    setTags(vl);
                  }}
                  keyPlaceholder="Tag Key"
                  valuePlaceholder="Tag Value"
                  withBorder
                />
              </Accordion>
            </Grid>
            {ilmType === "expiry" &&
              lifecycleRule.expiration?.noncurrent_expiration_days && (
                <Grid item xs={12}>
                  <Accordion
                    title={"Advanced"}
                    id={"lifecycle-advanced-filters"}
                    expanded={expandedAdv}
                    onTitleClick={() => setExpandedAdv(!expandedAdv)}
                    sx={{ marginTop: 15 }}
                  >
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
                      label={"Expired Object Delete Marker"}
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
                      label={"Expired All Versions"}
                    />
                  </Accordion>
                </Grid>
              )}
            <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
              <Button
                id={"cancel"}
                type="button"
                variant="regular"
                disabled={addLoading}
                onClick={() => {
                  closeModalAndRefresh(false);
                }}
                label={"Cancel"}
              />
              <Button
                id={"save"}
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
      ) : (
        <Loader style={{ width: 16, height: 16 }} />
      )}
    </ModalWrapper>
  );
};

export default EditLifecycleConfiguration;
