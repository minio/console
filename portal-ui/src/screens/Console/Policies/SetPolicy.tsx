// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, LinearProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { modalBasic } from "../Common/FormComponents/common/styleLibrary";
import { User } from "../Users/types";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import api from "../../../common/api";
import PolicySelectors from "./PolicySelectors";
import PredefinedList from "../Common/FormComponents/PredefinedList/PredefinedList";
import ErrorBlock from "../../shared/ErrorBlock";

interface ISetPolicyProps {
  classes: any;
  closeModalAndRefresh: () => void;
  selectedUser: User | null;
  selectedGroup: string | null;
  open: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    ...modalBasic,
    buttonContainer: {
      textAlign: "right",
    },
  });

const SetPolicy = ({
  classes,
  closeModalAndRefresh,
  selectedUser,
  selectedGroup,
  open,
}: ISetPolicyProps) => {
  //Local States
  const [loading, setLoading] = useState<boolean>(false);
  const [actualPolicy, setActualPolicy] = useState<string>("");
  const [selectedPolicy, setSelectedPolicy] = useState<string>("");
  const [error, setError] = useState<string>("");

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
      .invoke("PUT", `/api/v1/set-policy/${selectedPolicy}`, {
        entityName: value,
        entityType: entity,
      })
      .then((res: any) => {
        setLoading(false);
        setError("");
        closeModalAndRefresh();
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  };

  const fetchGroupInformation = () => {
    if (selectedGroup) {
      api
        .invoke("GET", `/api/v1/groups/${selectedGroup}`)
        .then((res: any) => {
          const groupPolicy = get(res, "policy", "");
          setActualPolicy(groupPolicy);
          setSelectedPolicy(groupPolicy);
        })
        .catch((err) => {
          setError(err);
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

      const userPolicy = get(selectedUser, "policy", "");
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
      {error !== "" && (
        <Grid item xs={12}>
          <ErrorBlock errorMessage={error} withBreak={false} />
        </Grid>
      )}
      <Grid item xs={12}>
        <PredefinedList
          label={`Selected ${selectedGroup !== null ? "Group" : "User"}`}
          content={selectedGroup !== null ? selectedGroup : userName}
        />
      </Grid>
      <Grid item xs={12}>
        <PredefinedList label={"Current Policy"} content={actualPolicy} />
      </Grid>
      <PolicySelectors
        selectedPolicy={selectedPolicy}
        setSelectedPolicy={setSelectedPolicy}
      />
      <Grid item xs={12}>
        <br />
      </Grid>
      <Grid item xs={12} className={classes.buttonContainer}>
        <button
          type="button"
          color="primary"
          className={classes.clearButton}
          onClick={resetSelection}
        >
          Clear
        </button>
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

export default withStyles(styles)(SetPolicy);
