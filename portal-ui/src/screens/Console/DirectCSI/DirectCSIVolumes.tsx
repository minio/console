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

import React, { Fragment, useState, useEffect } from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid, InputAdornment, TextField } from "@mui/material";
import { AppState } from "../../../store";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { IDirectCSIVolumes, IVolumesResponse } from "./types";
import { setErrorSnackMessage } from "../../../actions";
import { niceBytes } from "../../../common/utils";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import SearchIcon from "../../../icons/SearchIcon";

interface IDirectCSIVolumesProps {
  classes: any;
  selectedDrive: string;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    headerLabel: {
      fontSize: 22,
      fontWeight: 600,
      color: "#000",
      marginTop: 4,
    },
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
    tableWrapper: {
      height: "calc(100vh - 267px)",
    },
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

const DirectCSIVolumes = ({
  classes,
  selectedDrive,
  setErrorSnackMessage,
}: IDirectCSIVolumesProps) => {
  const [records, setRecords] = useState<IDirectCSIVolumes[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      api
        .invoke("GET", `/api/v1/direct-csi/volumes?drives=${selectedDrive}`)
        .then((res: IVolumesResponse) => {
          let volumes = get(res, "volumes", []);

          if (!volumes) {
            volumes = [];
          }

          volumes.sort((d1, d2) => {
            if (d1.volume > d2.volume) {
              return 1;
            }

            if (d1.volume < d2.volume) {
              return -1;
            }

            return 0;
          });

          setRecords(volumes);
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          setErrorSnackMessage(err);
        });
    }
  }, [loading, selectedDrive, setErrorSnackMessage]);

  const filteredRecords: IDirectCSIVolumes[] = records.filter((elementItem) =>
    elementItem.drive.includes(filter)
  );

  return (
    <Fragment>
      <Grid item xs={12} className={classes.actionsTray}>
        <TextField
          placeholder="Search Volumes"
          className={classes.searchField}
          id="search-resource"
          label=""
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
          variant="standard"
        />
      </Grid>
      <Grid item xs={12}>
        <br />
      </Grid>
      <Grid item xs={12}>
        <TableWrapper
          itemActions={[]}
          columns={[
            {
              label: "Volume",
              elementKey: "volume",
            },
            {
              label: "Capacity",
              elementKey: "capacity",
              renderFunction: niceBytes,
            },
            {
              label: "Node",
              elementKey: "node",
            },
            {
              label: "Drive",
              elementKey: "drive",
            },
          ]}
          isLoading={loading}
          records={filteredRecords}
          entityName="Volumes"
          idField="volume"
          customPaperHeight={classes.tableWrapper}
        />
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  selectedDrive: state.directCSI.selectedDrive,
});

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(mapState, mapDispatchToProps);

export default withStyles(styles)(connector(DirectCSIVolumes));
