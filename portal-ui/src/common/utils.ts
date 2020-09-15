// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import { ICapacity, IStorageType, IZoneModel } from "./types";

const minStReq = 1073741824; // Minimal Space required for MinIO
const minMemReq = 2147483648; // Minimal Memory required for MinIO in bytes

export const units = [
  "B",
  "KiB",
  "MiB",
  "GiB",
  "TiB",
  "PiB",
  "EiB",
  "ZiB",
  "YiB",
];
export const k8sUnits = ["Ki", "Mi", "Gi", "Ti", "Pi", "Ei"];
export const k8sCalcUnits = ["B", ...k8sUnits];

export const niceBytes = (x: string) => {
  let l = 0,
    n = parseInt(x, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  //include a decimal point and a tenths-place digit if presenting
  //less than ten of KB or greater units
  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
};

export const setCookie = (name: string, val: string) => {
  const date = new Date();
  const value = val;

  // Set it expire in 45 minutes
  date.setTime(date.getTime() + 45 * 60 * 1000);

  // Set it
  document.cookie =
    name + "=" + value + "; expires=" + date.toUTCString() + "; path=/";
};

export const deleteCookie = (name: string) => {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
};

export const setSession = (token: string) => {
  setCookie("token", token);
  storage.setItem("token", token);
};

export const clearSession = () => {
  storage.removeItem("token");
  deleteCookie("token");
};

// timeFromdate gets time string from date input
export const timeFromDate = (d: Date) => {
  let h = d.getHours() < 10 ? `0${d.getHours()}` : `${d.getHours()}`;
  let m = d.getMinutes() < 10 ? `0${d.getMinutes()}` : `${d.getMinutes()}`;
  let s = d.getSeconds() < 10 ? `0${d.getSeconds()}` : `${d.getSeconds()}`;

  return `${h}:${m}:${s}:${d.getMilliseconds()}`;
};

// units to be used in a dropdown
export const factorForDropdown = () => {
  return units.map((unit) => {
    return { label: unit, value: unit };
  });
};

// units to be used in a dropdown
export const k8sfactorForDropdown = () => {
  return k8sUnits.map((unit) => {
    return { label: unit, value: unit };
  });
};

//getBytes, converts from a value and a unit from units array to bytes
export const getBytes = (
  value: string,
  unit: string,
  fork8s: boolean = false
) => {
  const vl: number = parseFloat(value);

  const unitsTake = fork8s ? k8sCalcUnits : units;

  const powFactor = unitsTake.findIndex((element) => element === unit);

  if (powFactor == -1) {
    return "0";
  }
  const factor = Math.pow(1024, powFactor);
  const total = vl * factor;

  return total.toString(10);
};

//getTotalSize gets the total size of a value & unit
export const getTotalSize = (value: string, unit: string) => {
  const bytes = getBytes(value, unit, true).toString();
  return niceBytes(bytes);
};

export const setMemoryResource = (
  memorySize: number,
  capacitySize: string,
  maxMemorySize: number
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
      parseInt(getBytes("64", "Gi", true), 10)
    );
  } else if (capSize >= parseInt(getBytes("100", "Ti"), 10)) {
    memLimitSize = Math.max(
      memReqSize,
      parseInt(getBytes("32", "Gi", true), 10)
    );
  } else if (capSize >= parseInt(getBytes("10", "Ti"), 10)) {
    memLimitSize = Math.max(
      memReqSize,
      parseInt(getBytes("16", "Gi", true), 10)
    );
  } else if (capSize >= parseInt(getBytes("1", "Ti"), 10)) {
    memLimitSize = Math.max(
      memReqSize,
      parseInt(getBytes("8", "Gi", true), 10)
    );
  }

  return {
    error: "",
    request: memReqSize,
    limit: memLimitSize,
  };
};

