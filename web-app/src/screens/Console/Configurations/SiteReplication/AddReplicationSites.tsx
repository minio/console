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

import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BackLink,
  Button,
  ClustersIcon,
  HelpBox,
  PageLayout,
  Box,
  Grid,
  ProgressBar,
  InputLabel,
  SectionTitle,
} from "mds";
import useApi from "../../Common/Hooks/useApi";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import {
  setErrorSnackMessage,
  setHelpName,
  setSnackBarMessage,
} from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { useSelector } from "react-redux";
import { selSession } from "../../consoleSlice";
import SRSiteInputRow from "./SRSiteInputRow";
import { SiteInputRow } from "./Types";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import HelpMenu from "../../HelpMenu";

const isValidEndPoint = (ep: string) => {
  let isValidEndPointUrl = false;

  try {
    new URL(ep);
    isValidEndPointUrl = true;
  } catch (err) {
    isValidEndPointUrl = false;
  }
  if (isValidEndPointUrl) {
    return "";
  } else {
    return "Invalid Endpoint";
  }
};

const isEmptyValue = (value: string): boolean => {
  return value?.trim() === "";
};

const TableHeader = () => {
  return (
    <React.Fragment>
      <Box>
        <InputLabel>Site Name</InputLabel>
      </Box>
      <Box>
        <InputLabel>Endpoint {"*"}</InputLabel>
      </Box>
      <Box>
        <InputLabel>Access Key {"*"}</InputLabel>
      </Box>
      <Box>
        <InputLabel>Secret Key {"*"}</InputLabel>
      </Box>
      <Box> </Box>
    </React.Fragment>
  );
};

