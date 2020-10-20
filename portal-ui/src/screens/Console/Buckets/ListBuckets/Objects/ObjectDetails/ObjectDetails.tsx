import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import * as reactMoment from "react-moment";
import clsx from "clsx";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import ShareFile from "./ShareFile";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../../../Common/FormComponents/common/styleLibrary";
import PageHeader from "../../../../Common/PageHeader/PageHeader";
import ShareIcon from "../../../../../../icons/ShareIcon";
import DownloadIcon from "../../../../../../icons/DownloadIcon";
import DeleteIcon from "../../../../../../icons/DeleteIcon";
import TableWrapper from "../../../../Common/TableWrapper/TableWrapper";
import PencilIcon from "../../../../Common/TableWrapper/TableActionIcons/PencilIcon";
import SetRetention from "./SetRetention";
import BrowserBreadcrumbs from "../../../../ObjectBrowser/BrowserBreadcrumbs";
import { Button, Input } from "@material-ui/core";
import { CreateIcon } from "../../../../../../icons";
import UploadFile from "../../../../../../icons/UploadFile";
import { connect } from "react-redux";
import api from "../../../../../../common/api";
import { ObjectBrowserState, Route } from "../../../../ObjectBrowser/reducers";
import get from "lodash/get";

const styles = (theme: Theme) =>
  createStyles({
    objectNameContainer: {
      marginBottom: 8,
    },
    objectPathContainer: {
      marginBottom: 26,
      fontSize: 10,
    },
    objectPathLink: {
      "&:visited": {
        color: "#000",
      },
    },
    objectName: {
      fontSize: 24,
    },
    propertiesContainer: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 15,
    },
    propertiesItem: {
      display: "flex",
      flexDirection: "row",
      marginRight: 21,
    },
    propertiesItemBold: {
      fontWeight: 700,
    },
    propertiesValue: {
      marginLeft: 8,
      textTransform: "capitalize",
    },
    propertiesIcon: {
      marginLeft: 5,
    },
    actionsIconContainer: {
      marginLeft: 12,
    },
    actionsIcon: {
      height: 16,
      width: 16,
      "& .MuiSvgIcon-root": {
        height: 16,
      },
    },
    tagsContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },
    tagText: {
      marginRight: 13,
    },
    tag: {
      marginRight: 6,
      fontSize: 10,
      fontWeight: 700,
      "&.MuiChip-sizeSmall": {
        height: 18,
      },
      "& .MuiSvgIcon-root": {
        height: 10,
        width: 10,
      },
    },
    search: {
      marginBottom: 8,
      "&.MuiFormControl-root": {
        marginRight: 0,
      },
    },
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

interface IObjectDetailsProps {
  classes: any;
  routesList: Route[];
}

interface IFileInfo {
  is_latest?: boolean;
  last_modified: string;
  legal_hold_status?: string;
  name: string;
  retention_mode?: string;
  retention_until_date?: string;
  size?: string;
  tags?: object;
  version_id: string;
}

const emptyFile: IFileInfo = {
  is_latest: true,
  last_modified: "",
  legal_hold_status: "",
  name: "",
  retention_mode: "",
  retention_until_date: "",
  size: "0",
  tags: {},
  version_id: "",
};

