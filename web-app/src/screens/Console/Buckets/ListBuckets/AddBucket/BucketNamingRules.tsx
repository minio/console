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

import React, { Fragment, useState } from "react";
import { Grid, ExpandOptionsButton, ProgressBar } from "mds";

import { AppState } from "../../../../../store";
import { useSelector } from "react-redux";
import ValidRule from "./ValidRule";
import InvalidRule from "./InvalidRule";
import NARule from "./NARule";

const BucketNamingRules = ({ errorList }: { errorList: boolean[] }) => {
  const lengthRuleText =
    "Bucket names must be between 3 (min) and 63 (max) characters long.";
  const characterRuleText =
    "Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphens (-).";
  const periodRuleText =
    "Bucket names must not contain two adjacent periods, or a period adjacent to a hyphen.";
  const ipRuleText =
    "Bucket names must not be formatted as an IP address (for example, 192.168.5.4).";
  const prefixRuleText = "Bucket names must not start with the prefix xn--.";
  const suffixRuleText =
    "Bucket names must not end with the suffix -s3alias. This suffix is reserved for access point alias names.";
  const uniqueRuleText = "Bucket names must be unique within a partition.";

  const bucketName = useSelector((state: AppState) => state.addBucket.name);

  const [showNamingRules, setShowNamingRules] = useState<boolean>(false);

  const addLoading = useSelector((state: AppState) => state.addBucket.loading);

  const [
    lengthRule,
    validCharacters,
    noAdjacentPeriods,
    notIPFormat,
    noPrefix,
    noSuffix,
    uniqueName,
  ] = errorList;

  const toggleNamingRules = () => {
    setShowNamingRules(!showNamingRules);
  };

  return (
    <Fragment>
      <ExpandOptionsButton
        id={"toggle-naming-rules"}
        type="button"
        open={showNamingRules}
        label={`${showNamingRules ? "Hide" : "View"} Bucket Naming Rules`}
        onClick={() => {
          toggleNamingRules();
        }}
      />
      {showNamingRules && (
        <Grid container sx={{ fontSize: 14, paddingTop: 12 }}>
          <Grid item xs={6}>
            {bucketName.length === 0 ? (
              <NARule ruleText={lengthRuleText} />
            ) : lengthRule ? (
              <ValidRule ruleText={lengthRuleText} />
            ) : (
              <InvalidRule ruleText={lengthRuleText} />
            )}
            {bucketName.length === 0 ? (
              <NARule ruleText={characterRuleText} />
            ) : validCharacters ? (
              <ValidRule ruleText={characterRuleText} />
            ) : (
              <InvalidRule ruleText={characterRuleText} />
            )}
            {bucketName.length === 0 ? (
              <NARule ruleText={periodRuleText} />
            ) : noAdjacentPeriods ? (
              <ValidRule ruleText={periodRuleText} />
            ) : (
              <InvalidRule ruleText={periodRuleText} />
            )}
            {bucketName.length === 0 ? (
              <NARule ruleText={ipRuleText} />
            ) : notIPFormat ? (
              <ValidRule ruleText={ipRuleText} />
            ) : (
              <InvalidRule ruleText={ipRuleText} />
            )}
          </Grid>
          <Grid item xs={6}>
            {bucketName.length === 0 ? (
              <NARule ruleText={prefixRuleText} />
            ) : noPrefix ? (
              <ValidRule ruleText={prefixRuleText} />
            ) : (
              <InvalidRule ruleText={prefixRuleText} />
            )}

            {bucketName.length === 0 ? (
              <NARule ruleText={suffixRuleText} />
            ) : noSuffix ? (
              <ValidRule ruleText={suffixRuleText} />
            ) : (
              <InvalidRule ruleText={suffixRuleText} />
            )}

            {bucketName.length === 0 ? (
              <NARule ruleText={uniqueRuleText} />
            ) : uniqueName ? (
              <ValidRule ruleText={uniqueRuleText} />
            ) : (
              <InvalidRule ruleText={uniqueRuleText} />
            )}
          </Grid>
        </Grid>
      )}

      {addLoading && (
        <Grid item xs={12}>
          <ProgressBar />
        </Grid>
      )}
    </Fragment>
  );
};

export default BucketNamingRules;
