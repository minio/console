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

import React, { Fragment } from "react";
import get from "lodash/get";
import { Button, Grid } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import { IReqInfoSearchResults } from "./types";
import { LogSearchColumnLabels } from "./utils";

interface ILogSearchFullModal {
  modalOpen: boolean;
  logSearchElement: IReqInfoSearchResults;
  onClose: () => void;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    pathLabel: {
      marginTop: 0,
      marginBottom: 32,
    },
    objectKeyCol: {
      fontWeight: 700,
      paddingRight: "10px",
      textAlign: "left",
    },
    ...modalBasic,
  });

const LogSearchFullModal = ({
  modalOpen,
  logSearchElement,
  onClose,
  classes,
}: ILogSearchFullModal) => {
  const jsonItems = Object.keys(logSearchElement);

  return (
    <Fragment>
      <ModalWrapper
        modalOpen={modalOpen}
        title="Full Log Information"
        onClose={() => {
          onClose();
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <table>
              <tbody>
                {jsonItems.map((objectKey: string, index: number) => (
                  <tr key={`logSearch-${index.toString()}`}>
                    <th className={classes.objectKeyCol}>
                      {get(LogSearchColumnLabels, objectKey, `${objectKey}`)}
                    </th>
                    <td>{get(logSearchElement, objectKey, "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
          <Grid item xs={12} className={classes.buttonContainer}>
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={onClose}
            >
              Close
            </Button>
          </Grid>
        </Grid>
      </ModalWrapper>
    </Fragment>
  );
};

export default withStyles(styles)(LogSearchFullModal);
