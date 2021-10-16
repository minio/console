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

import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import Grid from "@mui/material/Grid";
import { Button, LinearProgress } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import api from "../../../../common/api";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import { ArnList } from "../types";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import AutocompleteWrapper from "../../Common/FormComponents/AutocompleteWrapper/AutocompleteWrapper";

const styles = (theme: Theme) =>
  createStyles({
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
  });

interface IAddEventProps {
  classes: any;
  open: boolean;
  selectedBucket: string;
  closeModalAndRefresh: () => void;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const AddEvent = ({
  classes,
  open,
  selectedBucket,
  closeModalAndRefresh,
  setModalErrorSnackMessage,
}: IAddEventProps) => {
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [prefix, setPrefix] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");
  const [arn, setArn] = useState<string>("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [arnList, setArnList] = useState<string[]>([]);

  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api
      .invoke("POST", `/api/v1/buckets/${selectedBucket}/events`, {
        configuration: {
          arn: arn,
          events: selectedEvents,
          prefix: prefix,
          suffix: suffix,
        },
        ignoreExisting: true,
      })
      .then(() => {
        setAddLoading(false);
        closeModalAndRefresh();
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setModalErrorSnackMessage(err);
      });
  };

  const fetchArnList = useCallback(() => {
    setAddLoading(true);
    api
      .invoke("GET", `/api/v1/admin/arns`)
      .then((res: ArnList) => {
        let arns: string[] = [];
        if (res.arns !== null) {
          arns = res.arns;
        }
        setAddLoading(false);
        setArnList(arns);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        setModalErrorSnackMessage(err);
      });
  }, [setModalErrorSnackMessage]);

  useEffect(() => {
    fetchArnList();
  }, [fetchArnList]);

  const events = [
    { label: "PUT - Object Uploaded", value: "put" },
    { label: "GET - Object accessed", value: "get" },
    { label: "DELETE - Object Deleted", value: "delete" },
  ];

  const handleClick = (
    event: React.MouseEvent<unknown> | ChangeEvent<unknown>,
    name: string
  ) => {
    const selectedIndex = selectedEvents.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedEvents, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedEvents.slice(1));
    } else if (selectedIndex === selectedEvents.length - 1) {
      newSelected = newSelected.concat(selectedEvents.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedEvents.slice(0, selectedIndex),
        selectedEvents.slice(selectedIndex + 1)
      );
    }
    setSelectedEvents(newSelected);
  };

  const arnValues = arnList.map((arnConstant) => ({
    label: arnConstant,
    value: arnConstant,
  }));

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
      title="Subscribe To Event"
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          addRecord(e);
        }}
      >
        <Grid container>
          <Grid item xs={12} className={classes.formScrollable}>
            <Grid item xs={12}>
              <AutocompleteWrapper
                onChange={(value: string) => {
                  setArn(value);
                }}
                id="select-access-policy"
                name="select-access-policy"
                label={"ARN"}
                value={arn}
                options={arnValues}
              />
            </Grid>
            <Grid item xs={12}>
              <Table size="medium">
                <TableHead className={classes.minTableHeader}>
                  <TableRow>
                    <TableCell>Select</TableCell>
                    <TableCell>Event</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((row) => (
                    <TableRow
                      key={`group-${row.value}`}
                      onClick={(event) => handleClick(event, row.value)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          value={row.value}
                          color="primary"
                          inputProps={{
                            "aria-label": "secondary checkbox",
                          }}
                          onChange={(event) => handleClick(event, row.value)}
                          checked={selectedEvents.includes(row.value)}
                        />
                      </TableCell>
                      <TableCell className={classes.wrapCell}>
                        {row.label}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
            <Grid item xs={12}>
              <br />
            </Grid>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="prefix-input"
                name="prefix-input"
                label="Prefix"
                value={prefix}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPrefix(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="suffix-input"
                name="suffix-input"
                label="Suffix"
                value={suffix}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSuffix(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <br />
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={addLoading}
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
    </ModalWrapper>
  );
};

const connector = connect(null, {
  setModalErrorSnackMessage,
});

export default withStyles(styles)(connector(AddEvent));
