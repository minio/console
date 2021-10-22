// This file is part of MinIO Kubernetes Cloud
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

import { Button, Grid, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import React from "react";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import { IDirectCSIFormatResItem } from "./types";

interface IFormatErrorsProps {
  open: boolean;
  onCloseFormatErrorsList: () => void;
  errorsList: IDirectCSIFormatResItem[];
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    warningBlock: {
      color: "red",
    },
    buttonContainer: {
      textAlign: "right",
    },
    errorsList: {
      height: "calc(100vh - 280px)",
    },
  });

const download = (filename: string, text: string) => {
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const FormatErrorsResult = ({
  open,
  onCloseFormatErrorsList,
  errorsList,
  classes,
}: IFormatErrorsProps) => {
  return (
    <ModalWrapper
      modalOpen={open}
      title={"Format Errors"}
      onClose={onCloseFormatErrorsList}
    >
      <Grid container>
        <Grid item xs={12} className={classes.formScrollable}>
          There were some issues trying to format the selected CSI Drives,
          please fix the issues and try again.
          <br />
          <TableWrapper
            columns={[
              {
                label: "Node",
                elementKey: "node",
              },
              { label: "Drive", elementKey: "drive" },
              { label: "Message", elementKey: "error" },
            ]}
            entityName="Format Errors"
            idField="drive"
            records={errorsList}
            isLoading={false}
            customPaperHeight={classes.errorsList}
            textSelectable
            noBackground
          />
        </Grid>
        <Grid item xs={12} className={classes.buttonContainer}>
          <Button
            onClick={() => {
              download("csiFormatErrors.json", JSON.stringify([...errorsList]));
            }}
            color="primary"
          >
            Download
          </Button>
          <Button onClick={onCloseFormatErrorsList} color="secondary" autoFocus>
            Done
          </Button>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default withStyles(styles)(FormatErrorsResult);
