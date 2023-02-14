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
import { useSelector } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Box, LinearProgress } from "@mui/material";
import {
  AddIcon,
  Button,
  HelpBox,
  RefreshIcon,
  TierOfflineIcon,
  TierOnlineIcon,
  TiersIcon,
  TiersNotAvailableIcon,
} from "mds";
import Grid from "@mui/material/Grid";
import {
  actionsTray,
  containerForHeader,
  searchField,
  settingsCommon,
  tableStyles,
  typesSelection,
} from "../../Common/FormComponents/common/styleLibrary";

import { ITierElement, ITierResponse } from "./types";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import AButton from "../../Common/AButton/AButton";
import PageLayout from "../../Common/Layout/PageLayout";
import SearchBox from "../../Common/SearchBox";

import withSuspense from "../../Common/Components/withSuspense";
import DistributedOnly from "../../Common/DistributedOnly/DistributedOnly";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../../common/SecureComponent";
import { tierTypes } from "./utils";

import { selDistSet, setErrorSnackMessage } from "../../../../systemSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../../store";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";

const UpdateTierCredentialsModal = withSuspense(
  React.lazy(() => import("./UpdateTierCredentialsModal"))
);

interface IListTiersConfig {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...searchField,
    ...settingsCommon,
    ...typesSelection,
    ...containerForHeader,
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

const ListTiersConfiguration = ({ classes }: IListTiersConfig) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const distributedSetup = useSelector(selDistSet);
  const [records, setRecords] = useState<ITierElement[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updateCredentialsOpen, setUpdateCredentialsOpen] =
    useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<ITierElement>({
    type: "unsupported",
    status: false,
  });
  const hasSetTier = hasPermission(CONSOLE_UI_RESOURCE, [
    IAM_SCOPES.ADMIN_SET_TIER,
  ]);

