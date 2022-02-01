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
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

interface IProgressBarWrapper {
  value: number;
  ready: boolean;
  indeterminate?: boolean;
  withLabel?: boolean;
  size?: string;
}

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#f1f1f1",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
  },
}));
const SmallBorderLinearProgress = styled(BorderLinearProgress)(() => ({
  height: 6,
  borderRadius: 3,
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 3,
  },
}));

function LinearProgressWithLabel(props: LinearProgressProps) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <BorderLinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35, fontSize: 14 }} className={"value"}>
        {`${Math.round(props.value || 0)}%`}
      </Box>
    </Box>
  );
}

const ProgressBarWrapper = ({
  value,
  ready,
  indeterminate,
  withLabel,
  size = "regular",
}: IProgressBarWrapper) => {
  const propsComponent: LinearProgressProps = {
    variant: indeterminate && !ready ? "indeterminate" : "determinate",
    value: ready ? 100 : value,
    color: ready ? "success" : "primary",
  };
  if (withLabel) {
    return <LinearProgressWithLabel {...propsComponent} />;
  }
  if (size === "small") {
    return <SmallBorderLinearProgress {...propsComponent} />;
  }

  return <BorderLinearProgress {...propsComponent} />;
};

export default ProgressBarWrapper;
