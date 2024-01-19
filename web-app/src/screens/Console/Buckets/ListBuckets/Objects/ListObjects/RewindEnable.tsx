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
import { DateTime } from "luxon";
import {
  Button,
  DateTimeInput,
  FormLayout,
  Grid,
  ProgressBar,
  Switch,
} from "mds";
import { useSelector } from "react-redux";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import { AppState, useAppDispatch } from "../../../../../../store";
import {
  resetRewind,
  setReloadObjectsList,
  setRewindEnable,
} from "../../../../ObjectBrowser/objectBrowserSlice";
import { modalStyleUtils } from "../../../../Common/FormComponents/common/styleLibrary";

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
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled,
  );
  const dateRewind = useSelector(
    (state: AppState) => state.objectBrowser.rewind.dateToRewind,
  );

  const [rewindEnabling, setRewindEnabling] = useState<boolean>(false);
  const [rewindEnableButton, setRewindEnableButton] = useState<boolean>(true);
  const [dateSelected, setDateSelected] = useState<DateTime>(
    DateTime.fromJSDate(new Date()),
  );

  useEffect(() => {
    if (rewindEnabled) {
      setRewindEnableButton(true);
      setDateSelected(
        DateTime.fromISO(dateRewind || DateTime.now().toISO() || ""),
      );
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
          dateRewind: dateSelected.toISO(),
        }),
      );
    }
    dispatch(setReloadObjectsList(true));

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
      <FormLayout withBorders={false} containerPadding={false}>
        <DateTimeInput
          value={dateSelected}
          onChange={(dateTime) => (dateTime ? setDateSelected(dateTime) : null)}
          id="rewind-selector"
          label="Rewind to"
          timeFormat={"24h"}
          secondsSelector={false}
          disabled={!rewindEnableButton}
        />

        {rewindEnabled && (
          <Switch
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
        )}
        <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
          <Button
            type="button"
            variant="callAction"
            disabled={rewindEnabling || (!dateSelected && rewindEnableButton)}
            onClick={rewindApply}
            id={"rewind-apply-button"}
            label={
              !rewindEnableButton && rewindEnabled
                ? "Show Current Data"
                : "Show Rewind Data"
            }
          />
        </Grid>

        {rewindEnabling && (
          <Grid item xs={12}>
            <ProgressBar />
          </Grid>
        )}
      </FormLayout>
    </ModalWrapper>
  );
};

export default RewindEnable;
