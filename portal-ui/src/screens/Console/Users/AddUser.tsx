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

import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import Grid from "@mui/material/Grid";
import { Button, LinearProgress, Tab, Tabs } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { modalBasic } from "../Common/FormComponents/common/styleLibrary";
import { User } from "./types";
import { setModalErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import GroupsSelectors from "./GroupsSelectors";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import PredefinedList from "../Common/FormComponents/PredefinedList/PredefinedList";
import PolicySelectors from "../Policies/PolicySelectors";

const styles = (theme: Theme) =>
  createStyles({
    strongText: {
      fontWeight: 700,
    },
    keyName: {
      marginLeft: 5,
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
  });

interface IAddUserContentProps {
  classes: any;
  closeModalAndRefresh: () => void;
  selectedUser: User | null;
  open: boolean;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const AddUser = ({
  classes,
  closeModalAndRefresh,
  selectedUser,
  open,
  setModalErrorSnackMessage,
}: IAddUserContentProps) => {
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const [currentGroups, setCurrentGroups] = useState<string[]>([]);
  const [currenTab, setCurrenTab] = useState<number>(0);

  const getUserInformation = useCallback(() => {
    if (!selectedUser) {
      return null;
    }

    api
      .invoke("GET", `/api/v1/user?name=${encodeURI(selectedUser.accessKey)}`)
      .then((res) => {
        setAddLoading(false);
        setAccessKey(res.accessKey);
        setSelectedGroups(res.memberOf || []);
        setCurrentGroups(res.memberOf || []);
        setEnabled(res.status === "enabled");
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setModalErrorSnackMessage(err);
      });
  }, [selectedUser, setModalErrorSnackMessage]);

  useEffect(() => {
    if (selectedUser === null) {
      setAccessKey("");
      setSecretKey("");
      setSelectedGroups([]);
    } else {
      getUserInformation();
    }
  }, [selectedUser, getUserInformation]);

  const saveRecord = (event: React.FormEvent) => {
    event.preventDefault();

    if (secretKey.length < 8) {
      setModalErrorSnackMessage({
        errorMessage: "Passwords must be at least 8 characters long",
        detailedError: "",
      });
      setAddLoading(false);
      return;
    }

    if (addLoading) {
      return;
    }
    setAddLoading(true);
    if (selectedUser !== null) {
      api
        .invoke(
          "PUT",
          `/api/v1/user?name=${encodeURI(selectedUser.accessKey)}`,
          {
            status: enabled ? "enabled" : "disabled",
            groups: selectedGroups,
            policies: selectedPolicies,
          }
        )
        .then((res) => {
          setAddLoading(false);
          closeModalAndRefresh();
        })
        .catch((err: ErrorResponseHandler) => {
          setAddLoading(false);
          setModalErrorSnackMessage(err);
        });
    } else {
      api
        .invoke("POST", "/api/v1/users", {
          accessKey,
          secretKey,
          groups: selectedGroups,
          policies: selectedPolicies,
        })
        .then((res) => {
          setAddLoading(false);
          closeModalAndRefresh();
        })
        .catch((err: ErrorResponseHandler) => {
          setAddLoading(false);
          setModalErrorSnackMessage(err);
        });
    }
  };

  const resetForm = () => {
    if (selectedUser !== null) {
      setSelectedGroups([]);
      return;
    }
    setAccessKey("");
    setSecretKey("");
    setSelectedGroups([]);
  };

  const sendEnabled =
    accessKey.trim() !== "" &&
    ((secretKey.trim() !== "" && selectedUser === null) ||
      selectedUser !== null);
  return (
    <ModalWrapper
      onClose={() => {
        closeModalAndRefresh();
      }}
      modalOpen={open}
      title={selectedUser !== null ? "Edit User" : "Create User"}
    >
      {selectedUser !== null && (
        <div className={classes.floatingEnabled}>
          <FormSwitchWrapper
            indicatorLabels={["Enabled", "Disabled"]}
            checked={enabled}
            value={"user_enabled"}
            id="user-status"
            name="user-status"
            onChange={(e) => {
              setEnabled(e.target.checked);
            }}
            switchOnly
          />
        </div>
      )}

      <React.Fragment>
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            saveRecord(e);
          }}
        >
          <Grid container>
            <Grid item xs={12} className={classes.formScrollable}>
              <InputBoxWrapper
                id="accesskey-input"
                name="accesskey-input"
                label="Access Key"
                value={accessKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAccessKey(e.target.value);
                }}
                disabled={selectedUser !== null}
              />

              {selectedUser !== null ? (
                <PredefinedList
                  label={"Current Groups"}
                  content={currentGroups.join(", ")}
                />
              ) : (
                <InputBoxWrapper
                  id="standard-multiline-static"
                  name="standard-multiline-static"
                  label="Secret Key"
                  type="password"
                  value={secretKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSecretKey(e.target.value);
                  }}
                  autoComplete="current-password"
                />
              )}
              <Grid item xs={12}>
                <Tabs
                  onChange={(e, nv) => {
                    setCurrenTab(nv);
                  }}
                >
                  <Tab label="Policies" />
                  <Tab label="Groups" />
                </Tabs>
              </Grid>
              {currenTab === 0 && (
                <Grid item xs={12}>
                  <PolicySelectors
                    selectedPolicy={selectedPolicies}
                    setSelectedPolicy={setSelectedPolicies}
                  />
                </Grid>
              )}
              {currenTab === 1 && (
                <Grid item xs={12}>
                  <GroupsSelectors
                    selectedGroups={selectedGroups}
                    setSelectedGroups={(elements: string[]) => {
                      setSelectedGroups(elements);
                    }}
                  />
                </Grid>
              )}
            </Grid>
            <Grid item xs={12} className={classes.buttonContainer}>
              <button
                type="button"
                color="primary"
                className={classes.clearButton}
                onClick={() => {
                  resetForm();
                }}
              >
                Clear
              </button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={addLoading || !sendEnabled}
              >
                Save
              </Button>
            </Grid>
            {addLoading && (
              <Grid item xs={12}>
                <LinearProgress />
              </Grid>
            )}
          </Grid>
        </form>
      </React.Fragment>
    </ModalWrapper>
  );
};

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(AddUser));
