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
  AddIcon,
  Box,
  BucketEncryptionIcon,
  Button,
  FormLayout,
  Grid,
  ProgressBar,
  Select,
} from "mds";
import {
  ApiError,
  BucketEncryptionInfo,
  BucketEncryptionType,
  KmsKeyInfo,
} from "api/consoleApi";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { modalStyleUtils } from "../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import {
  CONSOLE_UI_RESOURCE,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import { SecureComponent } from "../../../../common/SecureComponent";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import AddKeyModal from "./AddKeyModal";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";

interface IEnableBucketEncryptionProps {
  open: boolean;
  encryptionEnabled: boolean;
  encryptionCfg: BucketEncryptionInfo | null;
  selectedBucket: string;
  closeModalAndRefresh: () => void;
}

const EnableBucketEncryption = ({
  open,
  encryptionCfg,
  selectedBucket,
  closeModalAndRefresh,
}: IEnableBucketEncryptionProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [kmsKeyID, setKmsKeyID] = useState<string>("");
  const [encryptionType, setEncryptionType] = useState<
    BucketEncryptionType | "disabled"
  >("disabled");
  const [keys, setKeys] = useState<KmsKeyInfo[] | undefined>([]);
  const [loadingKeys, setLoadingKeys] = useState<boolean>(false);
  const [addOpen, setAddOpen] = useState<boolean>(false);

  useEffect(() => {
    if (encryptionCfg) {
      if (encryptionCfg.algorithm === "AES256") {
        setEncryptionType(BucketEncryptionType.SseS3);
      } else {
        setEncryptionType(BucketEncryptionType.SseKms);
        setKmsKeyID(encryptionCfg.kmsMasterKeyID || "");
      }
    }
  }, [encryptionCfg]);

  useEffect(() => {
    if (encryptionType === "sse-kms") {
      api.kms
        .kmsListKeys()
        .then((res) => {
          setKeys(res.data.results);
          setLoadingKeys(false);
        })
        .catch((err) => {
          setLoadingKeys(false);
          dispatch(setModalErrorSnackMessage(errorToHandler(err.error)));
        });
    }
  }, [encryptionType, loadingKeys, dispatch]);

  const enableBucketEncryption = (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) {
      return;
    }
    if (encryptionType === "disabled") {
      api.buckets
        .disableBucketEncryption(selectedBucket)
        .then(() => {
          setLoading(false);
          closeModalAndRefresh();
        })
        .catch(async (res) => {
          const err = (await res.json()) as ApiError;
          setLoading(false);
          dispatch(setModalErrorSnackMessage(errorToHandler(err)));
        });
    } else {
      api.buckets
        .enableBucketEncryption(selectedBucket, {
          encType: encryptionType,
          kmsKeyID: kmsKeyID,
        })
        .then(() => {
          setLoading(false);
          closeModalAndRefresh();
        })

        .catch(async (res) => {
          const err = (await res.json()) as ApiError;
          setLoading(false);
          dispatch(setModalErrorSnackMessage(errorToHandler(err)));
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
          <FormLayout withBorders={false} containerPadding={false}>
            <Select
              onChange={(value) => {
                setEncryptionType(value as BucketEncryptionType | "disabled");
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
                  value: BucketEncryptionType.SseS3,
                },
                {
                  label: "SSE-KMS",
                  value: BucketEncryptionType.SseKms,
                },
              ]}
            />
            {encryptionType === "sse-kms" && (
              <Box sx={{ display: "flex", gap: 10 }} className={"inputItem"}>
                {keys && (
                  <Select
                    onChange={(value) => {
                      setKmsKeyID(value);
                    }}
                    id="select-kms-key-id"
                    name="select-kms-key-id"
                    label={"KMS Key ID"}
                    value={kmsKeyID}
                    options={keys.map((key: KmsKeyInfo) => {
                      return {
                        label: key.name || "",
                        value: key.name || "",
                      };
                    })}
                  />
                )}
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
              </Box>
            )}
            <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
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
                <ProgressBar />
              </Grid>
            )}
          </FormLayout>
        </form>
      </ModalWrapper>
    </Fragment>
  );
};

export default EnableBucketEncryption;
