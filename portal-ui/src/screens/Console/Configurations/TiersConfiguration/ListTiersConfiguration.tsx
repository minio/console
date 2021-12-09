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
import { LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {
  actionsTray,
  containerForHeader,
  searchField,
  settingsCommon,
  tableStyles,
  typesSelection,
} from "../../Common/FormComponents/common/styleLibrary";
import { AddIcon, TiersIcon } from "../../../../icons";
import { setErrorSnackMessage } from "../../../../actions";
import { ITierElement, ITierResponse } from "./types";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";

import RefreshIcon from "../../../../icons/RefreshIcon";
import PageHeader from "../../Common/PageHeader/PageHeader";
import HelpBox from "../../../../common/HelpBox";
import BoxIconButton from "../../Common/BoxIconButton/BoxIconButton";
import AButton from "../../Common/AButton/AButton";
import PageLayout from "../../Common/Layout/PageLayout";
import SearchBox from "../../Common/SearchBox";

import withSuspense from "../../Common/Components/withSuspense";

const UpdateTierCredentialsModal = withSuspense(
  React.lazy(() => import("./UpdateTierCredentialsModal"))
);

interface IListTiersConfig {
  classes: any;
  history: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...searchField,
    ...settingsCommon,
    ...typesSelection,
    ...containerForHeader(theme.spacing(4)),
    customConfigurationPage: {
      minHeight: 400,
    },
    actionsTray: {
      ...actionsTray.actionsTray,
    },
    searchField: {
      ...searchField.searchField,
      marginRight: "auto",
      maxWidth: 380,
    },

    rightActionButtons: {
      display: "flex",
      "& button": {
        whiteSpace: "nowrap",
      },
    },
    ...tableStyles,
  });

