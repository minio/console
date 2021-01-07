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

export const DiagStatError = "error";
export const DiagStatSuccess = "success";
export const DiagStatInProgress = "inProgress";
export interface HealthInfoMessage {
  timestamp: Date;
  error: string;
  perf: perfInfo;
  minio: minioHealthInfo;
  sys: sysHealthInfo;
}

export interface perfInfo {
  drives: serverDrivesInfo[];
  net: serverNetHealthInfo[];
  net_parallel: serverNetHealthInfo;
  error: string;
}

export interface serverDrivesInfo {
  addr: string;
  serial: drivePerfInfo[];
  parallel: drivePerfInfo[];
  error: string;
}

export interface drivePerfInfo {
  endpoint: string;
  latency: diskLatency;
  throughput: diskThroughput;
  error: string;
}
export interface diskLatency {
  avg_secs: number;
  percentile50_secs: number;
  percentile90_secs: number;
  percentile99_secs: number;
  min_secs: number;
  max_secs: number;
}

export interface diskThroughput {
  avg_bytes_per_sec: number;
  percentile50_bytes_per_sec: number;
  percentile90_bytes_per_sec: number;
  percentile99_bytes_per_sec: number;
  min_bytes_per_sec: number;
  max_bytes_per_sec: number;
}

export interface serverNetHealthInfo {
  addr: string;
  net: netPerfInfo[];
  error: string;
}

export interface netPerfInfo {
  remote: string;
  latency: netLatency;
  throughput: netThroughput;
  error: string;
}

export interface netLatency {
  avg_secs: number;
  percentile50_secs: number;
  percentile90_secs: number;
  percentile99_secs: number;
  min_secs: number;
  max_secs: number;
}
export interface netThroughput {
  avg_bytes_per_sec: number;
  percentile50_bytes_per_sec: number;
  percentile90_bytes_per_sec: number;
  percentile99_bytes_per_sec: number;
  min_bytes_per_sec: number;
  max_bytes_per_sec: number;
}

export interface minioHealthInfo {
  info: infoMessage;
  config: any;
  error: string;
}

export interface infoMessage {
  mode: string;
  domain: string[];
  region: string;
  sqsARN: string[];
  deploymentID: string;
  buckets: buckets;
  objects: objects;
  usage: usage;
  services: services;
  backend: any;
  servers: serverProperties[];
}

export interface buckets {
  count: number;
}

export interface objects {
  count: number;
}

export interface usage {
  size: number;
}

export interface services {
  vault: vault;
  ldap: ldap;
  logger: Map<string, status[]>[];
  audit: Map<string, status[]>[];
  notifications: Map<string, Map<string, status[]>[]>;
}

export interface vault {
  status: string;
  encrypt: string;
  decrypt: string;
}

export interface ldap {
  status: string;
}

export interface status {
  status: string;
}

export interface serverProperties {
  state: string;
  endpoint: string;
  uptime: number;
  version: string;
  commitID: string;
  network: Map<string, string>;
  drives: disk[];
}

export interface disk {
  endpoint: string;
  rootDisk: boolean;
  path: string;
  healing: boolean;
  state: string;
  uuid: string;
  model: string;
  totalspace: number;
  usedspace: number;
  availspace: number;
  readthroughput: number;
  writethroughput: number;
  readlatency: number;
  writelatency: number;
  utilization: number;
}

export interface sysHealthInfo {
  cpus: serverCpuInfo[];
  drives: serverDiskHwInfo[];
  osinfos: serverOsInfo[];
  meminfos: serverMemInfo[];
  procinfos: serverProcInfo[];
  error: string;
}

export interface serverCpuInfo {
  addr: string;
  cpu: cpuInfoStat[];
  time: cpuTimeStat[];
  error: string;
}

export interface cpuInfoStat {
  cpu: number;
  vendorId: string;
  family: string;
  model: string;
  stepping: number;
  physicalId: string;
  coreId: string;
  cores: number;
  modelName: string;
  mhz: number;
  cacheSize: number;
  flags: string[];
  microcode: string;
}

export interface cpuTimeStat {
  cpu: string;
  user: number;
  system: number;
  idle: number;
  nice: number;
  iowait: number;
  irq: number;
  softirq: number;
  steal: number;
  guest: number;
  guestNice: number;
}

export interface serverDiskHwInfo {
  addr: string;
  usages: diskUsageStat[];
  partitions: partitionStat[];
  counters: Map<string, diskIOCountersStat>;
  error: string;
}

export interface diskUsageStat {
  path: string;
  fstype: string;
  total: number;
  free: number;
  used: number;
  usedPercent: number;
  inodesTotal: number;
  inodesUsed: number;
  inodesFree: number;
  inodesUsedPercent: number;
}

export interface partitionStat {
  device: string;
  mountpoint: string;
  fstype: string;
  opts: string;
  smartInfo: smartInfo;
}

export interface smartInfo {
  device: string;
  scsi: scsiInfo;
  nvme: nvmeInfo;
  ata: ataInfo;
  error: string;
}

export interface scsiInfo {
  scsiCapacityBytes: number;
  scsiModeSenseBuf: string;
  scsirespLen: number;
  scsiBdLen: number;
  scsiOffset: number;
  sciRpm: number;
}

