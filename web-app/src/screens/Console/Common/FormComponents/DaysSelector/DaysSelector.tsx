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
import { Box, InputBox, InputLabel, LinkIcon } from "mds";

const DAY_SECONDS = 86400;
const HOUR_SECONDS = 3600;
const HOUR_MINUTES = 60;

interface IDaysSelector {
  id: string;
  maxSeconds: number;
  label: string;
  entity: string;
  onChange: (newDate: string, isValid: boolean) => void;
}

const calculateNewTime = (days: number, hours: number, minutes: number) => {
  return DateTime.now()
    .plus({
      hours: hours + days * 24,
      minutes,
    })
    .toISO(); // Lump days into hours to avoid daylight savings causing issues
};

const DaysSelector = ({
  id,
  label,
  maxSeconds,
  entity,
  onChange,
}: IDaysSelector) => {
  const maxDays = Math.floor(maxSeconds / DAY_SECONDS);
  const maxHours = Math.floor((maxSeconds % DAY_SECONDS) / HOUR_SECONDS);
  const maxMinutes = Math.floor((maxSeconds % HOUR_SECONDS) / HOUR_MINUTES);

  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [selectedHours, setSelectedHours] = useState<number>(0);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(0);
  const [validDate, setValidDate] = useState<boolean>(true);
  const [dateSelected, setDateSelected] = useState<string | null>(null);

  // Set initial values
  useEffect(() => {
    setSelectedDays(maxDays);
    setSelectedHours(maxHours);
    setSelectedMinutes(maxMinutes);
  }, [maxDays, maxHours, maxMinutes]);

  useEffect(() => {
    if (
      !isNaN(selectedHours) &&
      !isNaN(selectedDays) &&
      !isNaN(selectedMinutes)
    ) {
      setDateSelected(
        calculateNewTime(selectedDays, selectedHours, selectedMinutes),
      );
    }
  }, [selectedDays, selectedHours, selectedMinutes]);

  useEffect(() => {
    if (validDate && dateSelected) {
      const formattedDate = DateTime.fromISO(dateSelected).toFormat(
        "yyyy-MM-dd HH:mm:ss",
      );
      onChange(formattedDate.split(" ").join("T"), true);
    } else {
      onChange("0000-00-00", false);
    }
  }, [dateSelected, onChange, validDate]);

  // Basic validation for inputs
  useEffect(() => {
    let valid = true;

    if (
      selectedDays < 0 ||
      selectedDays > 7 ||
      selectedDays > maxDays ||
      isNaN(selectedDays)
    ) {
      valid = false;
    }

    if (selectedHours < 0 || selectedHours > 23 || isNaN(selectedHours)) {
      valid = false;
    }

    if (selectedMinutes < 0 || selectedMinutes > 59 || isNaN(selectedMinutes)) {
      valid = false;
    }

    if (selectedDays === maxDays) {
      if (selectedHours > maxHours) {
        valid = false;
      }

      if (selectedHours === maxHours) {
        if (selectedMinutes > maxMinutes) {
          valid = false;
        }
      }
    }

    if (selectedDays <= 0 && selectedHours <= 0 && selectedMinutes <= 0) {
      valid = false;
    }

    setValidDate(valid);
  }, [
    dateSelected,
    maxDays,
    maxHours,
    maxMinutes,
    onChange,
    selectedDays,
    selectedHours,
    selectedMinutes,
  ]);

  const extraStyles = {
    "& .textBoxContainer": {
      minWidth: 0,
    },
    "& input": {
      textAlign: "center" as const,
      paddingRight: 10,
      paddingLeft: 10,
      width: 40,
    },
  };

  return (
    <Box className={"inputItem"}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <InputLabel htmlFor={id}>{label}</InputLabel>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-evenly",
          gap: 10,
          "& .reverseInput": {
            flexFlow: "row-reverse",
            "& > label": {
              fontWeight: 400,
              marginLeft: 15,
              marginRight: 25,
            },
          },
        }}
      >
        <Box>
          <InputBox
            id={id}
            className={`reverseInput removeArrows`}
            type="number"
            min="0"
            max="7"
            label="Days"
            name={id}
            onChange={(e) => {
              setSelectedDays(parseInt(e.target.value));
            }}
            value={selectedDays.toString()}
            sx={extraStyles}
            noLabelMinWidth
          />
        </Box>
        <Box>
          <InputBox
            id={id}
            className={`reverseInput removeArrows`}
            type="number"
            min="0"
            max="23"
            label="Hours"
            name={id}
            onChange={(e) => {
              setSelectedHours(parseInt(e.target.value));
            }}
            value={selectedHours.toString()}
            sx={extraStyles}
            noLabelMinWidth
          />
        </Box>
        <Box>
          <InputBox
            id={id}
            className={`reverseInput removeArrows`}
            type="number"
            min="0"
            max="59"
            label="Minutes"
            name={id}
            onChange={(e) => {
              setSelectedMinutes(parseInt(e.target.value));
            }}
            value={selectedMinutes.toString()}
            sx={extraStyles}
            noLabelMinWidth
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          marginTop: 25,
          marginLeft: 10,
          marginBottom: 15,
          "& .validityText": {
            fontSize: 14,
            marginTop: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "@media (max-width: 900px)": {
              flexFlow: "column",
            },
            "& > .min-icon": {
              color: "#5E5E5E",
              width: 15,
              height: 15,
              marginRight: 10,
            },
          },
          "& .validTill": {
            fontWeight: "bold",
            marginLeft: 15,
          },
          "& .invalidDurationText": {
            marginTop: 15,
            display: "flex",
            color: "red",
            fontSize: 11,
          },
        }}
      >
        {validDate && dateSelected ? (
          <div className={"validityText"}>
            <LinkIcon />
            <div>{entity} will be available until:</div>{" "}
            <div className={"validTill"}>
              {DateTime.fromISO(dateSelected).toFormat(
                "MM/dd/yyyy HH:mm:ss ZZZZ",
              )}
            </div>
          </div>
        ) : (
          <div className={"invalidDurationText"}>
            Please select a valid duration.
          </div>
        )}
      </Box>
    </Box>
  );
};

export default DaysSelector;
