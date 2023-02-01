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
import { LinearProgress, SelectChangeEvent } from "@mui/material";
import { AddIcon, BucketEncryptionIcon, Button } from "mds";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../../Common/FormComponents/common/styleLibrary";
import { BucketEncryptionInfo } from "../types";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";

import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import { SecureComponent } from "../../../../common/SecureComponent";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import AddKeyModal from "./AddKeyModal";

const styles = (theme: Theme) =>
  createStyles({
    ...modalStyleUtils,
    ...formFieldStyles,
  });

interface IEnableBucketEncryptionProps {
  classes: any;
  open: boolean;
  encryptionEnabled: boolean;
  encryptionCfg: BucketEncryptionInfo | null;
  selectedBucket: string;
  closeModalAndRefresh: () => void;
}

const EnableBucketEncryption = ({
  classes,
  open,
  encryptionCfg,
  selectedBucket,
  closeModalAndRefresh,
}: IEnableBucketEncryptionProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [kmsKeyID, setKmsKeyID] = useState<string>("");
  const [encryptionType, setEncryptionType] = useState<string>("disabled");
  const [keys, setKeys] = useState<[]>([]);
  const [loadingKeys, setLoadingKeys] = useState<boolean>(false);
  const [addOpen, setAddOpen] = useState<boolean>(false);

  useEffect(() => {
    if (encryptionCfg) {
      if (encryptionCfg.algorithm === "AES256") {
        setEncryptionType("sse-s3");
      } else {
        setEncryptionType("sse-kms");
        setKmsKeyID(encryptionCfg.kmsMasterKeyID);
      }
    }
  }, [encryptionCfg]);

  useEffect(() => {
    if (encryptionType === "sse-kms") {
      api
        .invoke("GET", `/api/v1/kms/keys`)
        .then((res: any) => {
          setKeys(res.results);
          setLoadingKeys(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoadingKeys(false);
          dispatch(setModalErrorSnackMessage(err));
        });
    }
  }, [encryptionType, loadingKeys, dispatch]);

  const enableBucketEncryption = (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) {
      return;
    }
    if (encryptionType === "disabled") {
      api
        .invoke("POST", `/api/v1/buckets/${selectedBucket}/encryption/disable`)
        .then(() => {
          setLoading(false);
          closeModalAndRefresh();
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          dispatch(setModalErrorSnackMessage(err));
        });
    } else {
      api
        .invoke("POST", `/api/v1/buckets/${selectedBucket}/encryption/enable`, {
          encType: encryptionType,
          kmsKeyID: kmsKeyID,
        })
        .then(() => {
          setLoading(false);
          closeModalAndRefresh();
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          dispatch(setModalErrorSnackMessage(err));
        });
    }
  };

  return (
    <Fragment>
      {addOpen && (
        <AddKeyModal
          addOpen={addOpen}
          closeAddModalAndRefresh={(refresh: boolean) => {
            setAddOpen(false);
            setLoadingKeys(true);
          }}
        />
      )}

      <ModalWrapper
        modalOpen={open}
        onClose={() => {
          closeModalAndRefresh();
        }}
        title="Enable Bucket Encryption"
        titleIcon={<BucketEncryptionIcon />}
      >
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            enableBucketEncryption(e);
          }}
        >
          <Grid container>
            <Grid item xs={12} className={classes.modalFormScrollable}>
              <Grid item xs={12} className={classes.formFieldRow}>
                <SelectWrapper
                  onChange={(e: SelectChangeEvent<string>) => {
                    setEncryptionType(e.target.value as string);
                  }}
                  id="select-encryption-type"
                  name="select-encryption-type"
                  label={"Encryption Type"}
                  value={encryptionType}
                  options={[
                    {
                      label: "Disabled",
                      value: "disabled",
                    },
                    {
                      label: "SSE-S3",
                      value: "sse-s3",
                    },
                    {
                      label: "SSE-KMS",
                      value: "sse-kms",
                    },
                  ]}
                />
              </Grid>

              {encryptionType === "sse-kms" && (
                <Grid
                  item
                  xs={12}
                  className={classes.formFieldRow}
                  display={"flex"}
                >
                  <SelectWrapper
                    onChange={(e: SelectChangeEvent<string>) => {
                      setKmsKeyID(e.target.value);
                    }}
                    id="select-kms-key-id"
                    name="select-kms-key-id"
                    label={"KMS Key ID"}
                    value={kmsKeyID}
                    options={keys.map((key: any) => {
                      return {
                        label: key.name,
                        value: key.name,
                      };
                    })}
                  />
                  <Grid marginLeft={1}>
                    <SecureComponent
                      scopes={[IAM_SCOPES.KMS_IMPORT_KEY]}
                      resource={CONSOLE_UI_RESOURCE}
                      errorProps={{ disabled: true }}
                    >
                      <TooltipWrapper tooltip={"Add key"}>
                        <Button
                          id={"import-key"}
                          variant={"regular"}
                          icon={<AddIcon />}
                          onClick={(e) => {
                            setAddOpen(true);
                            e.preventDefault();
                          }}
                        />
                      </TooltipWrapper>
                    </SecureComponent>
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid item xs={12} className={classes.modalButtonBar}>
              <Button
                id={"cancel"}
                type="submit"
                variant="regular"
                onClick={() => {
                  closeModalAndRefresh();
                }}
                disabled={loading}
                label={"Cancel"}
              />
              <Button
                id={"save"}
                type="submit"
                variant="callAction"
                disabled={loading}
                label={"Save"}
              />
            </Grid>
            {loading && (
              <Grid item xs={12}>
                <LinearProgress />
              </Grid>
            )}
          </Grid>
        </form>
      </ModalWrapper>
    </Fragment>
  );
};

export default withStyles(styles)(EnableBucketEncryption);
