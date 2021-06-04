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
import { connect } from "react-redux";
import get from "lodash/get";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import {
  actionsTray,
  buttonsStyles,
  containerForHeader,
  hrClass,
  modalBasic,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@material-ui/core/Grid";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import Paper from "@material-ui/core/Paper";
import api from "../../../../common/api";
import PageHeader from "../../Common/PageHeader/PageHeader";
import { ILog, ITenant } from "../ListTenants/types";
import { LicenseInfo } from "../../License/types";
import { Link } from "react-router-dom";
import { setErrorSnackMessage } from "../../../../actions";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TenantYAML from "./TenantYAML";
import SubnetLicenseTenant from "./SubnetLicenseTenant";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import history from "../../../../history";

interface ITenantDetailsProps {
  classes: any;
  match: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    multiContainer: {
      display: "flex",
      alignItems: "center" as const,
      justifyContent: "flex-start" as const,
    },
    sizeFactorContainer: {
      marginLeft: 8,
    },
    containerHeader: {
      display: "flex",
      justifyContent: "space-between",
    },
    paperContainer: {
      padding: "15px 15px 15px 50px",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "auto auto auto auto",
      gridGap: 8,
      "& div": {
        display: "flex",
        alignItems: "center",
      },
      "& div:nth-child(odd)": {
        justifyContent: "flex-end",
        fontWeight: 700,
      },
      "& div:nth-child(2n)": {
        paddingRight: 35,
      },
    },
    masterActions: {
      width: "25%",
      minWidth: "120px",
      "& div": {
        margin: "5px 0px",
      },
    },
    updateButton: {
      backgroundColor: "transparent",
      border: 0,
      padding: "0 6px",
      cursor: "pointer",
      "&:focus, &:active": {
        outline: "none",
      },
      "& svg": {
        height: 12,
      },
    },
    poolLabel: {
      color: "#666666",
    },
    titleCol: {
      fontWeight: "bold",
    },
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
    ...modalBasic,
    ...actionsTray,
    ...buttonsStyles,
    ...searchField,
    ...hrClass,
    actionsTray: {
      ...actionsTray.actionsTray,
      padding: "15px 0 0",
    },
    ...containerForHeader(theme.spacing(4)),
  });

const TenantDetails = ({
  classes,
  match,
  setErrorSnackMessage,
}: ITenantDetailsProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [log, setLog] = useState<string>("");
  const tenantNamespace = match.params["tenantNamespace"];
  const tenantName = match.params["tenantName"];
  const podName = match.params["podName"];

  const loadInfo = () => {
    api
      .invoke(
        "GET",
        `/api/v1/namespaces/${tenantNamespace}/tenants/${tenantName}/pods/${podName}`
      )
      .then((res: string) => {
        setLog(res);
      })
      .catch((err) => {
        setErrorSnackMessage(err);
      });
  };

  useEffect(() => {
    loadInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <PageHeader
        label={<Fragment>{` > ${match.params["podName"]}`}</Fragment>}
      />
      <Grid item xs={12} className={classes.container} />
      <Grid container>
        <Grid item xs={12}>
          <Fragment>{`${log}`}</Fragment>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const connector = connect(null, {
  setErrorSnackMessage,
});

export default withStyles(styles)(connector(TenantDetails));
