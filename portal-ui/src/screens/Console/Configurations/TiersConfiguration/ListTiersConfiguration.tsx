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

import React, { useEffect, useState, Fragment } from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { IconButton, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import {
  actionsTray,
  containerForHeader,
  searchField,
  settingsCommon,
  typesSelection,
} from "../../Common/FormComponents/common/styleLibrary";
import { CreateIcon } from "../../../../icons";
import { setErrorSnackMessage } from "../../../../actions";
import { ITierElement, ITierResponse } from "./types";
import { ErrorResponseHandler } from "../../../../common/types";
import api from "../../../../common/api";
import TableWrapper from "../../Common/TableWrapper/TableWrapper";
import SlideOptions from "../../Common/SlideOptions/SlideOptions";
import BackSettingsIcon from "../../../../icons/BackSettingsIcon";
import AddTierConfiguration from "./AddTierConfiguration";
import UpdateTierCredentiasModal from "./UpdateTierCredentiasModal";
import RefreshIcon from "@material-ui/icons/Refresh";

interface IListTiersConfig {
  classes: any;
  setErrorSnackMessage: typeof setErrorSnackMessage;
}

const styles = (theme: Theme) =>
  createStyles({
    ...actionsTray,
    ...searchField,
    ...settingsCommon,
    ...typesSelection,
    ...containerForHeader(theme.spacing(4)),
    strongText: {
      fontWeight: 700,
    },
    keyName: {
      marginLeft: 5,
    },
    iconText: {
      lineHeight: "24px",
    },
    customConfigurationPage: {
      height: "calc(100vh - 410px)",
      scrollbarWidth: "none" as const,
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    lambdaContainer: {
      padding: "15px 0",
    },
    actionsTray: {
      ...actionsTray.actionsTray,
      padding: "0 38px",
    },
    customTitle: {
      ...settingsCommon.customTitle,
      marginTop: 0,
    },
  });

const ListTiersConfiguration = ({
  classes,
  setErrorSnackMessage,
}: IListTiersConfig) => {
  const [records, setRecords] = useState<ITierElement[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPanel, setCurrentPanel] = useState<number>(0);
  const [updateCredentialsOpen, setUpdateCredentialsOpen] =
    useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<ITierElement>({
    type: "unsupported",
  });
  const [type, setType] = useState<string>("");

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

  const backClick = () => {
    setCurrentPanel(currentPanel - 1);
  };

  const addTier = () => {
    setCurrentPanel(1);
  };

  const tierAdded = () => {
    setCurrentPanel(0);
    setIsLoading(true);
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

  const typeSelect = (typeItem: string) => {
    setType(typeItem);
    setCurrentPanel(2);
  };

  return (
    <Fragment>
      {updateCredentialsOpen && (
        <UpdateTierCredentiasModal
          open={updateCredentialsOpen}
          tierData={selectedTier}
          closeModalAndRefresh={closeTierCredentials}
        />
      )}
      <Grid container>
        <Grid item xs={12}>
          <Grid item xs={12}>
            <div className={classes.settingsOptionsContainer}>
              <SlideOptions
                slideOptions={[
                  <Fragment>
                    <Grid item xs={12} className={classes.lambdaContainer}>
                      <Grid item xs={12} className={classes.actionsTray}>
                        <TextField
                          placeholder="Filter"
                          className={classes.searchField}
                          id="search-resource"
                          label=""
                          onChange={(event) => {
                            setFilter(event.target.value);
                          }}
                          InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <IconButton
                          color="primary"
                          aria-label="Refresh List"
                          component="span"
                          onClick={() => {
                            setIsLoading(true);
                          }}
                        >
                          <RefreshIcon />
                        </IconButton>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<CreateIcon />}
                          onClick={addTier}
                        >
                          Add Tier
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <br />
                      </Grid>
                      <Grid item xs={12}>
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
                          noBackground
                        />
                      </Grid>
                    </Grid>
                  </Fragment>,
                  <Fragment>
                    <Grid item xs={12} className={classes.backContainer}>
                      <button
                        onClick={backClick}
                        className={classes.backButton}
                      >
                        <BackSettingsIcon />
                        Back To Tiers
                      </button>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid item xs={12} className={classes.customTitle}>
                        Add Tier Configuration
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        className={classes.settingsFormContainer}
                      >
                        <Grid item xs={12}>
                          <Grid item xs={12} className={classes.centerElements}>
                            <div className={classes.iconContainer}>
                              <button
                                className={classes.lambdaNotif}
                                onClick={() => {
                                  typeSelect("minio");
                                }}
                              >
                                <img
                                  src={"/minioTier.png"}
                                  className={classes.logoButton}
                                  alt={"MinIO"}
                                />
                              </button>
                              <button
                                className={classes.lambdaNotif}
                                onClick={() => {
                                  typeSelect("gcs");
                                }}
                              >
                                <img
                                  src={"/gcs.png"}
                                  className={classes.logoButton}
                                  alt={"GCS"}
                                />
                              </button>
                              <button
                                className={classes.lambdaNotif}
                                onClick={() => {
                                  typeSelect("s3");
                                }}
                              >
                                <img
                                  src={"/amazon.png"}
                                  className={classes.logoButton}
                                  alt={"s3"}
                                />
                              </button>
                              <button
                                className={classes.lambdaNotif}
                                onClick={() => {
                                  typeSelect("azure");
                                }}
                              >
                                <img
                                  src={"/azure.png"}
                                  className={classes.logoButton}
                                  alt={"Azure"}
                                />
                              </button>
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Fragment>,
                  <Fragment>
                    <Grid item xs={12} className={classes.backContainer}>
                      <button
                        onClick={backClick}
                        className={classes.backButton}
                      >
                        <BackSettingsIcon />
                        Back To Tier Type Selection
                      </button>
                    </Grid>
                    <Grid item xs={12}>
                      {currentPanel === 2 && (
                        <AddTierConfiguration
                          type={type}
                          saveAndRefresh={tierAdded}
                        />
                      )}
                    </Grid>
                  </Fragment>,
                ]}
                currentSlide={currentPanel}
              />
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapDispatchToProps = {
  setErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(ListTiersConfiguration));
