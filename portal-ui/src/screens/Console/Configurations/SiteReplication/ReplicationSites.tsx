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

import React, { useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import { Box, Button, DialogContentText, Tooltip } from "@mui/material";
import {
  MenuCollapsedIcon,
  MenuExpandedIcon,
} from "../../../../icons/SidebarMenus";
import { ReplicationSite } from "./SiteReplication";
import RBIconButton from "../../Buckets/BucketDetails/SummaryItems/RBIconButton";
import TrashIcon from "../../../../icons/TrashIcon";
import { CircleIcon, ConfirmDeleteIcon, EditIcon } from "../../../../icons";
import ConfirmDialog from "../../Common/ModalWrapper/ConfirmDialog";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import Grid from "@mui/material/Grid";
import useApi from "../../Common/Hooks/useApi";
import { connect } from "react-redux";
import { setErrorSnackMessage, setSnackBarMessage } from "../../../../actions";
import { ErrorResponseHandler } from "../../../../common/types";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import {
  formFieldStyles,
  modalStyleUtils,
  spacingUtils,
} from "../../Common/FormComponents/common/styleLibrary";

const styles = (theme: Theme) =>
  createStyles({
    ...modalStyleUtils,
    ...formFieldStyles,
    ...spacingUtils,
  });

const ReplicationSites = ({
  sites,
  onDeleteSite,
  setErrorSnackMessage,
  setSnackBarMessage,
  onRefresh,
  classes,
}: {
  sites: ReplicationSite[];
  onDeleteSite: (isAll: boolean, sites: string[]) => void;
  setErrorSnackMessage: (err: ErrorResponseHandler) => void;
  setSnackBarMessage: (msg: string) => void;
  onRefresh: () => void;
  classes: any;
}) => {
  const [expanded, setExpanded] = React.useState<string>("");

  const [deleteSiteKey, setIsDeleteSiteKey] = useState<string>("");
  const [editSite, setEditSite] = useState<any>(null);
  const [editEndPointName, setEditEndPointName] = useState<string>("");

  const handleClick = (key: string) => {
    setExpanded(key);
  };

  const [isEditing, invokeSiteEditApi] = useApi(
    (res: any) => {
      if (res.success) {
        setEditSite(null);
        setSnackBarMessage(res.status);
      } else {
        setErrorSnackMessage({
          errorMessage: "Error",
          detailedError: res.status,
        });
      }
      onRefresh();
    },
    (err: any) => {
      setErrorSnackMessage(err);
      onRefresh();
    }
  );
  const updatePeerSite = () => {
    invokeSiteEditApi("PUT", `api/v1/admin/site-replication`, {
      endpoint: editEndPointName,
      name: editSite.name,
      deploymentId: editSite.deploymentID, // readonly
    });
  };

  const hasExpand = false; //siteInfo.isCurrent to b
  let isValidEndPointUrl = false;

  try {
    new URL(editEndPointName);
    isValidEndPointUrl = true;
  } catch (err) {
    isValidEndPointUrl = false;
  }

  return (
    <Box>
      <List
        sx={{
          width: "100%",
          flex: 1,
          padding: "0",
          marginTop: "25px",
          height: "calc( 100vh - 450px )",
          border: "1px solid #eaeaea",
          marginBottom: "25px",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        <Box
          sx={{
            fontWeight: 600,
            borderBottom: "1px solid #f1f1f1",
            padding: "25px 25px 25px 20px",
          }}
        >
          List of Replicated Sites
        </Box>
        {sites.map((siteInfo, index) => {
          const key = `${siteInfo.name}`;
          const isExpanded = expanded === siteInfo.name;

          const handleToggle = () => {
            if (!isExpanded) {
              handleClick(key);
            } else {
              handleClick("");
            }
          };
          return (
            <React.Fragment key={key}>
              <ListItemButton
                disableRipple
                className={isExpanded ? "expanded" : ""}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #f1f1f1",
                  borderLeft: "0",
                  borderRight: "0",
                  borderTop: "0",
                  padding: "6px 10px 6px 20px",
                  "&:hover": {
                    background: "#bebbbb0d",
                  },
                  "&.expanded": {
                    marginBottom: "0",
                  },
                }}
              >
                <Box
                  sx={{
                    flex: 2,
                    display: "grid",
                    gridTemplateColumns: {
                      sm: "1fr 1fr ",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    {siteInfo.name}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    {siteInfo.isCurrent ? (
                      <Tooltip title={"This site/cluster"} placement="top">
                        <Box
                          sx={{
                            "& .min-icon": {
                              height: "12px",
                              fill: "green",
                            },
                          }}
                        >
                          <CircleIcon />
                        </Box>
                      </Tooltip>
                    ) : null}
                    <Tooltip title={siteInfo.endpoint}>
                      <Box
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginLeft: siteInfo.isCurrent ? "" : "24px",
                        }}
                      >
                        {siteInfo.endpoint}
                      </Box>
                    </Tooltip>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    marginLeft: "25px",
                    marginRight: "25px",
                    width: "60px",
                    flexShrink: 0,

                    "& button": {
                      borderRadius: "50%",
                      background: "#F8F8F8",
                      border: "none",

                      "&:hover": {
                        background: "#E2E2E2",
                      },

                      "& svg": {
                        fill: "#696565",
                      },
                    },
                  }}
                >
                  <RBIconButton
                    tooltip={
                      sites.length <= 2
                        ? "Minimum two sites are required for replication"
                        : "Delete Site"
                    }
                    text={""}
                    variant="outlined"
                    color="secondary"
                    disabled={sites.length <= 2}
                    icon={<TrashIcon />}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDeleteSiteKey(key);
                    }}
                  />
                  <RBIconButton
                    tooltip={"Edit Endpoint"}
                    text={""}
                    variant="contained"
                    color="primary"
                    icon={<EditIcon />}
                    onClick={(e) => {
                      e.preventDefault();
                      setEditSite(siteInfo);
                    }}
                  />
                </Box>
                {hasExpand ? (
                  <Box
                    sx={{
                      height: "25px",
                      width: "25px",
                      background: "#FBFAFA",
                      borderRadius: "2px",
                      border: "1px solid #eaeaea",
                      "&:hover": {
                        background: "#fafafa",
                      },
                      display: {
                        md: "block",
                        xs: "none",
                      },
                      "& .collapse-icon": {
                        fill: "#494949",
                        "& g  rect": {
                          fill: "#ffffff",
                        },
                      },
                      "& .expand-icon": {
                        fill: "#494949",
                        "& rect": {
                          fill: "#ffffff",
                        },
                      },
                    }}
                    onClick={handleToggle}
                  >
                    {isExpanded ? (
                      <MenuCollapsedIcon className="collapse-icon" />
                    ) : (
                      <MenuExpandedIcon className="expand-icon" />
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: "25px",
                      width: "25px",
                    }}
                  />
                )}
              </ListItemButton>
              {isExpanded ? (
                <Box
                  key={`${siteInfo.name}`}
                  sx={{
                    border: "1px solid #f1f1f1",
                    borderLeft: "0",
                    borderRight: "0",
                    borderTop: "0",
                  }}
                >
                  <ListSubheader
                    key={`${index}-drive-details`}
                    component="div"
                    sx={{ paddingLeft: "30px" }}
                  >
                    Replication status
                  </ListSubheader>

                  <Collapse
                    in={isExpanded}
                    timeout="auto"
                    unmountOnExit
                    sx={{
                      width: "100%",
                      flex: 1,
                      display: "flex",
                      padding: { md: "15px 30px", xs: "10px 10px" },
                      "& .MuiCollapse-wrapperInner": {
                        display: "flex",
                        flexFlow: "column",
                        gap: "15px",
                      },
                    }}
                  >
                    Status info
                  </Collapse>
                </Box>
              ) : null}

              {deleteSiteKey === key ? (
                <ConfirmDialog
                  title={`Delete Replication Site`}
                  confirmText={"Delete"}
                  isOpen={true}
                  titleIcon={<ConfirmDeleteIcon />}
                  isLoading={false}
                  onConfirm={() => {
                    onDeleteSite(false, [key]);
                  }}
                  onClose={() => {
                    setIsDeleteSiteKey("");
                  }}
                  confirmationContent={
                    <DialogContentText>
                      Are you sure you want to remove the replication site:{" "}
                      {key}.?
                    </DialogContentText>
                  }
                />
              ) : null}

              {editSite?.name === key ? (
                <ModalWrapper
                  title={`Edit Replication Endpoint `}
                  modalOpen={true}
                  titleIcon={<EditIcon />}
                  onClose={() => {
                    setEditSite(null);
                  }}
                >
                  <DialogContentText>
                    <Box
                      sx={{
                        display: "flex",
                        flexFlow: "column",
                        marginBottom: "15px",
                      }}
                    >
                      <Box sx={{ marginBottom: "10px" }}>
                        <strong>Site:</strong> {"  "}
                        {editSite.name}
                      </Box>
                      <Box sx={{ marginBottom: "10px" }}>
                        <strong>Current Endpoint:</strong> {"  "}
                        {editSite.endpoint}
                      </Box>
                    </Box>

                    <Grid item xs={12}>
                      <Box sx={{ marginBottom: "5px" }}> New Endpoint:</Box>
                      <InputBoxWrapper
                        id="edit-rep-peer-endpoint"
                        name="edit-rep-peer-endpoint"
                        placeholder={"https://dr.minio-storage:9000"}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setEditEndPointName(event.target.value);
                        }}
                        label=""
                        value={editEndPointName}
                      />
                    </Grid>
                  </DialogContentText>

                  <Grid item xs={12} className={classes.modalButtonBar}>
                    <Button
                      type="button"
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setEditSite(null);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      disabled={isEditing || !isValidEndPointUrl}
                      onClick={() => {
                        updatePeerSite();
                      }}
                    >
                      Update
                    </Button>
                  </Grid>
                </ModalWrapper>
              ) : null}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

const connector = connect(null, {
  setErrorSnackMessage,
  setSnackBarMessage,
});
export default connector(withStyles(styles)(ReplicationSites));
