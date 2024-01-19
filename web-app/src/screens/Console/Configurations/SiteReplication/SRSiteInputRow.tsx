// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import { AddIcon, Box, Button, Grid, InputBox, RemoveIcon } from "mds";
import { SiteInputRow } from "./Types";

interface ISRSiteInputRowProps {
  rowData: SiteInputRow;
  rowId: number;
  onFieldChange: (e: any, fieldName: string, index: number) => void;
  onAddClick?: (index: number) => void;
  onRemoveClick?: (index: number) => void;
  canAdd?: boolean;
  canRemove?: boolean;
  showRowActions?: boolean;
  disabledFields?: string[];
  fieldErrors?: Record<string, string>;
}

const SRSiteInputRow = ({
  rowData,
  rowId: index,
  onFieldChange,
  onAddClick,
  onRemoveClick,
  canAdd = true,
  canRemove = true,
  showRowActions = true,
  disabledFields = [],
  fieldErrors = {},
}: ISRSiteInputRowProps) => {
  const { endpoint = "", accessKey = "", secretKey = "", name = "" } = rowData;
  return (
    <Fragment key={`${index}`}>
      <Box>
        <InputBox
          id={`add-rep-peer-site-${index}`}
          name={`add-rep-peer-site-${index}`}
          placeholder={`site-name`}
          label=""
          readOnly={disabledFields.includes("name")}
          value={name}
          onChange={(e) => {
            onFieldChange(e, "name", index);
          }}
          data-test-id={`add-site-rep-peer-site-${index}`}
        />
      </Box>
      <Box>
        <InputBox
          id={`add-rep-peer-site-ep-${index}`}
          name={`add-rep-peer-site-ep-${index}`}
          placeholder={`https://dr.minio-storage:900${index}`}
          label=""
          readOnly={disabledFields.includes("endpoint")}
          error={fieldErrors["endpoint"]}
          value={endpoint}
          onChange={(e) => {
            onFieldChange(e, "endpoint", index);
          }}
          data-test-id={`add-site-rep-peer-ep-${index}`}
        />
      </Box>

      <Box>
        <InputBox
          id={`add-rep-peer-site-ac-${index}`}
          name={`add-rep-peer-site-ac-${index}`}
          label=""
          required={true}
          disabled={disabledFields.includes("accessKey")}
          value={accessKey}
          error={fieldErrors["accessKey"]}
          onChange={(e) => {
            onFieldChange(e, "accessKey", index);
          }}
          data-test-id={`add-rep-peer-site-ac-${index}`}
        />
      </Box>
      <Box>
        <InputBox
          id={`add-rep-peer-site-sk-${index}`}
          name={`add-rep-peer-site-sk-${index}`}
          label=""
          required={true}
          type={"password"}
          value={secretKey}
          error={fieldErrors["secretKey"]}
          disabled={disabledFields.includes("secretKey")}
          onChange={(e) => {
            onFieldChange(e, "secretKey", index);
          }}
          data-test-id={`add-rep-peer-site-sk-${index}`}
        />
      </Box>
      <Grid item xs={12} sx={{ alignItems: "center", display: "flex" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "baseline",
            marginTop: "4px",

            "& button": {
              borderColor: "#696969",
              color: "#696969",
              borderRadius: "50%",
            },
          }}
        >
          {showRowActions ? (
            <React.Fragment>
              <TooltipWrapper tooltip={"Add a Row"}>
                <Button
                  id={`add-row-${index}`}
                  variant="regular"
                  disabled={!canAdd}
                  icon={<AddIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    onAddClick?.(index);
                  }}
                  style={{
                    width: 25,
                    height: 25,
                    padding: 0,
                  }}
                />
              </TooltipWrapper>
              <TooltipWrapper tooltip={"Remove Row"}>
                <Button
                  id={`remove-row-${index}`}
                  variant="regular"
                  disabled={!canRemove}
                  icon={<RemoveIcon />}
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveClick?.(index);
                  }}
                  style={{
                    width: 25,
                    height: 25,
                    padding: 0,
                    marginLeft: 8,
                  }}
                />
              </TooltipWrapper>
            </React.Fragment>
          ) : null}
        </Box>
      </Grid>
    </Fragment>
  );
};

export default SRSiteInputRow;
