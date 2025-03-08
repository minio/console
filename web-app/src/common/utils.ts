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

import storage from "local-storage-fallback";
import { IErasureCodeCalc, IStorageFactors } from "./types";

import get from "lodash/get";

const minMemReq = 2147483648; // Minimal Memory required for MinIO in bytes

const units = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
const k8sUnits = ["Ki", "Mi", "Gi", "Ti", "Pi", "Ei"];
const k8sCalcUnits = ["B", ...k8sUnits];

export const niceBytes = (x: string, showK8sUnits: boolean = false) => {
  let n = parseInt(x, 10) || 0;

  return niceBytesInt(n, showK8sUnits);
};

export const niceBytesInt = (n: number, showK8sUnits: boolean = false) => {
  let l = 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  // include a decimal point and a tenths-place digit if presenting
  // less than ten of KB or greater units
  const k8sUnitsN = ["B", ...k8sUnits];
  return n.toFixed(1) + " " + (showK8sUnits ? k8sUnitsN[l] : units[l]);
};

const deleteCookie = (name: string) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export const clearSession = () => {
  storage.removeItem("token");
  storage.removeItem("auth-state");
  deleteCookie("token");
  deleteCookie("idp-refresh-token");
};

//getBytes, converts from a value and a unit from units array to bytes as a string
export const getBytes = (
  value: string,
  unit: string,
  fromk8s: boolean = false,
): string => {
  return getBytesNumber(value, unit, fromk8s).toString(10);
};

//getBytesNumber, converts from a value and a unit from units array to bytes
const getBytesNumber = (
  value: string,
  unit: string,
  fromk8s: boolean = false,
): number => {
  const vl: number = parseFloat(value);

  const unitsTake = fromk8s ? k8sCalcUnits : units;

  const powFactor = unitsTake.findIndex((element) => element === unit);

  if (powFactor === -1) {
    return 0;
  }
  const factor = Math.pow(1024, powFactor);
  const total = vl * factor;

  return total;
};

export const setMemoryResource = (
  memorySize: number,
  capacitySize: string,
  maxMemorySize: number,
) => {
  // value always comes as Gi
  const requestedSizeBytes = getBytes(memorySize.toString(10), "Gi", true);
  const memReqSize = parseInt(requestedSizeBytes, 10);
  if (maxMemorySize === 0) {
    return {
      error: "There is no memory available for the selected number of nodes",
      request: 0,
      limit: 0,
    };
  }

  if (maxMemorySize < minMemReq) {
    return {
      error: "There are not enough memory resources available",
      request: 0,
      limit: 0,
    };
  }

  if (memReqSize < minMemReq) {
    return {
      error: "The requested memory size must be greater than 2Gi",
      request: 0,
      limit: 0,
    };
  }
  if (memReqSize > maxMemorySize) {
    return {
      error:
        "The requested memory is greater than the max available memory for the selected number of nodes",
      request: 0,
      limit: 0,
    };
  }

  const capSize = parseInt(capacitySize, 10);
  let memLimitSize = memReqSize;
  // set memory limit based on the capacitySize
  // if capacity size is lower than 1TiB we use the limit equal to request
  if (capSize >= parseInt(getBytes("1", "Pi", true), 10)) {
    memLimitSize = Math.max(
      memReqSize,
      parseInt(getBytes("64", "Gi", true), 10),
    );
  } else if (capSize >= parseInt(getBytes("100", "Ti"), 10)) {
    memLimitSize = Math.max(
      memReqSize,
      parseInt(getBytes("32", "Gi", true), 10),
    );
  } else if (capSize >= parseInt(getBytes("10", "Ti"), 10)) {
    memLimitSize = Math.max(
      memReqSize,
      parseInt(getBytes("16", "Gi", true), 10),
    );
  } else if (capSize >= parseInt(getBytes("1", "Ti"), 10)) {
    memLimitSize = Math.max(
      memReqSize,
      parseInt(getBytes("8", "Gi", true), 10),
    );
  }

  return {
    error: "",
    request: memReqSize,
    limit: memLimitSize,
  };
};

