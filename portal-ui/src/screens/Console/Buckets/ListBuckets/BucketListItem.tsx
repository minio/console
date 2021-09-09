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
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { BucketsIcon } from "../../../../icons";
import DeleteIcon from "@material-ui/icons/Delete";
import { Bucket } from "../types";
import { niceBytes } from "../../../../common/utils";
import { IconButton, Tooltip } from "@material-ui/core";
import CheckboxWrapper from "../../Common/FormComponents/CheckboxWrapper/CheckboxWrapper";

const styles = (theme: Theme) =>
  createStyles({
    linkContainer: {
      textDecoration: "none",
      position: "relative",
      color: "initial",
      textAlign: "center",
      border: "#EAEDEE 1px solid",
      borderRadius: 3,
      padding: 15,
      backgroundColor: "#fff",
      width: 200,
      margin: 10,
      zIndex: 200,
      "&:hover": {
        backgroundColor: "#EAEAEA",
        "& .innerElement": {
          visibility: "visible",
        },
      },
      "& .innerElement": {
        visibility: "hidden",
      },
    },
    bucketName: {
      fontSize: 14,
      fontWeight: "bold",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      overflow: "hidden",
      width: "100%",
      display: "block",
    },
    bucketsIcon: {
      width: 40,
      height: 40,
      color: "#393939",
    },
    bucketSize: {
      color: "#777",
      fontSize: 10,
    },
    deleteButton: {
      position: "absolute",
      zIndex: 300,
      top: 0,
      right: 0,
    },
    checkBoxElement: {
      zIndex: 500,
      position: "absolute",
      display: "block",
      bottom: 0,
      left: 0,
    },
  });

interface IBucketListItem {
  bucket: Bucket;
  classes: any;
  onDelete: (bucketName: string) => void;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selected: boolean;
}

const BucketListItem = ({
  classes,
  bucket,
  onDelete,
  onSelect,
  selected,
}: IBucketListItem) => {
  const onDeleteClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(bucket.name);
  };

  const onCheckboxClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect(e);
  };

  return (
    <Fragment>
      <Link
        to={`/buckets/${bucket.name}/browse`}
        className={classes.linkContainer}
      >
        <Tooltip title={`Delete ${bucket.name} bucket`}>
          <IconButton
            color="secondary"
            aria-label="Delete Bucket"
            component="span"
            onClick={onDeleteClick}
            className={`innerElement ${classes.deleteButton}`}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <BucketsIcon width={40} height={40} className={classes.bucketsIcon} />
        <br />
        <Tooltip title={bucket.name}>
          <span className={classes.bucketName}>{bucket.name}</span>
        </Tooltip>
        <span className={classes.bucketSize}>
          <strong>Used Space:</strong> {niceBytes(bucket.size || "0")}
        </span>
        <span
          className={classes.checkBoxElement}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <CheckboxWrapper
            checked={selected}
            id={`select-${bucket.name}`}
            label={""}
            name={`select-${bucket.name}`}
            onChange={onCheckboxClick}
            value={bucket.name}
          />
        </span>
      </Link>
    </Fragment>
  );
};

export default withStyles(styles)(BucketListItem);
