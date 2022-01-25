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

import { Button, Grid, Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import React from "react";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import { IDirectCSIFormatResItem } from "./types";
import { modalStyleUtils } from "../Common/FormComponents/common/styleLibrary";
import { DriveFormatErrorsIcon } from "../../../icons";

interface IFormatErrorsProps {
  open: boolean;
  onCloseFormatErrorsList: () => void;
  errorsList: IDirectCSIFormatResItem[];
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    errorsList: {
      height: "calc(100vh - 280px)",
    },
    ...modalStyleUtils,
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
      titleIcon={<DriveFormatErrorsIcon />}
    >
      <Grid container>
        <Grid item xs={12} className={classes.modalFormScrollable}>
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
        <Grid item xs={12} className={classes.modalButtonBar}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => {
              download("csiFormatErrors.json", JSON.stringify([...errorsList]));
            }}
          >
            Download
          </Button>
          <Button
            onClick={onCloseFormatErrorsList}
            color="primary"
            variant="contained"
            autoFocus
          >
            Done
          </Button>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default withStyles(styles)(FormatErrorsResult);
