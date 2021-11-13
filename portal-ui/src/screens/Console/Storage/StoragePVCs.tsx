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

import React, { Fragment, useEffect, useState } from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid, InputAdornment, TextField } from "@mui/material";
import history from "../../../history";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import { IPVCsResponse, IStoragePVCs } from "./types";
import { setErrorSnackMessage } from "../../../actions";
import { ErrorResponseHandler } from "../../../common/types";
import api from "../../../common/api";
import TableWrapper from "../Common/TableWrapper/TableWrapper";
import SearchIcon from "../../../icons/SearchIcon";

interface IStorageVolumesProps {
  classes: any;
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

const StorageVolumes = ({
  classes,
  setErrorSnackMessage,
}: IStorageVolumesProps) => {
  const [records, setRecords] = useState<IStoragePVCs[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (loading) {
      api
        .invoke("GET", `/api/v1/list-pvcs`)
        .then((res: IPVCsResponse) => {
          let volumes = get(res, "pvcs", []);
          setRecords(volumes ? volumes : []);
          setLoading(false);
        })
        .catch((err: ErrorResponseHandler) => {
          setLoading(false);
          setErrorSnackMessage(err);
        });
    }
  }, [loading, setErrorSnackMessage]);

  const filteredRecords: IStoragePVCs[] = records.filter((elementItem) =>
    elementItem.name.includes(filter)
  );

  const tableActions = [
    {
      type: "view",
      onClick: (record: any) => {
        history.push(
          `/namespaces/${record.namespace}/tenants/${record.tenant}`
        );
      },
    },
  ];

  return (
    <Fragment>
      <h1 className={classes.sectionTitle}>Persistent Volumes Claims</h1>
      <Grid item xs={12} className={classes.actionsTray}>
        <TextField
          placeholder="Search Volumes (PVCs)"
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
          itemActions={tableActions}
          columns={[
            {
              label: "Name",
              elementKey: "name",
            },
            {
              label: "Namespace",
              elementKey: "namespace",
              width: 90,
            },
            {
              label: "Status",
              elementKey: "status",
              width: 120,
            },
            {
              label: "Tenant",
              renderFullObject: true,
              renderFunction: (record: any) =>
                `${record.namespace}/${record.tenant}`,
            },
            {
              label: "Capacity",
              elementKey: "capacity",
              width: 90,
            },
            {
              label: "Storage Class",
              elementKey: "storageClass",
            },
          ]}
          isLoading={loading}
          records={filteredRecords}
          entityName="PVCs"
          idField="name"
          customPaperHeight={classes.tableWrapper}
        />
      </Grid>
    </Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(StorageVolumes));
