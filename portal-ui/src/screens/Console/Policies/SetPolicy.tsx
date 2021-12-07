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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import get from "lodash/get";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button, LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  modalBasic,
  spacingUtils,
  tableStyles,
} from "../Common/FormComponents/common/styleLibrary";
import { User } from "../Users/types";
import { setModalErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import api from "../../../common/api";
import PolicySelectors from "./PolicySelectors";
import PredefinedList from "../Common/FormComponents/PredefinedList/PredefinedList";

interface ISetPolicyProps {
  classes: any;
  closeModalAndRefresh: () => void;
  selectedUser: User | null;
  selectedGroup: string | null;
  open: boolean;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
    ...spacingUtils,
    tableBlock: {
      ...tableStyles.tableBlock,
      marginTop: 15,
    },
    buttonContainer: {
      textAlign: "right",
      marginTop: ".9rem",
    },
  });

const SetPolicy = ({
  classes,
  closeModalAndRefresh,
  selectedUser,
  selectedGroup,
  setModalErrorSnackMessage,
  open,
}: ISetPolicyProps) => {
  //Local States
  const [loading, setLoading] = useState<boolean>(false);
  const [actualPolicy, setActualPolicy] = useState<string[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<string[]>([]);

  const setPolicyAction = () => {
    let entity = "user";
    let value = null;
    if (selectedGroup !== null) {
      entity = "group";
      value = selectedGroup;
    } else {
      if (selectedUser !== null) {
        value = selectedUser.accessKey;
      }
    }

    setLoading(true);

    api
      .invoke("PUT", `/api/v1/set-policy`, {
        name: selectedPolicy,
        entityName: value,
        entityType: entity,
      })
      .then(() => {
        setLoading(false);
        closeModalAndRefresh();
      })
      .catch((err: ErrorResponseHandler) => {
        setLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  const fetchGroupInformation = () => {
    if (selectedGroup) {
      api
        .invoke("GET", `/api/v1/group?name=${encodeURI(selectedGroup)}`)
        .then((res: any) => {
          const groupPolicy: String = get(res, "policy", "");
          setActualPolicy(groupPolicy.split(","));
          setSelectedPolicy(groupPolicy.split(","));
        })
        .catch((err: ErrorResponseHandler) => {
          setModalErrorSnackMessage(err);
          setLoading(false);
        });
    }
  };

  const resetSelection = () => {
    setSelectedPolicy(actualPolicy);
  };

  useEffect(() => {
    if (open) {
      if (selectedGroup !== null) {
        fetchGroupInformation();
        return;
      }

      const userPolicy: string[] = get(selectedUser, "policy", []);
      setActualPolicy(userPolicy);
      setSelectedPolicy(userPolicy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedGroup, selectedUser]);

  const userName = get(selectedUser, "accessKey", "");

  return (
    <ModalWrapper
      onClose={() => {
        closeModalAndRefresh();
      }}
      modalOpen={open}
      title="Set Policies"
    >
      <Grid item xs={12}>
        <PredefinedList
          label={`Selected ${selectedGroup !== null ? "Group" : "User"}`}
          content={selectedGroup !== null ? selectedGroup : userName}
        />
      </Grid>
      <Grid item xs={12}>
        <PredefinedList
          label={"Current Policy"}
          content={actualPolicy.join(", ")}
        />
      </Grid>
      <div className={classes.tableBlock}>
        <PolicySelectors
          selectedPolicy={selectedPolicy}
          setSelectedPolicy={setSelectedPolicy}
        />
      </div>
      <Grid item xs={12} className={classes.buttonContainer}>
        <Button
          type="button"
          variant="outlined"
          color="primary"
          className={classes.spacerRight}
          onClick={resetSelection}
        >
          Reset
        </Button>
        <Button
          type="button"
          variant="contained"
          color="primary"
          disabled={loading}
          onClick={setPolicyAction}
        >
          Save
        </Button>
      </Grid>
      {loading && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}
    </ModalWrapper>
  );
};

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(SetPolicy));
