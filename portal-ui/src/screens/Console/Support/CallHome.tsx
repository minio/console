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

import React, { Fragment, useState } from "react";
import PageHeader from "../Common/PageHeader/PageHeader";
import PageLayout from "../Common/Layout/PageLayout";
import { Box, Button } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import HelpBox from "../../../common/HelpBox";
import { CallHomeMenuIcon, InspectMenuIcon } from "../../../icons/SidebarMenus";

const useStyles = makeStyles((theme: Theme) => ({
  ...containerForHeader(theme.spacing(4)),
}));

const CallHome = () => {
  const classes = useStyles();

  const [currentStatus, setCurrentStatus] = useState<boolean>(false);

  return (
    <Fragment>
      <PageHeader label="Call Home" />
      <PageLayout>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            border: "1px solid #eaeaea",
            padding: {
              lg: "40px",
              xs: "15px",
            },
            flexWrap: "wrap",
            gap: {
              lg: "55px",
              xs: "20px",
            },
            height: {
              md: "calc(100vh - 120px)",
              xs: "100%",
            },
            flexFlow: {
              lg: "row",
              xs: "column",
            },
          }}
        >
          <Box
            sx={{
              border: "1px solid #eaeaea",
              flex: {
                md: 2,
                xs: 1,
              },
              width: {
                lg: "auto",
                xs: "100%",
              },
              padding: {
                lg: "40px",
                xs: "15px",
              },
            }}
          >
            <Box>Current Status: {currentStatus ? "Enabled" : "Disabled"}</Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                marginTop: "55px",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                data-test-id="call-home-toggle-button"
              >
                {currentStatus ? "Disable" : "Enable"}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              minWidth: {
                md: "365px",
                xs: "100%",
              },
              width: "100%",
            }}
          >
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
                        "& .min-icon": {
                          height: "11px",
                          width: "11px",
                          fill: "#ffffff",
                        },
                      }}
                    >
                      <CallHomeMenuIcon />
                    </Box>
                    Learn more about Call Home
                  </Box>

                  <Box
                    sx={{
                      marginTop: "16px",
                      fontWeight: 600,
                      fontStyle: "italic",
                      fontSize: "14px",
                    }}
                  >
                    Examples:
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
                          marginTop: "7px",
                          flexShrink: 0,
                        },
                      },

                      "& .code-block-container": {
                        flex: "1",
                        marginTop: "15px",
                        marginLeft: "35px",

                        "& input": {
                          color: "#737373",
                        },
                      },

                      "& .example-code-block label": {
                        display: "inline-block",
                        width: {
                          sm: "160px",
                          xs: "100%",
                        },
                        fontWeight: 600,
                        fontSize: "14px",
                      },

                      "& code": {
                        width: {
                          sm: "100px",
                          xs: "100%",
                        },
                        paddingLeft: "10px",
                        fontFamily: "monospace",
                        paddingRight: "10px",
                        paddingTop: "3px",
                        paddingBottom: "3px",
                        borderRadius: "2px",
                        border: "1px solid #eaeaea",
                        fontSize: "10px",
                        color: "#082146",
                        fontWeight: 500,
                      },
                      "& .spacer": {
                        marginBottom: "5px",
                      },
                    }}
                  >
                    <Box>
                      <Box className="step-row">
                        <div className="step-text">
                          To Download 'xl.meta' for a specific object from all
                          the drives in a zip file:
                        </div>
                      </Box>


                    </Box>

                    <Box>
                      <Box className="step-row">
                        <div className="step-text">
                          To Download all constituent parts for a specific
                          object, and optionally encrypt the downloaded zip:
                        </div>
                      </Box>


                    </Box>
                    <Box>
                      <Box className="step-row">
                        <div className="step-text">
                          To Download recursively all objects at a prefix.
                          <br />
                          NOTE: This can be an expensive operation use it with
                          caution.
                        </div>
                      </Box>

                    </Box>
                  </Box>

                  <Box
                    sx={{
                      marginTop: "30px",
                      marginLeft: "15px",
                      fontSize: "14px",
                    }}
                  >
                    You can learn more at our{" "}
                    <a
                      href="https://github.com/minio/minio/tree/master/docs/debugging?ref=con"
                      target="_blank"
                      rel="noreferrer"
                    >
                      documentation
                    </a>
                    .
                  </Box>
                </Fragment>
              }
            />
          </Box>
        </Box>
      </PageLayout>
    </Fragment>
  );
};

export default CallHome;
