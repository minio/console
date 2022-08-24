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

import React, { Fragment, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Button, LinearProgress } from "@mui/material";
import { AppState, useAppDispatch } from "../../../../../store";
import { useSelector } from "react-redux";
import api from "../../../../../common/api";
import ShowTextIcon from "../../../../../icons/ShowTextIcon";
import HideTextIcon from "../../../../../icons/HideTextIcon";
import { setErrorSnackMessage } from "../../../../../systemSlice";
import { ErrorResponseHandler } from "../../../../../common/types";
import { BucketList } from "../../types";
import ValidRule from "./ValidRule";
import InvalidRule from "./InvalidRule";
import NARule from "./NARule";

const BucketNamingRules = () => {
  const dispatch = useAppDispatch();

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

  const validBucketCharacters = new RegExp(`^$|[a-z0-9.-]$`);
  const ipAddressFormat = new RegExp(
    "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(.|$)){4}$"
  );
  const bucketName = useSelector((state: AppState) => state.addBucket.name);

  const [records, setRecords] = useState<string[]>([]);
  const [showNamingRules, setShowNamingRules] = useState<boolean>(false);
  const [lengthRule, setLengthRule] = useState<boolean>(false);
  const [validCharacters, setValidCharacters] = useState<boolean>(true);
  const [notIPFormat, setNotIPFormat] = useState<boolean>(false);
  const [noPrefix, setNoPrefix] = useState<boolean>(true);
  const [noSuffix, setNoSuffix] = useState<boolean>(true);
  const [uniqueName, setUniqueName] = useState<boolean>(true);
  const [noAdjacentPeriods, setNoAdjacentPeriods] = useState<boolean>(true);
  const addLoading = useSelector((state: AppState) => state.addBucket.loading);

  useEffect(() => {
    const fetchRecords = () => {
      api
        .invoke("GET", `/api/v1/buckets`)
        .then((res: BucketList) => {
          var bucketList: string[] = [];
          res.buckets.forEach((bucket) => {
            bucketList.push(bucket.name);
          });
          setRecords(bucketList);
        })
        .catch((err: ErrorResponseHandler) => {
          dispatch(setErrorSnackMessage(err));
        });
    };
    fetchRecords();
  }, [dispatch]);

  useEffect(() => {
    setValidCharacters(validBucketCharacters.test(bucketName));
    setNotIPFormat(!ipAddressFormat.test(bucketName));
    setNoAdjacentPeriods(
      !(
        bucketName.includes(".-") ||
        bucketName.includes("-.") ||
        bucketName.includes("..")
      )
    );
    setNoPrefix(!bucketName.startsWith("xn--"));
    setNoSuffix(!bucketName.endsWith("-s3alias"));
    setLengthRule(!(bucketName.length < 3 || bucketName.length > 63));
    setUniqueName(!records.includes(bucketName));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucketName]);

  return (
    <Fragment>
      <Grid item xs={12}>
        {showNamingRules ? (
          <span style={{ color: "#0288D1", textDecoration: "underline" }}>
            {" "}
            Hide Bucket Naming Rules{" "}
          </span>
        ) : (
          <span style={{ color: "#0288D1", textDecoration: "underline" }}>
            View Bucket Naming Rules
          </span>
        )}
        <Button
          variant="text"
          size="small"
          onClick={() => {
            setShowNamingRules(!showNamingRules);
          }}
        >
          {showNamingRules ? <ShowTextIcon /> : <HideTextIcon />}
        </Button>
        {showNamingRules && (
          <Grid container>
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
      </Grid>
      {addLoading && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}
    </Fragment>
  );
};

export default BucketNamingRules;