  useEffect(() => {
    if (isLoading) {
      if (distributedSetup) {
        const fetchRecords = () => {
          api
            .invoke("GET", `/api/v1/admin/tiers`)
            .then((res: ITierResponse) => {
              setRecords(res.items || []);
              setIsLoading(false);
            })
            .catch((err: ErrorResponseHandler) => {
              dispatch(setErrorSnackMessage(err));
              setIsLoading(false);
            });
        };
        fetchRecords();
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoading, dispatch, distributedSetup]);

  const filteredRecords = records.filter((b: ITierElement) => {
    if (filter === "") {
      return true;
    }
    const getItemName = get(b, `${b.type}.name`, "");
    const getItemType = get(b, `type`, "");

    return getItemName.indexOf(filter) >= 0 || getItemType.indexOf(filter) >= 0;
  });

  const addTier = () => {
    navigate(IAM_PAGES.TIERS_ADD);
  };

  const renderTierName = (item: ITierElement) => {
    const name = get(item, `${item.type}.name`, "");

    if (name !== null) {
      return <b>{name}</b>;
    }

    return "";
  };

  const renderTierType = (item: string) => {
    const { logoXs } =
      tierTypes.find((tierConf) => tierConf.serviceName === item) || {};
    if (item) {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            "& .min-icon": {
              width: "18px",
              height: "22px",
            },
          }}
        >
          {logoXs}
        </Box>
      );
    }
    return "";
  };

  const renderTierStatus = (item: boolean) => {
    if (item) {
      return (
        <Grid
          container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyItems: "start",
            color: "#4CCB92",
            fontSize: "8px",
          }}
          flexDirection={"column"}
          display={"flex"}
        >
          <TierOnlineIcon />
          ONLINE
        </Grid>
      );
    }
    return (
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          color: "#C83B51",
          fontSize: "8px",
        }}
        flexDirection={"column"}
        display={"flex"}
      >
        <TierOfflineIcon />
        OFFLINE
      </Grid>
    );
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

  const renderTierUsage = (item: ITierElement) => {
    const endpoint = get(item, `${item.type}.usage`, "");

    if (endpoint !== null) {
      return endpoint;
    }

    return "";
  };

  const renderTierObjects = (item: ITierElement) => {
    const endpoint = get(item, `${item.type}.objects`, "");

    if (endpoint !== null) {
      return endpoint;
    }

    return "";
  };

  const renderTierVersions = (item: ITierElement) => {
    const endpoint = get(item, `${item.type}.versions`, "");

    if (endpoint !== null) {
      return endpoint;
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
      <PageHeaderWrapper label="Tiers" />
      <PageLayout>
        {!distributedSetup ? (
          <DistributedOnly
            entity={"Tiers"}
            iconComponent={<TiersNotAvailableIcon />}
          />
        ) : (
          <Fragment>
            <Grid item xs={12} className={classes.actionsTray}>
              <SearchBox
                placeholder="Filter"
                onChange={setFilter}
                overrideClass={classes.searchField}
                value={filter}
              />

              <div className={classes.rightActionButtons}>
                <Button
                  id={"refresh-list"}
                  icon={<RefreshIcon />}
                  label={`Refresh List`}
                  onClick={() => {
                    setIsLoading(true);
                  }}
                />
                <TooltipWrapper
                  tooltip={
                    hasSetTier
                      ? ""
                      : "You require additional permissions in order to create a new Tier. Please ask your MinIO administrator to grant you " +
                        IAM_SCOPES.ADMIN_SET_TIER +
                        " permission in order to create a Tier."
                  }
                >
                  <SecureComponent
                    scopes={[IAM_SCOPES.ADMIN_SET_TIER]}
                    resource={CONSOLE_UI_RESOURCE}
                    errorProps={{ disabled: true }}
                  >
                    <Button
                      id={"add-tier"}
                      icon={<AddIcon />}
                      label={`Create Tier`}
                      onClick={addTier}
                      variant="callAction"
                    />
                  </SecureComponent>
                </TooltipWrapper>
              </div>
            </Grid>
            {isLoading && <LinearProgress />}
            {!isLoading && (
              <Fragment>
                {records.length > 0 && (
                  <Fragment>
                    <Grid item xs={12} className={classes.tableBlock}>
                      <SecureComponent
                        scopes={[IAM_SCOPES.ADMIN_LIST_TIERS]}
                        resource={CONSOLE_UI_RESOURCE}
                        errorProps={{ disabled: true }}
                      >
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
                              label: "Status",
                              elementKey: "status",
                              renderFunction: renderTierStatus,
                              width: 50,
                            },
                            {
                              label: "Type",
                              elementKey: "type",
                              renderFunction: renderTierType,
                              width: 50,
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
                            {
                              label: "Usage",
                              elementKey: "type",
                              renderFunction: renderTierUsage,
                              renderFullObject: true,
                            },
                            {
                              label: "Objects",
                              elementKey: "type",
                              renderFunction: renderTierObjects,
                              renderFullObject: true,
                            },
                            {
                              label: "Versions",
                              elementKey: "type",
                              renderFunction: renderTierVersions,
                              renderFullObject: true,
                            },
                          ]}
                          isLoading={isLoading}
                          records={filteredRecords}
                          entityName="Tiers"
                          idField="service_name"
                          customPaperHeight={classes.customConfigurationPage}
                        />
                      </SecureComponent>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        marginTop: "15px",
                      }}
                    >
                      <HelpBox
                        title={"Learn more about TIERS"}
                        iconComponent={<TiersIcon />}
                        help={
                          <Fragment>
                            Tiers are used by the MinIO Object Lifecycle
                            Management which allows creating rules for time or
                            date based automatic transition or expiry of
                            objects. For object transition, MinIO automatically
                            moves the object to a configured remote storage
                            tier.
                            <br />
                            <br />
                            You can learn more at our{" "}
                            <a
                              href="https://min.io/docs/minio/linux/administration/object-management/object-lifecycle-management.html?ref=con"
                              target="_blank"
                              rel="noopener"
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
                            Tiers are used by the MinIO Object Lifecycle
                            Management which allows creating rules for time or
                            date based automatic transition or expiry of
                            objects. For object transition, MinIO automatically
                            moves the object to a configured remote storage
                            tier.
                            <br />
                            <br />
                            {hasSetTier ? (
                              <div>
                                To get started,{" "}
                                <AButton onClick={addTier}>Create Tier</AButton>
                                .
                              </div>
                            ) : (
                              ""
                            )}
                          </Fragment>
                        }
                      />
                    </Grid>
                  </Grid>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(ListTiersConfiguration);