export interface nvmeInfo {
  serialNum: string;
  vendorId: string;
  firmwareVersion: string;
  modelNum: string;
  spareAvailable: string;
  spareThreshold: string;
  temperature: string;
  criticalWarning: string;
  maxDataTransferPages: number;
  controllerBusyTime: number;
  powerOnHours: number;
  powerCycles: number;
  unsafeShutdowns: number;
  mediaAndDataIntgerityErrors: number;
  dataUnitsReadBytes: number;
  dataUnitsWrittenBytes: number;
  hostReadCommands: number;
  hostWriteCommands: number;
}

export interface ataInfo {
  scsiLuWWNDeviceID: string;
  serialNum: string;
  modelNum: string;
  firmwareRevision: string;
  RotationRate: string;
  MajorVersion: string;
  MinorVersion: string;
  smartSupportAvailable: boolean;
  smartSupportEnabled: boolean;
  smartErrorLog: string;
  transport: string;
}

export interface diskIOCountersStat {
  readCount: number;
  mergedReadCount: number;
  DriteCount: number;
  mergedWriteCount: number;
  readBytes: number;
  writeBytes: number;
  readTime: number;
  writeTime: number;
  iopsInProgress: number;
  ioTime: number;
  weightedIO: number;
  name: string;
  serialNumber: string;
  label: string;
}

export interface serverOsInfo {
  addr: string;
  info: infoStat;
  sensors: temperatureStat[];
  users: userStat[];
  error: string;
}

export interface infoStat {
  hostname: string;
  uptime: number;
  bootTime: number;
  procs: number;
  os: string;
  platform: string;
  platformFamily: string;
  platformVersion: string;
  kernelVersion: string;
  kernelArch: string;
  virtualizationSystem: string;
  virtualizationRole: string;
  hostid: string;
}

export interface temperatureStat {
  sensorKey: string;
  sensorTemperature: number;
}

export interface userStat {
  user: string;
  terminal: string;
  host: string;
  started: number;
}

export interface serverMemInfo {
  addr: string;
  swap: swapMemoryStat;
  virtualmem: virtualMemoryStat;
  error: string;
}

export interface swapMemoryStat {
  total: number;
  used: number;
  free: number;
  usedPercent: number;
  sin: number;
  sout: number;
  pgin: number;
  pgout: number;
  pgfault: number;
  pgmajfault: number;
}

export interface virtualMemoryStat {
  total: number;
  available: number;
  used: number;
  usedPercent: number;
  free: number;
  active: number;
  inactive: number;
  wired: number;
  laundry: number;
  buffers: number;
  cached: number;
  writeback: number;
  dirty: number;
  writebacktmp: number;
  shared: number;
  slab: number;
  sreclaimable: number;
  sunreclaim: number;
  pagetables: number;
  swapcached: number;
  commitlimit: number;
  committedas: number;
  hightotal: number;
  highfree: number;
  lowtotal: number;
  lowfree: number;
  swaptotal: number;
  swapfree: number;
  mapped: number;
  vmalloctotal: number;
  vmallocused: number;
  vmallocchunk: number;
  hugepagestotal: number;
  hugepagesfree: number;
  hugepagesize: number;
}

export interface serverProcInfo {
  addr: string;
  processes: sysProcess[];
  error: string;
}

export interface sysProcess {
  pid: number;
  background: boolean;
  cpupercent: number;
  children: number[];
  cmd: string;
  connections: nethwConnectionStat[];
  createtime: number;
  cwd: string;
  exe: string;
  gids: number[];
  iocounters: processIOCountersStat;
  isrunning: boolean;
  meminfo: memoryInfoStat;
  memmaps: any[];
  mempercent: number;
  name: string;
  netiocounters: nethwIOCounterStat[];
  nice: number;
  numctxswitches: processNmCtxSwitchesStat;
  numfds: number;
  numthreads: number;
  pagefaults: processPageFaultsStat;
  parent: number;
  ppid: number;
  rlimit: processRLimitStat[];
  status: string;
  tgid: number;
  cputimes: cpuTimeStat;
  uids: number[];
  username: string;
}

export interface nethwConnectionStat {
  fd: number;
  family: number;
  type: number;
  localaddr: netAddr;
  remoteaddr: netAddr;
  status: string;
  uids: number[];
  pid: number;
}

export interface netAddr {
  ip: string;
  port: number;
}

export interface processIOCountersStat {
  readCount: number;
  writeCount: number;
  readBytes: number;
  writeBytes: number;
}

export interface memoryInfoStat {
  rss: number;
  vms: number;
  hwm: number;
  data: number;
  stack: number;
  locked: number;
  swap: number;
}

export interface nethwIOCounterStat {
  name: string;
  bytesSent: number;
  bytesRecv: number;
  packetsSent: number;
  packetsRecv: number;
  errin: number;
  errout: number;
  dropin: number;
  dropout: number;
  fifoin: number;
  fifoout: number;
}

export interface processNmCtxSwitchesStat {
  voluntary: number;
  involuntary: number;
}

export interface processPageFaultsStat {
  minorFaults: number;
  majorFaults: number;
  childMinorFaults: number;
  childMajorFaults: number;
}

export interface processRLimitStat {
  resource: number;
  soft: number;
  hard: number;
  used: number;
}
