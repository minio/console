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
import { useNavigate } from "react-router-dom";
import {
  ActionLink,
  AddIcon,
  Box,
  Button,
  DataTable,
  Grid,
  HelpBox,
  PageLayout,
  ProgressBar,
  RefreshIcon,
  TierOfflineIcon,
  TierOnlineIcon,
  TiersIcon,
  TiersNotAvailableIcon,
} from "mds";
import { api } from "api";
import { errorToHandler } from "api/errors";
import { Tier } from "api/consoleApi";
import { actionsTray } from "../../Common/FormComponents/common/styleLibrary";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PERMISSIONS,
  IAM_ROLES,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import {
  hasPermission,
  SecureComponent,
} from "../../../../common/SecureComponent";
import { tierTypes } from "./utils";

import {
  selDistSet,
  setErrorSnackMessage,
  setHelpName,
} from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import SearchBox from "../../Common/SearchBox";
import withSuspense from "../../Common/Components/withSuspense";
import DistributedOnly from "../../Common/DistributedOnly/DistributedOnly";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../../HelpMenu";
import DeleteTierConfirmModal from "./DeleteTierConfirmModal";

const UpdateTierCredentialsModal = withSuspense(
  React.lazy(() => import("./UpdateTierCredentialsModal")),
);

const ListTiersConfiguration = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const distributedSetup = useSelector(selDistSet);
  const [records, setRecords] = useState<Tier[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updateCredentialsOpen, setUpdateCredentialsOpen] =
    useState<boolean>(false);

  const [deleteTierModalOpen, setDeleteTierModalOpen] =
    useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<Tier>({
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
          api.admin
            .tiersList()
            .then((res) => {
              setRecords(res.data.items || []);
              setIsLoading(false);
            })
            .catch((err) => {
              dispatch(setErrorSnackMessage(errorToHandler(err.error)));
              setIsLoading(false);
            });
        };
        fetchRecords();
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoading, dispatch, distributedSetup]);

  const filteredRecords = records.filter((b: Tier) => {
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

  const renderTierName = (item: Tier) => {
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
            flexDirection: "column",
          }}
        >
          <TierOnlineIcon style={{ fill: "#4CCB92", width: 14, height: 14 }} />
          ONLINE
        </Grid>
      );
    }
    return (
      <Grid
        container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#C83B51",
          fontSize: "8px",
        }}
      >
        <TierOfflineIcon style={{ fill: "#C83B51", width: 14, height: 14 }} />
        OFFLINE
      </Grid>
    );
  };

  const renderTierPrefix = (item: Tier) => {
    const prefix = get(item, `${item.type}.prefix`, "");

    if (prefix !== null) {
      return prefix;
    }

    return "";
  };

  const renderTierEndpoint = (item: Tier) => {
    const endpoint = get(item, `${item.type}.endpoint`, "");

    if (endpoint !== null) {
      return endpoint;
    }

    return "";
  };

  const renderTierBucket = (item: Tier) => {
    const bucket = get(item, `${item.type}.bucket`, "");

    if (bucket !== null) {
      return bucket;
    }

    return "";
  };

  const renderTierRegion = (item: Tier) => {
    const region = get(item, `${item.type}.region`, "");

    if (region !== null) {
      return region;
    }

    return "";
  };

  const renderTierUsage = (item: Tier) => {
    const endpoint = get(item, `${item.type}.usage`, "");

    if (endpoint !== null) {
      return endpoint;
    }

    return "";
  };

  const renderTierObjects = (item: Tier) => {
    const endpoint = get(item, `${item.type}.objects`, "");

    if (endpoint !== null) {
      return endpoint;
    }

    return "";
  };

  const renderTierVersions = (item: Tier) => {
    const endpoint = get(item, `${item.type}.versions`, "");

    if (endpoint !== null) {
      return endpoint;
    }

    return "";
  };

  const closeTierCredentials = () => {
    setUpdateCredentialsOpen(false);
  };
  const closeDeleteTier = () => {
    setDeleteTierModalOpen(false);
    setIsLoading(true);
  };

  useEffect(() => {
    dispatch(setHelpName("list-tiers-configuration"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      {updateCredentialsOpen && (
        <UpdateTierCredentialsModal
          open={updateCredentialsOpen}
          tierData={selectedTier}
          closeModalAndRefresh={closeTierCredentials}
        />
      )}
      {deleteTierModalOpen && (
        <DeleteTierConfirmModal
          open={deleteTierModalOpen}
          tierName={get(selectedTier, `${selectedTier.type}.name`, "")}
          closeModalAndRefresh={closeDeleteTier}
        />
      )}
      <PageHeaderWrapper label="Tiers" actions={<HelpMenu />} />

      <PageLayout>
        {!distributedSetup ? (
          <DistributedOnly
            entity={"Tiers"}
            iconComponent={<TiersNotAvailableIcon />}
          />
        ) : (
          <Fragment>
            <Grid item xs={12} sx={actionsTray.actionsTray}>
              <SearchBox
                placeholder="Filter"
                onChange={setFilter}
                value={filter}
                sx={{
                  marginRight: "auto",
                  maxWidth: 380,
                }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  gap: 5,
                }}
              >
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
              </Box>
            </Grid>
            {isLoading && <ProgressBar />}
            {!isLoading && (
              <Fragment>
                {records.length > 0 && (
                  <Fragment>
                    <Grid item xs={12}>
                      <SecureComponent
                        scopes={[IAM_SCOPES.ADMIN_LIST_TIERS]}
                        resource={CONSOLE_UI_RESOURCE}
                        errorProps={{ disabled: true }}
                      >
                        <DataTable
                          itemActions={[
                            {
                              type: "edit",
                              onClick: (tierData: Tier) => {
                                setSelectedTier(tierData);
                                setUpdateCredentialsOpen(true);
                              },
                            },
                            {
                              type: "delete",
                              isDisabled: !hasPermission(
                                "*",
                                IAM_PERMISSIONS[IAM_ROLES.BUCKET_LIFECYCLE],
                                true,
                              ),
                              onClick: (tierData: Tier) => {
                                setSelectedTier(tierData);
                                setDeleteTierModalOpen(true);
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
                          customPaperHeight={"400px"}
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
                        {hasSetTier ? (
                          <div>
                            To get started,{" "}
                            <ActionLink
                              isLoading={false}
                              label={""}
                              onClick={addTier}
                            >
                              Create Tier
                            </ActionLink>
                            .
                          </div>
                        ) : (
                          ""
                        )}
                      </Fragment>
                    }
                  />
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </PageLayout>
    </Fragment>
  );
};

export default ListTiersConfiguration;
