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
import { Button, Grid } from "mds";
import get from "lodash/get";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { IReqInfoSearchResults } from "./types";
import { LogSearchColumnLabels } from "./utils";

interface ILogSearchFullModal {
  modalOpen: boolean;
  logSearchElement: IReqInfoSearchResults;
  onClose: () => void;
}

const LogSearchFullModal = ({
  modalOpen,
  logSearchElement,
  onClose,
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
                    <th
                      style={{
                        fontWeight: 700,
                        paddingRight: "10px",
                        textAlign: "left",
                      }}
                    >
                      {get(LogSearchColumnLabels, objectKey, `${objectKey}`)}
                    </th>
                    <td>{get(logSearchElement, objectKey, "")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              id={"close-log-search"}
              variant="callAction"
              color="primary"
              onClick={onClose}
              label={"Close"}
            />
          </Grid>
        </Grid>
      </ModalWrapper>
    </Fragment>
  );
};

export default LogSearchFullModal;