const ListTiersConfiguration = ({
  classes,
  history,
  setErrorSnackMessage,
}: IListTiersConfig) => {
  const [records, setRecords] = useState<ITierElement[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updateCredentialsOpen, setUpdateCredentialsOpen] =
    useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<ITierElement>({
    type: "unsupported",
  });

  useEffect(() => {
    if (isLoading) {
      const fetchRecords = () => {
        api
          .invoke("GET", `/api/v1/admin/tiers`)
          .then((res: ITierResponse) => {
            setRecords(res.items || []);
            setIsLoading(false);
          })
          .catch((err: ErrorResponseHandler) => {
            setErrorSnackMessage(err);
            setIsLoading(false);
          });
      };
      fetchRecords();
    }
  }, [isLoading, setErrorSnackMessage]);

  const filteredRecords = records.filter((b: ITierElement) => {
    if (filter === "") {
      return true;
    }
    const getItemName = get(b, `${b.type}.name`, "");
    const getItemType = get(b, `type`, "");

    return getItemName.indexOf(filter) >= 0 || getItemType.indexOf(filter) >= 0;
  });

  const addTier = () => {
    history.push("/tiers/add");
  };

  const renderTierName = (item: ITierElement) => {
    const name = get(item, `${item.type}.name`, "");

    if (name !== null) {
      return name;
    }

    return "";
  };

  const renderTierPrefix = (item: ITierElement) => {
    const prefix = get(item, `${item.type}.prefix`, "");

    if (prefix !== null) {
      return prefix;
    }

    return "";
  };

  const renderTierEndpoint = (item: ITierElement) => {
    const endpoint = get(item, `${item.type}.endpoint`, "");

    if (endpoint !== null) {
      return endpoint;
    }

    return "";
  };

  const renderTierBucket = (item: ITierElement) => {
    const bucket = get(item, `${item.type}.bucket`, "");

    if (bucket !== null) {
      return bucket;
    }

    return "";
  };

  const renderTierRegion = (item: ITierElement) => {
    const region = get(item, `${item.type}.region`, "");

    if (region !== null) {
      return region;
    }

    return "";
  };

  const closeTierCredentials = () => {
    setUpdateCredentialsOpen(false);
  };

  return (
    <Fragment>
      {updateCredentialsOpen && (
        <UpdateTierCredentialsModal
          open={updateCredentialsOpen}
          tierData={selectedTier}
          closeModalAndRefresh={closeTierCredentials}
        />
      )}
      <PageHeader label="Tiers" />
      <PageLayout>
        <Grid item xs={12} className={classes.actionsTray}>
          <SearchBox
            placeholder="Filter"
            onChange={setFilter}
            overrideClass={classes.searchField}
          />

          <div className={classes.rightActionButtons}>
            <BoxIconButton
              color="primary"
              aria-label="Refresh List"
              onClick={() => {
                setIsLoading(true);
              }}
              size="large"
            >
              <RefreshIcon />
            </BoxIconButton>
            <Button
              variant="contained"
              color="primary"
              endIcon={<AddIcon />}
              onClick={addTier}
            >
              Add Tier
            </Button>
          </div>
        </Grid>
        {isLoading && <LinearProgress />}
        {!isLoading && (
          <Fragment>
            {records.length > 0 && (
              <Fragment>
                <Grid item xs={12} className={classes.tableBlock}>
                  <TableWrapper
                    itemActions={[
                      {
                        type: "edit",
                        onClick: (tierData: ITierElement) => {
                          setSelectedTier(tierData);
                          setUpdateCredentialsOpen(true);
                        },
                      },
                    ]}
                    columns={[
                      {
                        label: "Tier Name",
                        elementKey: "type",
                        renderFunction: renderTierName,
                        renderFullObject: true,
                      },
                      {
                        label: "Type",
                        elementKey: "type",
                        width: 150,
                      },
                      {
                        label: "Endpoint",
                        elementKey: "type",
                        renderFunction: renderTierEndpoint,
                        renderFullObject: true,
                      },
                      {
                        label: "Bucket",
                        elementKey: "type",
                        renderFunction: renderTierBucket,
                        renderFullObject: true,
                      },
                      {
                        label: "Prefix",
                        elementKey: "type",
                        renderFunction: renderTierPrefix,
                        renderFullObject: true,
                      },
                      {
                        label: "Region",
                        elementKey: "type",
                        renderFunction: renderTierRegion,
                        renderFullObject: true,
                      },
                    ]}
                    isLoading={isLoading}
                    records={filteredRecords}
                    entityName="Tiers"
                    idField="service_name"
                    customPaperHeight={classes.customConfigurationPage}
                  />
                </Grid>
                <Grid item xs={12}>
                  <HelpBox
                    title={"Learn more about TIERS"}
                    iconComponent={<TiersIcon />}
                    help={
                      <Fragment>
                        Tiers are used by the MinIO Object Lifecycle Management
                        which allows creating rules for time or date based
                        automatic transition or expiry of objects. For object
                        transition, MinIO automatically moves the object to a
                        configured remote storage tier.
                        <br />
                        <br />
                        You can learn more at our{" "}
                        <a
                          href="https://docs.min.io/minio/baremetal/lifecycle-management/lifecycle-management-overview.html?ref=con"
                          target="_blank"
                          rel="noreferrer"
                        >
                          documentation
                        </a>
                        .
                      </Fragment>
                    }
                  />
                </Grid>
              </Fragment>
            )}
            {records.length === 0 && (
              <Grid
                container
                justifyContent={"center"}
                alignContent={"center"}
                alignItems={"center"}
              >
                <Grid item xs={8}>
                  <HelpBox
                    title={"Tiers"}
                    iconComponent={<TiersIcon />}
                    help={
                      <Fragment>
                        Tiers are used by the MinIO Object Lifecycle Management
                        which allows creating rules for time or date based
                        automatic transition or expiry of objects. For object
                        transition, MinIO automatically moves the object to a
                        configured remote storage tier.
                        <br />
                        <br />
                        To get started,{" "}
                        <AButton onClick={addTier}>Add A Tier</AButton>.
                      </Fragment>
                    }
                  />
                </Grid>
              </Grid>
            )}
          </Fragment>
        )}
      </PageLayout>
    </Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(ListTiersConfiguration));
