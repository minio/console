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

import React from "react";
import { ProgressBar, ProgressBarProps } from "mds";

interface IProgressBarWrapper {
  value: number;
  ready: boolean;
  indeterminate?: boolean;
  withLabel?: boolean;
  size?: string;
  error?: boolean;
  cancelled?: boolean;
  notificationLabel?: string;
}

function LinearProgressWithLabel(
  props: { error: boolean; cancelled: boolean } & ProgressBarProps,
) {
  let label = "";

  if (props.error) {
    label = `Error: ${props.notificationLabel || ""}`;
  } else if (props.cancelled) {
    label = `Cancelled`;
  }

  return (
    <ProgressBar
      variant={"determinate"}
      value={props.value}
      color={props.color}
      progressLabel
      notificationLabel={label}
    />
  );
}

const ProgressBarWrapper = ({
  value,
  ready,
  indeterminate,
  withLabel,
  size = "regular",
  error,
  cancelled,
  notificationLabel,
}: IProgressBarWrapper) => {
  let color: any;
  if (error) {
    color = "red";
  } else if (cancelled) {
    color = "orange";
  } else if (value === 100 && ready) {
    color = "green";
  } else {
    color = "blue";
  }
  const propsComponent: ProgressBarProps = {
    variant:
      indeterminate && !ready && !cancelled ? "indeterminate" : "determinate",
    value: ready && !error ? 100 : value,
    color: color,
    notificationLabel: notificationLabel || "",
  };
  if (withLabel) {
    return (
      <LinearProgressWithLabel
        {...propsComponent}
        error={!!error}
        cancelled={!!cancelled}
      />
    );
  }
  if (size === "small") {
    return (
      <ProgressBar {...propsComponent} sx={{ height: 6, borderRadius: 6 }} />
    );
  }

  return <ProgressBar {...propsComponent} />;
};

export default ProgressBarWrapper;