const SiteTypeHeader = ({ title }: { title: string }) => {
  return (
    <Grid item xs={12}>
      <Box
        sx={{
          marginBottom: "15px",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        {title}
      </Box>
    </Grid>
  );
};

const AddReplicationSites = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { serverEndPoint = "" } = useSelector(selSession);

  const [currentSite, setCurrentSite] = useState<SiteInputRow[]>([
    {
      endpoint: serverEndPoint,
      name: "",
      accessKey: "",
      secretKey: "",
    },
  ]);

  const [existingSites, setExistingSites] = useState<SiteInputRow[]>([]);

  const setDefaultNewRows = () => {
    const defaultNewSites = [
      { endpoint: "", name: "", accessKey: "", secretKey: "" },
    ];
    setExistingSites(defaultNewSites);
  };

  const [isSiteInfoLoading, invokeSiteInfoApi] = useApi(
    (res: any) => {
      const { sites: siteList, name: curSiteName } = res;
      // current site name to be the fist one.
      const foundIdx = siteList.findIndex((el: any) => el.name === curSiteName);
      if (foundIdx !== -1) {
        let curSite = siteList[foundIdx];
        curSite = {
          ...curSite,
          isCurrent: true,
          isSaved: true,
        };

        setCurrentSite([curSite]);
        siteList.splice(foundIdx, 1);
      }

      siteList.sort((x: any, y: any) => {
        return x.name === curSiteName ? -1 : y.name === curSiteName ? 1 : 0;
      });

      let existingSiteList = siteList.map((si: any) => {
        return {
          ...si,
          accessKey: "",
          secretKey: "",
          isSaved: true,
        };
      });

      if (existingSiteList.length) {
        setExistingSites(existingSiteList);
      } else {
        setDefaultNewRows();
      }
    },
    (err: any) => {
      setDefaultNewRows();
    },
  );

  const getSites = () => {
    invokeSiteInfoApi("GET", `api/v1/admin/site-replication`);
  };

  useEffect(() => {
    getSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setHelpName("add-replication-sites"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const existingEndPointsValidity = existingSites.reduce(
    (acc: string[], cv, i) => {
      const epValue = existingSites[i].endpoint;
      const isEpValid = isValidEndPoint(epValue);

      if (isEpValid === "" && epValue !== "") {
        acc.push(isEpValid);
      }
      return acc;
    },
    [],
  );

  const isExistingCredsValidity = existingSites
    .map((site) => {
      return !isEmptyValue(site.accessKey) && !isEmptyValue(site.secretKey);
    })
    .filter(Boolean);

  const { accessKey: cAccessKey, secretKey: cSecretKey } = currentSite[0];

  const isCurCredsValid =
    !isEmptyValue(cAccessKey) && !isEmptyValue(cSecretKey);
  const peerEndpointsValid =
    existingEndPointsValidity.length === existingSites.length;
  const peerCredsValid =
    isExistingCredsValidity.length === existingSites.length;

  let isAllFieldsValid =
    isCurCredsValid && peerEndpointsValid && peerCredsValid;

  const [isAdding, invokeSiteAddApi] = useApi(
    (res: any) => {
      if (res.success) {
        dispatch(setSnackBarMessage(res.status));
        resetForm();
        getSites();
        navigate(IAM_PAGES.SITE_REPLICATION);
      } else {
        dispatch(
          setErrorSnackMessage({
            errorMessage: "Error",
            detailedError: res.status,
          }),
        );
      }
    },
    (err: any) => {
      dispatch(setErrorSnackMessage(err));
    },
  );

  const resetForm = () => {
    setDefaultNewRows();
    setCurrentSite((prevItems) => {
      return prevItems.map((item, ix) => ({
        ...item,
        accessKey: "",
        secretKey: "",
        name: "",
      }));
    });
  };

  const addSiteReplication = () => {
    const curSite: any[] = currentSite?.map((es, idx) => {
      return {
        accessKey: es.accessKey,
        secretKey: es.secretKey,
        name: es.name,
        endpoint: es.endpoint.trim(),
      };
    });

    const newOrExistingSitesToAdd = existingSites.reduce(
      (acc: any, ns, idx) => {
        if (ns.endpoint) {
          acc.push({
            accessKey: ns.accessKey,
            secretKey: ns.secretKey,
            name: ns.name || `dr-site-${idx}`,
            endpoint: ns.endpoint.trim(),
          });
        }
        return acc;
      },
      [],
    );

    const sitesToAdd = curSite.concat(newOrExistingSitesToAdd);

    invokeSiteAddApi("POST", `api/v1/admin/site-replication`, sitesToAdd);
  };

  const renderCurrentSite = () => {
    return (
      <Box
        sx={{
          marginTop: "15px",
        }}
      >
        <SiteTypeHeader title={"This Site"} />
        <Box
          withBorders
          sx={{
            display: "grid",
            gridTemplateColumns: ".8fr 1.2fr .8fr .8fr .2fr",
            padding: "15px",
            gap: "10px",
            maxHeight: "430px",
            overflowY: "auto",
          }}
        >
          <TableHeader />

          {currentSite.map((cs, index) => {
            const accessKeyError = isEmptyValue(cs.accessKey)
              ? "AccessKey is required"
              : "";
            const secretKeyError = isEmptyValue(cs.secretKey)
              ? "SecretKey is required"
              : "";
            return (
              <SRSiteInputRow
                key={`current-${index}`}
                rowData={cs}
                rowId={index}
                fieldErrors={{
                  accessKey: accessKeyError,
                  secretKey: secretKeyError,
                }}
                onFieldChange={(e, fieldName, index) => {
                  const filedValue = e.target.value;
                  if (fieldName !== "") {
                    setCurrentSite((prevItems) => {
                      return prevItems.map((item, ix) =>
                        ix === index
                          ? { ...item, [fieldName]: filedValue }
                          : item,
                      );
                    });
                  }
                }}
                showRowActions={false}
              />
            );
          })}
        </Box>
      </Box>
    );
  };

  const renderPeerSites = () => {
    return (
      <Box
        sx={{
          marginTop: "25px",
        }}
      >
        <SiteTypeHeader title={"Peer Sites"} />
        <Box
          withBorders
          sx={{
            display: "grid",
            gridTemplateColumns: ".8fr 1.2fr .8fr .8fr .2fr",
            padding: "15px",
            gap: "10px",
            maxHeight: "430px",
            overflowY: "auto",
          }}
        >
          <TableHeader />

          {existingSites.map((ps, index) => {
            const endPointError = isValidEndPoint(ps.endpoint);

            const accessKeyError = isEmptyValue(ps.accessKey)
              ? "AccessKey is required"
              : "";
            const secretKeyError = isEmptyValue(ps.secretKey)
              ? "SecretKey is required"
              : "";

            return (
              <SRSiteInputRow
                key={`exiting-${index}`}
                rowData={ps}
                rowId={index}
                fieldErrors={{
                  endpoint: endPointError,
                  accessKey: accessKeyError,
                  secretKey: secretKeyError,
                }}
                onFieldChange={(e, fieldName, index) => {
                  const filedValue = e.target.value;
                  setExistingSites((prevItems) => {
                    return prevItems.map((item, ix) =>
                      ix === index
                        ? { ...item, [fieldName]: filedValue }
                        : item,
                    );
                  });
                }}
                canAdd={true}
                canRemove={index > 0 && !ps.isSaved}
                onAddClick={() => {
                  const newRows = [...existingSites];
                  //add at the next index
                  newRows.splice(index + 1, 0, {
                    name: "",
                    endpoint: "",
                    accessKey: "",
                    secretKey: "",
                  });

                  setExistingSites(newRows);
                }}
                onRemoveClick={(index) => {
                  setExistingSites(
                    existingSites.filter((_, idx) => idx !== index),
                  );
                }}
              />
            );
          })}
        </Box>
      </Box>
    );
  };

  return (
    <Fragment>
      <PageHeaderWrapper
        label={
          <BackLink
            label={"Add Replication Site"}
            onClick={() => navigate(IAM_PAGES.SITE_REPLICATION)}
          />
        }
        actions={<HelpMenu />}
      />
      <PageLayout>
        <Box
          sx={{
            display: "grid",
            padding: "25px",
            gap: "25px",
            gridTemplateColumns: "1fr",
            border: "1px solid #eaeaea",
          }}
        >
          <Box>
            <SectionTitle separator icon={<ClustersIcon />}>
              Add Sites for Replication
            </SectionTitle>

            {isSiteInfoLoading || isAdding ? <ProgressBar /> : null}

            <Box
              sx={{
                fontSize: "14px",
                fontStyle: "italic",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              Note: AccessKey and SecretKey values for every site is required
              while adding or editing peer sites
            </Box>
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                return addSiteReplication();
              }}
            >
              {renderCurrentSite()}

              {renderPeerSites()}

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                    gap: "15px",
                  }}
                >
                  <Button
                    id={"clear"}
                    type="button"
                    variant="regular"
                    disabled={isAdding}
                    onClick={resetForm}
                    label={"Clear"}
                  />

                  <Button
                    id={"save"}
                    type="submit"
                    variant="callAction"
                    disabled={isAdding || !isAllFieldsValid}
                    label={"Save"}
                  />
                </Box>
              </Grid>
            </form>
          </Box>

          <HelpBox
            title={""}
            iconComponent={null}
            help={
              <Fragment>
                <Box
                  sx={{
                    marginTop: "-25px",
                    fontSize: "16px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    padding: "2px",
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#07193E",
                      height: "15px",
                      width: "15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      marginRight: "18px",
                      padding: "3px",
                      paddingLeft: "2px",
                      "& .min-icon": {
                        height: "11px",
                        width: "11px",
                        fill: "#ffffff",
                      },
                    }}
                  >
                    <ClustersIcon />
                  </Box>
                  About Site Replication
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexFlow: "column",
                    fontSize: "14px",
                    flex: "2",
                    "& li": {
                      fontSize: "14px",
                      display: "flex",
                      marginTop: "15px",
                      marginBottom: "15px",
                      width: "100%",

                      "&.step-text": {
                        fontWeight: 400,
                      },
                    },
                  }}
                >
                  <Box>
                    The following changes are replicated to all other sites
                  </Box>
                  <ul>
                    <li>Creation and deletion of buckets and objects</li>
                    <li>
                      Creation and deletion of all IAM users, groups, policies
                      and their mappings to users or groups
                    </li>
                    <li>Creation of STS credentials</li>
                    <li>
                      Creation and deletion of service accounts (except those
                      owned by the root user)
                    </li>
                    <li>
                      <Box
                        style={{
                          display: "flex",
                          flexFlow: "column",

                          justifyContent: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            paddingTop: "1px",
                          }}
                        >
                          Changes to Bucket features such as
                        </div>
                        <ul>
                          <li>Bucket Policies</li>
                          <li>Bucket Tags</li>
                          <li>Bucket Object-Lock configurations</li>
                          <li>Bucket Encryption configuration</li>
                        </ul>
                      </Box>
                    </li>

                    <li>
                      <Box
                        style={{
                          display: "flex",
                          flexFlow: "column",

                          justifyContent: "flex-start",
                        }}
                      >
                        <div
                          style={{
                            paddingTop: "1px",
                          }}
                        >
                          The following Bucket features will NOT be replicated
                        </div>

                        <ul>
                          <li>Bucket notification configuration</li>
                          <li>Bucket lifecycle (ILM) configuration</li>
                        </ul>
                      </Box>
                    </li>
                  </ul>
                </Box>
              </Fragment>
            }
          />
        </Box>
      </PageLayout>
    </Fragment>
  );
};

export default AddReplicationSites;
