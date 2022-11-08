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
import { t } from "i18next";
import React, { Fragment, useState } from "react";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { DialogContentText, Grid } from "@mui/material";
import PageHeader from "./PageHeader/PageHeader";
import PageLayout from "./Layout/PageLayout";
import SectionTitle from "./SectionTitle";
import { Button } from "mds";
import { ConfirmDeleteIcon } from "../../../icons";
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
      <PageHeader label={t("Components")} />
      <PageLayout>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <SectionTitle>{t("Confirm Dialogs")}</SectionTitle>
          </Grid>
          <Grid item xs={12}>
            <p>{t("Used to confirm a non-idempotent action.")}</p>
          </Grid>
          <Grid item xs={12}>
            <Button
              id={"open-dialog-test"}
              type="button"
              variant={"regular"}
              onClick={() => {
                setDialogOpen(true);
              }}
              label={t("Open Dialog")}
            />

            <ConfirmDialog
              title={`${t("Delete Bucket")}`}
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
                  {t("Are you sure you want to delete bucket")}
                  <b>{t("bucket")}</b>
                  ? <br />
                  {t("A bucket can only be deleted if it's empty.")}
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
