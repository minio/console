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
import { useSelector } from "react-redux";
import { Theme } from "@mui/material/styles";
import {
  Button,
  CopyIcon,
  FormLayout,
  Grid,
  InputBox,
  RadioGroup,
  ReadBox,
  Select,
  ShareIcon,
} from "mds";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import CopyToClipboard from "react-copy-to-clipboard";
import LinearProgress from "@mui/material/LinearProgress";
import {
  formFieldStyles,
  modalStyleUtils,
} from "../../../../Common/FormComponents/common/styleLibrary";

import { IFileInfo } from "./types";
import { ErrorResponseHandler } from "../../../../../../common/types";
import api from "../../../../../../common/api";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import DaysSelector from "../../../../Common/FormComponents/DaysSelector/DaysSelector";
import { encodeURLString } from "../../../../../../common/utils";
import {
  selDistSet,
  setErrorSnackMessage,
  setModalErrorSnackMessage,
  setModalSnackMessage,
} from "../../../../../../systemSlice";
import { useAppDispatch } from "../../../../../../store";
import { DateTime } from "luxon";
import { stringSort } from "../../../../../../utils/sortFunctions";

const styles = (theme: Theme) =>
  createStyles({
    shareLinkInfo: {
      fontSize: 14,
      fontWeight: 400,
    },
    copyShareLink: {
      display: "flex",
      "@media (max-width: 900px)": {
        flexFlow: "column",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    copyShareLinkInput: {
      "& div:first-child": {
        marginTop: 0,
      },
      "@media (max-width: 900px)": {
        minWidth: 250,
      },
    },
    ...modalStyleUtils,
    ...formFieldStyles,
  });

interface IShareFileProps {
  classes: any;
  open: boolean;
  bucketName: string;
  dataObject: IFileInfo;
  closeModalAndRefresh: () => void;
}

const ShareFile = ({
  classes,
  open,
  closeModalAndRefresh,
  bucketName,
  dataObject,
}: IShareFileProps) => {
  const dispatch = useAppDispatch();
  const distributedSetup = useSelector(selDistSet);
  const [shareURL, setShareURL] = useState<string>("");
  const [isLoadingURL, setIsLoadingURL] = useState<boolean>(false);
  const [isLoadingAccessKeys, setLoadingAccessKeys] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateValid, setDateValid] = useState<boolean>(true);
  const [versionID, setVersionID] = useState<string>("null");
  const [displayURL, setDisplayURL] = useState<boolean>(false);
  const [accessKeys, setAccessKeys] = useState<any[]>([]);
  const [selectedAccessKey, setSelectedAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [authType, setAuthType] = useState<string>("acc-list");
  const [otherAK, setOtherAK] = useState<string>("");

  const initialDate = new Date();

  const dateChanged = (newDate: string, isValid: boolean) => {
    setDateValid(isValid);
    if (isValid) {
      setSelectedDate(newDate);
      return;
    }
    setSelectedDate("");
    setShareURL("");
  };

  useEffect(() => {
    // In case version is undefined, we get the latest version of the object
    if (dataObject.version_id === undefined) {
      // In case it is not distributed setup, then we default to "null";
      if (distributedSetup) {
        api
          .invoke(
            "GET",
            `/api/v1/buckets/${bucketName}/objects?prefix=${encodeURLString(
              dataObject.name
            )}${distributedSetup ? "&with_versions=true" : ""}`
          )
          .then((res: { objects: IFileInfo[] }) => {
            const result: IFileInfo[] = res.objects || [];

            const latestVersion: IFileInfo | undefined = result.find(
              (elem: IFileInfo) => elem.is_latest
            );

            if (latestVersion) {
              setVersionID(`${latestVersion.version_id}`);
              return;
            }

            // Version couldn't be retrieved, we default
            setVersionID("null");
          })
          .catch((error: ErrorResponseHandler) => {
            dispatch(setModalErrorSnackMessage(error));
          });

        setIsLoadingURL(false);
        return;
      }
      setVersionID("null");
      setIsLoadingURL(false);
      return;
    }
    setVersionID(dataObject.version_id || "null");
    setIsLoadingURL(false);
  }, [bucketName, dataObject, distributedSetup, dispatch]);

  useEffect(() => {
    if (dateValid && isLoadingURL) {
      setShareURL("");

      const slDate = new Date(`${selectedDate}`);
      const currDate = new Date();

      const diffDate = Math.ceil(
        (slDate.getTime() - currDate.getTime()) / 1000
      );

      const accKey = authType === "acc-list" ? selectedAccessKey : otherAK;

      if (diffDate > 0) {
        api
          .invoke("POST", `/api/v1/buckets/${bucketName}/objects/share`, {
            prefix: encodeURLString(dataObject.name),
            version_id: versionID,
            expires: selectedDate !== "" ? `${diffDate}s` : "",
            access_key: accKey,
            secret_key: secretKey,
          })
          .then((res: string) => {
            setShareURL(res);
            setIsLoadingURL(false);
            setDisplayURL(true);
          })
          .catch((error: ErrorResponseHandler) => {
            dispatch(setModalErrorSnackMessage(error));
            setShareURL("");
            setIsLoadingURL(false);
            setDisplayURL(false);
          });
      }
    }
  }, [
    secretKey,
    selectedAccessKey,
    dataObject,
    selectedDate,
    bucketName,
    dateValid,
    setShareURL,
    dispatch,
    distributedSetup,
    versionID,
    isLoadingURL,
    authType,
    otherAK,
  ]);

  useEffect(() => {
    if (isLoadingAccessKeys) {
      const userLoggedIn = localStorage.getItem("userLoggedIn");

      api
        .invoke(
          "GET",
          `/api/v1/user/${encodeURLString(userLoggedIn)}/service-accounts`
        )
        .then((res: string[]) => {
          if (res.length === 0) {
            setAuthType("acc-other");
          }

          const serviceAccounts = res
            .sort(stringSort)
            .map((element) => ({ value: element, label: element }));

          setLoadingAccessKeys(false);
          setAccessKeys(serviceAccounts);
          setSelectedAccessKey(serviceAccounts[0].value);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
          setLoadingAccessKeys(false);
        });
    }
  }, [isLoadingAccessKeys, dispatch]);

  const generateLink = () => {
    setIsLoadingURL(true);
  };

  const generateAnotherLink = () => {
    setIsLoadingURL(false);
    setDisplayURL(false);
    setSelectedDate("");
    setShareURL("");
  };

  return (
    <ModalWrapper
      title="Share File"
      titleIcon={<ShareIcon style={{ fill: "#4CCB92" }} />}
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
    >
      {displayURL ? (
        <Fragment>
          <Grid item xs={12} className={classes.shareLinkInfo}>
            This is a temporary URL with integrated access credentials for
            sharing <strong>{dataObject.name}</strong> until{" "}
            <strong>
              {DateTime.fromISO(selectedDate).toFormat(
                "ccc, LLL dd yyyy HH:mm (ZZZZ)"
              )}
            </strong>
            <br />
            <br />
            This temporary URL will expiry after this time.
          </Grid>
          <Grid
            item
            xs={12}
            className={`${classes.copyShareLink} ${classes.formFieldRow} `}
            sx={{ marginTop: 12 }}
          >
            <ReadBox
              actionButton={
                <CopyToClipboard text={shareURL}>
                  <Button
                    id={"copy-path"}
                    variant="regular"
                    onClick={() => {
                      dispatch(
                        setModalSnackMessage("Share URL Copied to clipboard")
                      );
                    }}
                    disabled={shareURL === "" || isLoadingURL}
                    style={{
                      marginRight: "5px",
                      width: "28px",
                      height: "28px",
                      padding: "0px",
                    }}
                    icon={<CopyIcon />}
                  />
                </CopyToClipboard>
              }
            >
              {shareURL}
            </ReadBox>
          </Grid>
          <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              id={"generate-link"}
              variant={"callAction"}
              type={"button"}
              onClick={generateAnotherLink}
            >
              Generate Another Link
            </Button>
          </Grid>
        </Fragment>
      ) : (
        <Fragment>
          <Grid item xs={12} className={classes.shareLinkInfo}>
            To generate a temporary URL, please provide a set of credentials,
            this link can be valid up to 7 days.
            <br />
            <br />
          </Grid>
          <FormLayout sx={{ border: 0, padding: 0 }}>
            {accessKeys.length > 0 && (
              <RadioGroup
                id={"sign-selector-kind"}
                selectorOptions={[
                  { label: "Account's Access Key", value: "acc-list" },
                  {
                    label: "Custom Access Key",
                    value: "acc-other",
                  },
                ]}
                label={""}
                name={"sign-selector-kind"}
                onChange={(e) => {
                  setAuthType(e.target.value);
                }}
                currentValue={authType}
              />
            )}
            {authType === "acc-other" ? (
              <InputBox
                id={"other-ak"}
                value={otherAK}
                onChange={(e) => {
                  setOtherAK(e.target.value);
                }}
                label={"Access Key"}
              />
            ) : (
              <Select
                options={accessKeys}
                value={selectedAccessKey}
                id={"select-ak"}
                onChange={(item) => {
                  setSelectedAccessKey(item);
                }}
                label={"Access Key"}
              />
            )}
            <InputBox
              id={"secret-key"}
              type={"password"}
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
              }}
              label={"Secret Key"}
            />
          </FormLayout>

          <Grid item xs={12} className={classes.dateContainer}>
            <DaysSelector
              initialDate={initialDate}
              id="date"
              label="Link Duration"
              maxDays={7}
              onChange={dateChanged}
              entity="Link"
            />
          </Grid>
          {isLoadingURL && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
          <Grid sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              id={"generate-link"}
              variant={"callAction"}
              type={"button"}
              onClick={generateLink}
              disabled={secretKey === "" || !dateValid}
            >
              Generate Link
            </Button>
          </Grid>
        </Fragment>
      )}
    </ModalWrapper>
  );
};

export default withStyles(styles)(ShareFile);