export const calculateDistribution = (
  capacityToUse: ICapacity,
  forcedNodes: number = 0,
  limitSize: number = 0
) => {
  let numberOfNodes = {};
  const requestedSizeBytes = getBytes(
    capacityToUse.value,
    capacityToUse.unit,
    true
  );

  if (parseInt(requestedSizeBytes, 10) < minStReq) {
    return {
      error: "The zone size must be greater than 1Gi",
      nodes: 0,
      persistentVolumes: 0,
      disks: 0,
      pvSize: 0,
    };
  }

  if (forcedNodes < 4) {
    return {
      error: "Number of nodes cannot be less than 4",
      nodes: 0,
      persistentVolumes: 0,
      disks: 0,
      pvSize: 0,
    };
  }

  numberOfNodes = calculateStorage(requestedSizeBytes, forcedNodes, limitSize);

  return numberOfNodes;
};

const calculateStorage = (
  requestedBytes: string,
  forcedNodes: number,
  limitSize: number
) => {
  // Size validation
  const intReqBytes = parseInt(requestedBytes, 10);
  const maxDiskSize = minStReq * 256; // 256 GiB

  // We get the distribution
  return structureCalc(forcedNodes, intReqBytes, maxDiskSize, limitSize);
};

const structureCalc = (
  nodes: number,
  desiredCapacity: number,
  maxDiskSize: number,
  maxClusterSize: number,
  disksPerNode: number = 0
) => {
  if (
    isNaN(nodes) ||
    isNaN(desiredCapacity) ||
    isNaN(maxDiskSize) ||
    isNaN(maxClusterSize)
  ) {
    return {
      error: "Some provided data is invalid, please try again.",
      nodes: 0,
      persistentVolumes: 0,
      disks: 0,
      volumePerDisk: 0,
    }; // Invalid Data
  }

  let persistentVolumeSize = 0;
  let numberPersistentVolumes = 0;
  let volumesPerServer = 0;

  if (disksPerNode === 0) {
    persistentVolumeSize = Math.floor(
      Math.min(desiredCapacity / Math.max(4, nodes), maxDiskSize)
    ); // pVS = min((desiredCapacity / max(4 | nodes)) | maxDiskSize)

    numberPersistentVolumes = desiredCapacity / persistentVolumeSize; // nPV = dC / pVS
    volumesPerServer = numberPersistentVolumes / nodes; // vPS = nPV / n
  }

  if (disksPerNode) {
    volumesPerServer = disksPerNode;
    numberPersistentVolumes = volumesPerServer * nodes;
    persistentVolumeSize = Math.floor(
      desiredCapacity / numberPersistentVolumes
    );
  }

  // Volumes are not exact, we force the volumes number & minimize the volume size
  if (volumesPerServer % 1 > 0) {
    volumesPerServer = Math.ceil(volumesPerServer); // Increment of volumes per server
    numberPersistentVolumes = volumesPerServer * nodes; // nPV = vPS * n
    persistentVolumeSize = Math.floor(
      desiredCapacity / numberPersistentVolumes
    ); // pVS = dC / nPV

    const limitSize = persistentVolumeSize * volumesPerServer * nodes; // lS = pVS * vPS * n

    if (limitSize > maxClusterSize) {
      return {
        error: "We were not able to allocate this server.",
        nodes: 0,
        persistentVolumes: 0,
        disks: 0,
        volumePerDisk: 0,
      }; // Cannot allocate this server
    }
  }

  if (persistentVolumeSize < minStReq) {
    return {
      error:
        "Disk Size with this combination would be less than 1Gi, please try another combination",
      nodes: 0,
      persistentVolumes: 0,
      disks: 0,
      volumePerDisk: 0,
    }; // Cannot allocate this volume size
  }

  return {
    error: "",
    nodes,
    persistentVolumes: numberPersistentVolumes,
    disks: volumesPerServer,
    pvSize: persistentVolumeSize,
  };
};

// Zone Name Generator
export const generateZoneName = (zones: IZoneModel[]) => {
  const zoneCounter = zones.length;

  return `zone-${zoneCounter}`;
};
