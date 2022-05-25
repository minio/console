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
import { AddIcon, ClustersIcon, RemoveIcon } from "../../../../icons";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import Grid from "@mui/material/Grid";
import { Box, Button, LinearProgress } from "@mui/material";
import RBIconButton from "../../Buckets/BucketDetails/SummaryItems/RBIconButton";
import useApi from "../../Common/Hooks/useApi";
import { useDispatch } from "react-redux";
import PageHeader from "../../Common/PageHeader/PageHeader";
import BackLink from "../../../../common/BackLink";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";
import PageLayout from "../../Common/Layout/PageLayout";
import HelpBox from "../../../../common/HelpBox";
import history from "../../../../history";
import SectionTitle from "../../Common/SectionTitle";
import {
  setErrorSnackMessage,
  setSnackBarMessage,
} from "../../../../systemSlice";

type SiteInputRow = {
  name: string;
  endpoint: string;
};

const isValidEndPoint = (ep: string) => {
  let isValidEndPointUrl = false;

  try {
    new URL(ep);
    isValidEndPointUrl = true;
  } catch (err) {
    isValidEndPointUrl = false;
  }
  if (isValidEndPointUrl || ep === "") {
    return "";
  } else {
    return "Invalid Endpoint";
  }
};
const AddReplicationSites = () => {
  const dispatch = useDispatch();
  const [existingSites, setExistingSites] = useState<SiteInputRow[]>([]);

  const [accessKey, setAccessKey] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [siteConfig, setSiteConfig] = useState<SiteInputRow[]>([]);

  const setDefaultNewRows = () => {
    const defaultNewSites = existingSites?.length
      ? [{ endpoint: "", name: "" }]
      : [
          { endpoint: "", name: "" },
          { endpoint: "", name: "" },
        ];
    setSiteConfig(defaultNewSites);
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
        };
        siteList.splice(foundIdx, 1, curSite);
      }

      siteList.sort((x: any, y: any) => {
        return x.name === curSiteName ? -1 : y.name === curSiteName ? 1 : 0;
      });
      setExistingSites(siteList);
    },
    (err: any) => {
      setExistingSites([]);
    }
  );

  const getSites = () => {
    invokeSiteInfoApi("GET", `api/v1/admin/site-replication`);
  };

  useEffect(() => {
    getSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDefaultNewRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingSites]);

  const isAllEndpointsValid =
    siteConfig.reduce((acc: string[], cv, i) => {
      const epValue = siteConfig[i].endpoint;
      const isEpValid = isValidEndPoint(epValue);

      if (isEpValid === "" && epValue !== "") {
        acc.push(isEpValid);
      }
      return acc;
    }, []).length === siteConfig.length;

  const [isAdding, invokeSiteAddApi] = useApi(
    (res: any) => {
      if (res.success) {
        dispatch(setSnackBarMessage(res.status));
        resetForm();
        getSites();
        history.push(IAM_PAGES.SITE_REPLICATION);
      } else {
        dispatch(
          setErrorSnackMessage({
            errorMessage: "Error",
            detailedError: res.status,
          })
        );
      }
    },
    (err: any) => {
      dispatch(setErrorSnackMessage(err));
    }
  );

  const resetForm = () => {
    setAccessKey("");
    setSecretKey("");
    setDefaultNewRows();
  };

  const addSiteReplication = () => {
    const existingSitesToAdd = existingSites?.map((es, idx) => {
      return {
        accessKey: accessKey,
        secretKey: secretKey,
        name: es.name,
        endpoint: es.endpoint,
      };
    });

    const newSitesToAdd = siteConfig.reduce((acc: any, ns, idx) => {
      if (ns.endpoint) {
        acc.push({
          accessKey: accessKey,
          secretKey: secretKey,
          name: ns.name || `dr-site-${idx}`,
          endpoint: ns.endpoint,
        });
      }
      return acc;
    }, []);

    invokeSiteAddApi("POST", `api/v1/admin/site-replication`, [
      ...(existingSitesToAdd || []),
      ...(newSitesToAdd || []),
    ]);
  };

  return (
    <Fragment>
      <PageHeader
        label={
          <BackLink
            to={IAM_PAGES.SITE_REPLICATION}
            label={"Add Replication Site"}
          />
        }
      />
      <PageLayout>
        <Box
          sx={{
            display: "grid",
            padding: "25px",
            gap: "25px",
            gridTemplateColumns: {
              md: "2fr 1.2fr",
              xs: "1fr",
            },
            border: "1px solid #eaeaea",
          }}
        >
          <Box>
            <SectionTitle icon={<ClustersIcon />}>
              Add Sites for Replication
            </SectionTitle>

            {isSiteInfoLoading || isAdding ? <LinearProgress /> : null}
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                return addSiteReplication();
              }}
            >
              <Grid item xs={12} marginBottom={"15px"}>
                <Box
                  sx={{
                    fontStyle: "italic",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    marginTop: 2,
                  }}
                >
                  <Box sx={{ fontWeight: 600 }}>Note:</Box>{" "}
                  <Box sx={{ marginLeft: 1 }}>
                    Access Key and Secret Key should be same on all sites.
                  </Box>
                </Box>
              </Grid>
              <Grid
                item
                xs={12}
                marginBottom={"15px"}
                sx={{
                  "& label span": {
                    fontWeight: "normal",
                  },
                }}
              >
                <InputBoxWrapper
                  id="add-rep-peer-accKey"
                  name="add-rep-peer-accKey"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setAccessKey(event.target.value);
                  }}
                  label="Access Key"
                  required={true}
                  value={accessKey}
                  error={accessKey === "" ? "Access Key is required." : ""}
                  data-test-id={"add-site-rep-acc-key"}
                />
              </Grid>
              <Grid
                item
                xs={12}
                marginBottom={"30px"}
                sx={{
                  "& label span": {
                    fontWeight: "normal",
                  },
                }}
              >
                <InputBoxWrapper
                  id="add-rep-peer-secKey"
                  name="add-rep-peer-secKey"
                  type={"password"}
                  required={true}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSecretKey(event.target.value);
                  }}
                  error={secretKey === "" ? "Secret Key is required." : ""}
                  label="Secret Key"
                  value={secretKey}
                  data-test-id={"add-site-rep-sec-key"}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    marginBottom: "15px",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  Peer Sites
                </Box>
              </Grid>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: ".8fr 1.2fr .2fr",
                  border: "1px solid #eaeaea",
                  padding: "15px",
                  gap: "10px",
                  maxHeight: "430px",
                  overflowY: "auto",
                }}
              >
                <Box
                  sx={{
                    fontSize: "14px",
                    marginLeft: "5px",
                  }}
                >
                  Site Name
                </Box>
                <Box sx={{ fontSize: "14px", marginLeft: "5px" }}>
                  Endpoint {"*"}
                </Box>
                <Box> </Box>
                {existingSites?.map((si, index) => {
                  return (
                    <Fragment key={si.name}>
                      <Box>
                        <InputBoxWrapper
                          id={`add-rep-ex-peer-site-${index}`}
                          name={`add-rep-ex-peer-site-${index}`}
                          extraInputProps={{
                            readOnly: true,
                          }}
                          label=""
                          value={si.name}
                          onChange={() => {}}
                        />
                      </Box>
                      <Box>
                        <InputBoxWrapper
                          id={`add-rep-ex-peer-site-ep-${index}`}
                          name={`add-rep-ex-peer-site-ep-${index}`}
                          extraInputProps={{
                            readOnly: true,
                          }}
                          label=""
                          value={si.endpoint}
                          onChange={() => {}}
                        />
                      </Box>
                      <Grid item xs={12}>
                        {" "}
                      </Grid>
                    </Fragment>
                  );
                })}

                {siteConfig.map((sci, index) => {
                  let isDelDisabled = false;

                  if (existingSites?.length && index === 0) {
                    isDelDisabled = true;
                  } else if (!existingSites?.length && index < 2) {
                    isDelDisabled = true;
                  }

                  return (
                    <Fragment key={`${index}`}>
                      <Box>
                        <InputBoxWrapper
                          id={`add-rep-peer-site-${index}`}
                          name={`add-rep-peer-site-${index}`}
                          placeholder={`dr-site-${index}`}
                          label=""
                          value={`${sci.name}`}
                          onChange={(e) => {
                            const nameTxt = e.target.value;
                            setSiteConfig((prevItems) => {
                              return prevItems.map((item, ix) =>
                                ix === index ? { ...item, name: nameTxt } : item
                              );
                            });
                          }}
                          data-test-id={`add-site-rep-peer-site-${index}`}
                        />
                      </Box>
                      <Box>
                        <InputBoxWrapper
                          id={`add-rep-peer-site-ep-${index}`}
                          name={`add-rep-peer-site-ep-${index}`}
                          placeholder={`https://dr.minio-storage:900${index}`}
                          label=""
                          error={isValidEndPoint(siteConfig[index].endpoint)}
                          value={`${sci.endpoint}`}
                          onChange={(e) => {
                            const epTxt = e.target.value;
                            setSiteConfig((prevItems) => {
                              return prevItems.map((item, ix) =>
                                ix === index
                                  ? { ...item, endpoint: epTxt }
                                  : item
                              );
                            });
                          }}
                          data-test-id={`add-site-rep-peer-ep-${index}`}
                        />
                      </Box>
                      <Grid item xs={12} alignItems={"center"} display={"flex"}>
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
                          <RBIconButton
                            tooltip={"Add a Row"}
                            text={""}
                            variant="outlined"
                            color="primary"
                            icon={<AddIcon />}
                            onClick={(e) => {
                              e.preventDefault();
                              const newRows = [...siteConfig];
                              //add at the next index
                              newRows.splice(index + 1, 0, {
                                name: "",
                                endpoint: "",
                              });

                              setSiteConfig(newRows);
                            }}
                          />
                          <RBIconButton
                            tooltip={"Remove Row"}
                            text={""}
                            variant="outlined"
                            disabled={isDelDisabled}
                            color="primary"
                            icon={<RemoveIcon />}
                            onClick={(e) => {
                              e.preventDefault();
                              setSiteConfig(
                                siteConfig.filter((_, idx) => idx !== index)
                              );
                            }}
                          />
                        </Box>
                      </Grid>
                    </Fragment>
                  );
                })}
              </Box>

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
                    type="button"
                    variant="outlined"
                    color="primary"
                    disabled={isAdding}
                    onClick={resetForm}
                  >
                    Clear
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={
                      isAdding ||
                      !accessKey ||
                      !secretKey ||
                      !isAllEndpointsValid
                    }
                  >
                    Save
                  </Button>
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
                    "& .step-number": {
                      color: "#ffffff",
                      height: "25px",
                      width: "25px",
                      background: "#081C42",
                      marginRight: "10px",
                      textAlign: "center",
                      fontWeight: 600,
                      borderRadius: "50%",
                    },

                    "& .step-row": {
                      fontSize: "14px",
                      display: "flex",
                      marginTop: "15px",
                      marginBottom: "15px",

                      "&.step-text": {
                        fontWeight: 400,
                      },
                      "&:before": {
                        content: "' '",
                        height: "7px",
                        width: "7px",
                        backgroundColor: "#2781B0",
                        marginRight: "10px",
                        marginTop: "12px",
                        flexShrink: 0,
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
                      Changes to Bucket features such as
                      <ul>
                        <li>Bucket Policies</li>
                        <li>Bucket Tags</li>
                        <li>Bucket Object-Lock configurations</li>
                        <li>Bucket Encryption configuration</li>
                      </ul>
                    </li>

                    <li>
                      The following Bucket features will NOT be replicated
                      <ul>
                        <li>Bucket notification configuration</li>
                        <li>Bucket lifecycle (ILM) configuration</li>
                      </ul>
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