const ObjectDetails = ({ classes, routesList }: IObjectDetailsProps) => {
  const [shareFileModalOpen, setShareFileModalOpen] = useState<boolean>(false);
  const [retentionModalOpen, setRetentionModalOpen] = useState<boolean>(false);
  const [actualInfo, setActualInfo] = useState<IFileInfo>(emptyFile);
  const [versions, setVersions] = useState<IFileInfo[]>([]);
  const [filterVersion, setFilterVersion] = useState<string>("");
  const [error, setError] = useState<string>("");

  const currentItem = routesList[routesList.length - 1];
  const allPathData = currentItem.route.split("/");
  const objectName = allPathData[allPathData.length - 1];
  const bucketName = allPathData[2];
  const pathInBucket = allPathData.slice(3).join("/");

  useEffect(() => {
    api
      .invoke(
        "GET",
        `/api/v1/buckets/${bucketName}/objects?prefix=${pathInBucket}&with_versions=true`
      )
      .then((res: IFileInfo[]) => {
        const result = get(res, "objects", []);
        setActualInfo(
          result.find((el: IFileInfo) => el.is_latest) || emptyFile
        );
        setVersions(result.filter((el: IFileInfo) => !el.is_latest));
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const openRetentionModal = () => {
    setRetentionModalOpen(true);
    console.log("open retention modal");
  };

  const closeRetentionModal = () => {
    setRetentionModalOpen(false);
    console.log("close retention modal");
  };

  const shareObject = () => {
    setShareFileModalOpen(true);
    console.log("share object");
  };

  const closeShareModal = () => {
    setShareFileModalOpen(false);
    console.log("close share modal");
  };

  const deleteTag = () => {
    console.log("delete tag");
  };

  const downloadObject = () => {
    console.log("download object");
  };

  const confirmDeleteObject = () => {
    console.log("confirm delete object");
  };

  const tableActions = [
    { type: "share", onClick: shareObject, sendOnlyId: true },
    { type: "download", onClick: downloadObject, sendOnlyId: true },
  ];

  const filteredRecords = versions.filter((version) =>
    version.version_id.includes(filterVersion)
  );

  const displayParsedDate = (date: string) => {
    return <reactMoment.default>{date}</reactMoment.default>;
  };

  return (
    <React.Fragment>
      <PageHeader label={"Object Browser"} />
      {shareFileModalOpen && (
        <ShareFile
          open={shareFileModalOpen}
          closeModalAndRefresh={closeShareModal}
        />
      )}
      {retentionModalOpen && (
        <SetRetention
          open={retentionModalOpen}
          closeModalAndRefresh={closeRetentionModal}
          objectName={objectName}
        />
      )}
      <Grid container>
        <Grid item xs={12} className={classes.container}>
          <Grid item xs={12} className={classes.obTitleSection}>
            <div>
              <BrowserBreadcrumbs />
            </div>
          </Grid>
          <br />
          <Grid item xs={12} className={classes.propertiesContainer}>
            <div className={classes.propertiesItem}>
              <div>
                <span className={classes.propertiesItemBold}>Legal Hold:</span>
                <span className={classes.propertiesValue}>
                  {actualInfo.legal_hold_status
                    ? actualInfo.legal_hold_status.toLowerCase()
                    : "Off"}
                </span>
              </div>
              <div>
                <IconButton
                  color="primary"
                  aria-label="legal-hold"
                  size="small"
                  className={classes.propertiesIcon}
                  onClick={() => {
                    console.log("open legal hold modal");
                  }}
                >
                  <PencilIcon active={true} />
                </IconButton>
              </div>
            </div>
            <div className={classes.propertiesItem}>
              <div>
                <span className={classes.propertiesItemBold}>Retention:</span>
                <span className={classes.propertiesValue}>
                  {actualInfo.retention_mode
                    ? actualInfo.retention_mode.toLowerCase()
                    : "Undefined"}
                </span>
              </div>
              <div>
                <IconButton
                  color="primary"
                  aria-label="retention"
                  size="small"
                  className={classes.propertiesIcon}
                  onClick={() => {
                    openRetentionModal();
                  }}
                >
                  <PencilIcon active={true} />
                </IconButton>
              </div>
            </div>
            <div className={classes.propertiesItem}>
              <div className={classes.propertiesItemBold}>File Actions:</div>
              <div className={classes.actionsIconContainer}>
                <IconButton
                  color="primary"
                  aria-label="share"
                  size="small"
                  className={classes.actionsIcon}
                  onClick={() => {
                    shareObject();
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </div>
              <div className={classes.actionsIconContainer}>
                <IconButton
                  color="primary"
                  aria-label="download/upload"
                  size="small"
                  className={classes.actionsIcon}
                  onClick={() => {
                    console.log("download/upload");
                  }}
                >
                  <DownloadIcon />
                </IconButton>
              </div>
              <div className={classes.actionsIconContainer}>
                <IconButton
                  color="primary"
                  aria-label="delete"
                  size="small"
                  className={classes.actionsIcon}
                  onClick={() => {
                    console.log("delete");
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} className={classes.tagsContainer}>
            <div className={classes.tagText}>Tags:</div>
            {actualInfo.tags &&
              Object.keys(actualInfo.tags).map((itemKey, index) => {
                const tag = get(actualInfo, `tags.${itemKey}`, "");
                if (tag !== "") {
                  return (
                    <Chip
                      key={`chip-${index}`}
                      className={classes.tag}
                      size="small"
                      label={tag}
                      color="primary"
                      deleteIcon={<CloseIcon />}
                      onDelete={deleteTag}
                    />
                  );
                }
                return null;
              })}
            <Chip
              className={classes.tag}
              icon={<AddIcon />}
              clickable
              size="small"
              label="Add tag"
              color="primary"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} className={classes.actionsTray}>
            <TextField
              placeholder={`Search ${objectName}`}
              className={clsx(classes.search, classes.searchField)}
              id="search-resource"
              label=""
              onChange={(val) => {
                setFilterVersion(val.target.value);
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
          </Grid>
          <Grid item xs={12}>
            <TableWrapper
              itemActions={tableActions}
              columns={[
                { label: "Version ID", elementKey: "version_id" },
                {
                  label: "Last Modified",
                  elementKey: "last_modified",
                  renderFunction: displayParsedDate,
                },
              ]}
              isLoading={false}
              entityName="Versions"
              idField="version_id"
              records={filteredRecords}
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(ObjectDetails);
