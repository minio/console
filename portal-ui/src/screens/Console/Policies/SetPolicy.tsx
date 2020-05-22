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

import React, { useCallback, useEffect, useState } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  Button,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { modalBasic } from "../Common/FormComponents/common/styleLibrary";
import { User } from "../Users/types";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import { Policy, PolicyList } from "./types";
import api from "../../../common/api";
import { policySort } from "../../../utils/sortFunctions";

interface ISetPolicyProps {
  classes: any;
  closeModalAndRefresh: () => void;
  selectedUser: User | null;
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
  open,
}: ISetPolicyProps) => {
  //Local States
  const [records, setRecords] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchRecords = () => {
    setLoading(true);

    api
      .invoke("GET", `/api/v1/policies?limit=1000`)
      .then((res: PolicyList) => {
        const policies = res.policies === null ? [] : res.policies;
        setLoading(false);
        setRecords(policies.sort(policySort));
        setError("");
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  };

  const setPolicyAction = (policyName: string) => {
    if (selectedUser === null) {
      return;
    }
    setLoading(true);

    api
      .invoke("PUT", `/api/v1/set-policy/${policyName}`, {
        entityName: selectedUser!.accessKey,
        entityType: "user",
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

  useEffect(() => {
    if (open) {
      console.log("im open");
      console.log(selectedUser);
      fetchRecords();
    }
  }, []);

  return (
    <ModalWrapper
      onClose={() => {
        closeModalAndRefresh();
      }}
      modalOpen={open}
      title={
        selectedUser !== null ? "Set Policy to User" : "Set Policy to Group"
      }
    >
      <Grid container className={classes.formScrollable}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Policy</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="primary"
                        size={"small"}
                        onClick={() => {
                          setPolicyAction(row.name);
                        }}
                      >
                        Set
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
      <Grid item xs={12} className={classes.buttonContainer}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            closeModalAndRefresh();
          }}
        >
          Cancel
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