// Erasure Code Parity Calc
export const erasureCodeCalc = (
  parityValidValues: string[],
  totalDisks: number,
  pvSize: number,
  totalNodes: number,
): IErasureCodeCalc => {
  // Parity Values is empty
  if (parityValidValues.length < 1) {
    return {
      error: 1,
      defaultEC: "",
      erasureCodeSet: 0,
      maxEC: "",
      rawCapacity: "0",
      storageFactors: [],
    };
  }

  const totalStorage = totalDisks * pvSize;
  const maxEC = parityValidValues[0];
  const maxParityNumber = parseInt(maxEC.split(":")[1], 10);

  const erasureStripeSet = maxParityNumber * 2; // ESS is calculated by multiplying maximum parity by two.

  const storageFactors: IStorageFactors[] = parityValidValues.map(
    (currentParity) => {
      const parityNumber = parseInt(currentParity.split(":")[1], 10);
      const storageFactor =
        erasureStripeSet / (erasureStripeSet - parityNumber);

      const maxCapacity = Math.floor(totalStorage / storageFactor);
      const maxTolerations =
        totalDisks - Math.floor(totalDisks / storageFactor);
      return {
        erasureCode: currentParity,
        storageFactor,
        maxCapacity: maxCapacity.toString(10),
        maxFailureTolerations: maxTolerations,
      };
    },
  );

  let defaultEC = maxEC;

  const fourVar = parityValidValues.find((element) => element === "EC:4");

  if (fourVar) {
    defaultEC = "EC:4";
  }

  return {
    error: 0,
    storageFactors,
    maxEC,
    rawCapacity: totalStorage.toString(10),
    erasureCodeSet: erasureStripeSet,
    defaultEC,
  };
};

// 92400 seconds -> 1 day, 1 hour, 40 minutes.
export const niceTimeFromSeconds = (seconds: number): string => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  }

  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  }

  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  }

  if (remainingSeconds > 0) {
    parts.push(
      `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`,
    );
  }

  return parts.join(" and ");
};

// niceDaysInt returns the string in the max unit found e.g. 92400 seconds -> 1 day
export const niceDaysInt = (seconds: number, timeVariant: string = "s") => {
  switch (timeVariant) {
    case "ns":
      seconds = Math.floor(seconds * 0.000000001);
      break;
    case "ms":
      seconds = Math.floor(seconds * 0.001);
      break;
    default:
  }

  const days = Math.floor(seconds / (3600 * 24));

  seconds -= days * 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  if (days > 365) {
    const years = days / 365;
    return `${years} year${Math.floor(years) === 1 ? "" : "s"}`;
  }

  if (days > 30) {
    const months = Math.floor(days / 30);
    const diffDays = days - months * 30;

    return `${months} month${Math.floor(months) === 1 ? "" : "s"} ${
      diffDays > 0 ? `${diffDays} day${diffDays > 1 ? "s" : ""}` : ""
    }`;
  }

  if (days >= 7 && days <= 30) {
    const weeks = Math.floor(days / 7);

    return `${Math.floor(weeks)} week${weeks === 1 ? "" : "s"}`;
  }

  if (days >= 1 && days <= 6) {
    return `${days} day${days > 1 ? "s" : ""}`;
  }

  return `${hours >= 1 ? `${hours} hour${hours > 1 ? "s" : ""}` : ""} ${
    minutes >= 1 && hours === 0
      ? `${minutes} minute${minutes > 1 ? "s" : ""}`
      : ""
  } ${
    seconds >= 1 && minutes === 0 && hours === 0
      ? `${seconds} second${seconds > 1 ? "s" : ""}`
      : ""
  }`;
};

export const getClientOS = (): string => {
  const getPlatform = get(window.navigator, "platform", "undefined");

  if (!getPlatform) {
    return "undefined";
  }

  return getPlatform;
};

// replaces bad unicode characters
export const replaceUnicodeChar = (inputString: string): string => {
  let unicodeChar = "\u202E";
  return inputString.split(unicodeChar).join("<�202e>");
};

// unescaped characters might throw error like '%'
export const safeDecodeURIComponent = (value: any) => {
  try {
    return decodeURIComponent(value);
  } catch (err) {
    return value;
  }
};
