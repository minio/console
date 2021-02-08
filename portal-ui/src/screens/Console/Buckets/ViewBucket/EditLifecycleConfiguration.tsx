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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { Button, LinearProgress } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import { setModalErrorSnackMessage } from "../../../../actions";
import api from "../../../../common/api";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import QueryMultiSelector from "../../Common/FormComponents/QueryMultiSelector/QueryMultiSelector";
import { LifeCycleItem } from "../types";

const styles = (theme: Theme) =>
  createStyles({
    strongText: {
      fontWeight: 700,
    },
    keyName: {
      marginLeft: 5,
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
  });

interface IAddUserContentProps {
  classes: any;
  closeModalAndRefresh: (reload: boolean) => void;
  selectedBucket: string;
  lifecycle: LifeCycleItem;
  open: boolean;
  setModalErrorSnackMessage: typeof setModalErrorSnackMessage;
}

const EditLifecycleConfiguration = ({
  classes,
  closeModalAndRefresh,
  selectedBucket,
  lifecycle,
  open,
  setModalErrorSnackMessage,
}: IAddUserContentProps) => {
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [tags, setTags] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (lifecycle.status === "Enabled") {
      setEnabled(true);
    }

    if (lifecycle.tags) {
      const tgs = lifecycle.tags.reduce(
        (stringLab: string, currItem: any, index: number) => {
          return `${stringLab}${index !== 0 ? "&" : ""}${currItem.key}=${
            currItem.value
          }`;
        },
        ""
      );

      setTags(tgs);
    }
  }, [lifecycle]);

  const saveRecord = (event: React.FormEvent) => {
    event.preventDefault();

    if (addLoading) {
      return;
    }
    setAddLoading(true);
    if (selectedBucket !== null && lifecycle !== null) {
      api
        .invoke(
          "PUT",
          `/api/v1/buckets/${selectedBucket}/lifecycle/${lifecycle.id}`,
          {
            disable: !enabled,
            tags: tags,
          }
        )
        .then((res) => {
          setAddLoading(false);
          closeModalAndRefresh(true);
        })
        .catch((err) => {
          setAddLoading(false);
          setModalErrorSnackMessage(err);
        });
    }
  };

  return (
    <ModalWrapper
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      modalOpen={open}
      title={"Edit Lifecycle Configuration"}
    >
      <div className={classes.floatingEnabled}>
        <FormSwitchWrapper
          indicatorLabels={["Enabled", "Disabled"]}
          checked={enabled}
          value={"user_enabled"}
          id="user-status"
          name="user-status"
          onChange={(e) => {
            setEnabled(e.target.checked);
          }}
          switchOnly
        />
      </div>

      <React.Fragment>
        <form
          noValidate
          autoComplete="off"
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            saveRecord(e);
          }}
        >
          <Grid container>
            <Grid item xs={12} className={classes.formScrollable}>
              <Grid item xs={12}>
                <InputBoxWrapper
                  id="id"
                  name="id"
                  label="Id"
                  value={lifecycle.id}
                  onChange={() => {}}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <QueryMultiSelector
                  name="tags"
                  label="Tags"
                  elements={tags}
                  onChange={(vl: string) => {
                    setTags(vl);
                  }}
                  keyPlaceholder="Tag Key"
                  valuePlaceholder="Tag Value"
                  withBorder
                />
              </Grid>
            </Grid>
            <Grid item xs={12} className={classes.buttonContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={addLoading}
              >
                Save
              </Button>
            </Grid>
            {addLoading && (
              <Grid item xs={12}>
                <LinearProgress />
              </Grid>
            )}
          </Grid>
        </form>
      </React.Fragment>
    </ModalWrapper>
  );
};

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);

export default withStyles(styles)(connector(EditLifecycleConfiguration));
