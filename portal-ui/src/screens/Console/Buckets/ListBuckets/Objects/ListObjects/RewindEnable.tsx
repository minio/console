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
import { useSelector } from "react-redux";
import { Button, LinearProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import DateTimePickerWrapper from "../../../../Common/FormComponents/DateTimePickerWrapper/DateTimePickerWrapper";
import FormSwitchWrapper from "../../../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import { AppState, useAppDispatch } from "../../../../../../store";
import {
  resetRewind,
  setRewindEnable,
} from "../../../../ObjectBrowser/objectBrowserSlice";

interface IRewindEnable {
  closeModalAndRefresh: () => void;
  open: boolean;
  bucketName: string;
}

const RewindEnable = ({
  closeModalAndRefresh,
  open,
  bucketName,
}: IRewindEnable) => {
  const dispatch = useAppDispatch();

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled
  );
  const dateRewind = useSelector(
    (state: AppState) => state.objectBrowser.rewind.dateToRewind
  );

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
      dispatch(resetRewind());
    } else {
      setRewindEnabling(true);
      dispatch(
        setRewindEnable({
          state: true,
          bucket: bucketName,
          dateRewind: dateSelected,
        })
      );
    }
    closeModalAndRefresh();
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
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
                setRewindEnableButton(e.target.checked);
              }}
              label={"Current Status"}
              indicatorLabels={["Enabled", "Disabled"]}
            />
          </Grid>
        )}
        <Grid item xs={12} style={{ textAlign: "right" }}>
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

export default RewindEnable;
