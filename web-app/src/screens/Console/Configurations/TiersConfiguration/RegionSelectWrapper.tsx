// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import React, { useState } from "react";
import { Autocomplete, InputBox, SelectorType } from "mds";

import s3Regions from "./s3-regions";
import gcsRegions from "./gcs-regions";
import azRegions from "./azure-regions";

const getRegions = (type: string): any => {
  let regions: SelectorType[] = [];

  if (type === "s3") {
    regions = s3Regions;
  }
  if (type === "gcs") {
    regions = gcsRegions;
  }
  if (type === "azure") {
    regions = azRegions;
  }

  return regions.map((item) => ({
    value: item.value,
    label: `${item.label} - ${item.value}`,
  }));
};

interface RegionSelectBoxProps {
  label: string;
  onChange: (value: string) => void;
  value?: string | boolean;
  id: string;
  disabled?: boolean;
  type: "minio" | "s3" | "gcs" | "azure";
  tooltip?: string;
  required?: boolean;
  placeholder?: string;
}

const RegionSelectWrapper = ({
  label,
  onChange,
  type,
  tooltip = "",
  required = false,
  disabled,
  placeholder,
}: RegionSelectBoxProps) => {
  const regionList = getRegions(type);
  const [value, setValue] = useState<string>("");

  if (type === "minio") {
    return (
      <InputBox
        label={label}
        disabled={disabled}
        required={required}
        tooltip={tooltip}
        value={value}
        placeholder={placeholder}
        id={"region-list"}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
      />
    );
  }

  return (
    <Autocomplete
      label={label}
      disabled={disabled}
      required={required}
      tooltip={tooltip}
      options={regionList}
      value={value}
      placeholder={placeholder}
      id={"region-list"}
      onChange={(newValue) => {
        setValue(newValue);
        onChange(newValue);
      }}
    />
  );
};

export default RegionSelectWrapper;
