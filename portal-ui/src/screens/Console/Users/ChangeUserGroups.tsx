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
import { Button, LinearProgress } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import {
  modalBasic,
  spacingUtils,
} from "../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import GroupsSelectors from "./GroupsSelectors";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import AddMembersToGroup from "../../../icons/AddMembersToGroupIcon";
import { encodeURLString } from "../../../common/utils";

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    ...spacingUtils,
    ...modalBasic,
  });

interface IChangeUserGroupsContentProps {
  classes: any;
  closeModalAndRefresh: () => void;
  selectedUser: string;
  open: boolean;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const ChangeUserGroups = ({
  classes,
  closeModalAndRefresh,
  selectedUser,
  open,
  setModalErrorSnackMessage,
}: IChangeUserGroupsContentProps) => {
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const getUserInformation = useCallback(() => {
    if (!selectedUser) {
      return null;
    }

    api
      .invoke("GET", `/api/v1/user/${encodeURLString(selectedUser)}`)
      .then((res) => {
        setAddLoading(false);
        setAccessKey(res.accessKey);
        setSelectedGroups(res.memberOf || []);
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

    if (addLoading) {
      return;
    }
    setAddLoading(true);
    if (selectedUser !== null) {
      api
        .invoke("PUT", `/api/v1/user/${encodeURLString(selectedUser)}`, {
          status: enabled ? "enabled" : "disabled",
          groups: selectedGroups,
        })
        .then((_) => {
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
        })
        .then((_) => {
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
      title={"Set Groups"}
      titleIcon={<AddMembersToGroup />}
    >
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
              <GroupsSelectors
                selectedGroups={selectedGroups}
                setSelectedGroups={(elements: string[]) => {
                  setSelectedGroups(elements);
                }}
              />
            </Grid>
            <Grid item xs={12} className={classes.buttonContainer}>
              <Button
                type="button"
                variant="outlined"
                color="primary"
                className={classes.spacerRight}
                onClick={resetForm}
              >
                Clear
              </Button>

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

export default withStyles(styles)(connector(ChangeUserGroups));
