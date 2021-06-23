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
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Button, LinearProgress } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { ObjectBrowserReducer } from "../../../../ObjectBrowser/reducers";
import { modalBasic } from "../../../../Common/FormComponents/common/styleLibrary";
import {
  resetRewind,
  setRewindEnable,
} from "../../../../ObjectBrowser/actions";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import DateTimePickerWrapper from "../../../../Common/FormComponents/DateTimePickerWrapper/DateTimePickerWrapper";
import FormSwitchWrapper from "../../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";

interface IRewindEnable {
  closeModalAndRefresh: (reload: boolean) => void;
  classes: any;
  open: boolean;
  bucketName: string;
  bucketToRewind: string;
  rewindEnabled: boolean;
  dateRewind: any;
  resetRewind: typeof resetRewind;
  setRewindEnable: typeof setRewindEnable;
}

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
  });

const RewindEnable = ({
  closeModalAndRefresh,
  classes,
  open,
  bucketName,
  bucketToRewind,
  rewindEnabled,
  dateRewind,
  resetRewind,
  setRewindEnable,
}: IRewindEnable) => {
  const [rewindEnabling, setRewindEnabling] = useState<boolean>(false);
  const [rewindEnableButton, setRewindEnableButton] = useState<boolean>(true);
  const [dateSelected, setDateSelected] = useState<any>(null);

  useEffect(() => {
    if (rewindEnabled) {
      setRewindEnableButton(true);
      setDateSelected(new Date(dateRewind));
    }
  }, [rewindEnabled, dateRewind]);

  const rewindApply = () => {
    if (!rewindEnableButton && rewindEnabled) {
      resetRewind();
    } else {
      setRewindEnabling(true);
      setRewindEnable(true, bucketName, dateSelected);
    }
    closeModalAndRefresh(true);
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh(false);
      }}
      title={`Rewind - ${bucketName}`}
    >
      <Grid item xs={12}>
        <DateTimePickerWrapper
          value={dateSelected}
          onChange={setDateSelected}
          id="rewind-selector"
          label="Rewind to"
          disabled={!rewindEnableButton}
        />
      </Grid>
      <Grid container>
        {rewindEnabled && (
          <Grid item xs={12}>
            <FormSwitchWrapper
              value="status"
              id="status"
              name="status"
              checked={rewindEnableButton}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setRewindEnableButton(false);
              }}
              label={"Current Status"}
              indicatorLabels={["Enabled", "Disabled"]}
            />
          </Grid>
        )}
        <Grid item xs={12} className={classes.buttonContainer}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            disabled={rewindEnabling || (!dateSelected && rewindEnableButton)}
            onClick={rewindApply}
          >
            {!rewindEnableButton && rewindEnabled
              ? "Show Current Data"
              : "Show Rewind Data"}
          </Button>
        </Grid>
        {rewindEnabling && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}
      </Grid>
    </ModalWrapper>
  );
};

const mapStateToProps = ({ objectBrowser }: ObjectBrowserReducer) => ({
  bucketToRewind: objectBrowser.rewind.bucketToRewind,
  rewindEnabled: objectBrowser.rewind.rewindEnabled,
  dateRewind: objectBrowser.rewind.dateToRewind,
});

const mapDispatchToProps = {
  resetRewind,
  setRewindEnable,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(styles)(connector(RewindEnable));
