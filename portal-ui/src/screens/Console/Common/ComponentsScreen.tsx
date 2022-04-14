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
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Button, DialogContentText, Grid } from "@mui/material";
import PageHeader from "./PageHeader/PageHeader";
import PageLayout from "./Layout/PageLayout";
import SectionTitle from "./SectionTitle";
import RBIconButton from "../Buckets/BucketDetails/SummaryItems/RBIconButton";
import {
  ArrowIcon,
  ConfirmDeleteIcon,
  EditIcon,
  TrashIcon,
} from "../../../icons";
import ConfirmDialog from "./ModalWrapper/ConfirmDialog";

interface IComponentsScreen {
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...containerForHeader(theme.spacing(4)),
    root: {
      fontSize: 12,
      wordWrap: "break-word",
      "& .min-loader": {
        width: 45,
        height: 45,
      },
    },
    def: {},
    red: {
      "& .min-icon": {
        color: "red",
      },
    },
  });

const ComponentsScreen = ({ classes }: IComponentsScreen) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  return (
    <Fragment>
      <PageHeader label={"Components"} />
      <PageLayout>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <SectionTitle>Buttons</SectionTitle>
          </Grid>
          <Grid item xs={12}>
            <p>Buttons should always be of one of the following four types:</p>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item>
                <Button
                  type="button"
                  variant={"contained"}
                  className={classes.clearButton}
                  onClick={() => {}}
                >
                  Primary
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  onClick={() => {}}
                  disabled={true}
                >
                  Primary Disabled
                </Button>
              </Grid>
              <Grid item>
                <Button type="button" variant={"outlined"} onClick={() => {}}>
                  Generic
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="button"
                  variant={"outlined"}
                  onClick={() => {}}
                  disabled={true}
                >
                  Generic Disabled
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="button"
                  variant={"outlined"}
                  color={"secondary"}
                  onClick={() => {}}
                >
                  Dangerous
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="button"
                  variant={"outlined"}
                  color={"secondary"}
                  onClick={() => {}}
                  disabled={true}
                >
                  Dangerous Disabled
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <ul>
              <li>
                <b>Primary:</b> A call to action.
              </li>
              <li>
                <b>Generic:</b> An optional action.
              </li>
              <li>
                <b>Dangerous:</b> An irreversible action.
              </li>
            </ul>
          </Grid>
          <Grid item xs={12}>
            <SectionTitle>Icon Buttons</SectionTitle>
          </Grid>
          <Grid item xs={12}>
            <p>Icon Buttons should always be of one of the following types:</p>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item>
                <RBIconButton
                  tooltip={"Primary"}
                  onClick={() => {}}
                  text={"Primary"}
                  icon={<ArrowIcon />}
                  color={"primary"}
                  variant={"outlined"}
                />
              </Grid>
              <Grid item>
                <RBIconButton
                  tooltip={"Primary Disabled"}
                  onClick={() => {}}
                  text={"Primary Disabled"}
                  icon={<ArrowIcon />}
                  color={"primary"}
                  variant={"outlined"}
                  disabled={true}
                />
              </Grid>
              <Grid item>
                <RBIconButton
                  tooltip={"Delete Bucket"}
                  onClick={() => {}}
                  text={"Generic"}
                  icon={<EditIcon />}
                  variant={"outlined"}
                />
              </Grid>
              <Grid item>
                <RBIconButton
                  tooltip={"Delete Bucket"}
                  onClick={() => {}}
                  text={"Generic Disabled"}
                  icon={<EditIcon />}
                  variant={"outlined"}
                  disabled={true}
                />
              </Grid>
              <Grid item>
                <RBIconButton
                  tooltip={"Dangerous"}
                  onClick={() => {}}
                  text={"Dangerous"}
                  icon={<TrashIcon />}
                  color={"secondary"}
                  variant={"outlined"}
                />
              </Grid>
              <Grid item>
                <RBIconButton
                  tooltip={"Dangerous"}
                  onClick={() => {}}
                  text={"Dangerous Disabled"}
                  icon={<TrashIcon />}
                  color={"secondary"}
                  variant={"outlined"}
                  disabled={true}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <SectionTitle>Confirm Dialogs</SectionTitle>
          </Grid>
          <Grid item xs={12}>
            <p>Used to confirm a non-idempotent action.</p>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="button"
              variant={"outlined"}
              onClick={() => {
                setDialogOpen(true);
              }}
            >
              Open Dialog
            </Button>
            <ConfirmDialog
              title={`Delete Bucket`}
              confirmText={"Delete"}
              isOpen={dialogOpen}
              titleIcon={<ConfirmDeleteIcon />}
              isLoading={false}
              onConfirm={() => {
                setDialogOpen(false);
              }}
              onClose={() => {
                setDialogOpen(false);
              }}
              confirmationContent={
                <DialogContentText>
                  Are you sure you want to delete bucket <b>bucket</b>
                  ? <br />A bucket can only be deleted if it's empty.
                </DialogContentText>
              }
            />
          </Grid>
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(ComponentsScreen);
