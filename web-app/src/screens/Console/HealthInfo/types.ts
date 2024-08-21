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
  timestamp: string;
  error: string;
  perf: perfInfo;
  minio: minioHealthInfo;
  sys: sysHealthInfo;
}

export interface ReportMessage {
  encoded: string;
  serverHealthInfo: HealthInfoMessage;
  subnetResponse: string;
}

interface perfInfo {
  drives: serverDrivesInfo[];
  net: serverNetHealthInfo[];
  net_parallel: serverNetHealthInfo;
  error: string;
}

interface serverDrivesInfo {
  addr: string;
  serial: drivePerfInfo[];
  parallel: drivePerfInfo[];
  error: string;
}

interface drivePerfInfo {
  endpoint: string;
  latency: diskLatency;
  throughput: diskThroughput;
  error: string;
}

interface diskLatency {
  avg_secs: number;
  percentile50_secs: number;
  percentile90_secs: number;
  percentile99_secs: number;
  min_secs: number;
  max_secs: number;
}

interface diskThroughput {
  avg_bytes_per_sec: number;
  percentile50_bytes_per_sec: number;
  percentile90_bytes_per_sec: number;
  percentile99_bytes_per_sec: number;
  min_bytes_per_sec: number;
  max_bytes_per_sec: number;
}

interface serverNetHealthInfo {
  addr: string;
  net: netPerfInfo[];
  error: string;
}

interface netPerfInfo {
  remote: string;
  latency: netLatency;
  throughput: netThroughput;
  error: string;
}

interface netLatency {
  avg_secs: number;
  percentile50_secs: number;
  percentile90_secs: number;
  percentile99_secs: number;
  min_secs: number;
  max_secs: number;
}

interface netThroughput {
  avg_bytes_per_sec: number;
  percentile50_bytes_per_sec: number;
  percentile90_bytes_per_sec: number;
  percentile99_bytes_per_sec: number;
  min_bytes_per_sec: number;
  max_bytes_per_sec: number;
}

interface minioHealthInfo {
  info: infoMessage;
  config: any;
  error: string;
}

interface infoMessage {
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

interface buckets {
  count: number;
}

interface objects {
  count: number;
}

interface usage {
  size: number;
}

interface services {
  vault: vault;
  ldap: ldap;
  logger: Map<string, status[]>[];
  audit: Map<string, status[]>[];
  notifications: Map<string, Map<string, status[]>[]>;
}

interface vault {
  status: string;
  encrypt: string;
  decrypt: string;
}

interface ldap {
  status: string;
}

interface status {
  status: string;
}

interface serverProperties {
  state: string;
  endpoint: string;
  uptime: number;
  version: string;
  commitID: string;
  network: Map<string, string>;
  drives: disk[];
}

interface disk {
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

interface sysHealthInfo {
  cpus: serverCpuInfo[];
  drives: serverDiskHwInfo[];
  osinfos: serverOsInfo[];
  meminfos: serverMemInfo[];
  procinfos: serverProcInfo[];
  error: string;
}

interface serverCpuInfo {
  addr: string;
  cpu: cpuInfoStat[];
  time: cpuTimeStat[];
  error: string;
}

interface cpuInfoStat {
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

interface cpuTimeStat {
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

interface serverDiskHwInfo {
  addr: string;
  usages: diskUsageStat[];
  partitions: partitionStat[];
  counters: Map<string, diskIOCountersStat>;
  error: string;
}

interface diskUsageStat {
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

interface partitionStat {
  device: string;
  mountpoint: string;
  fstype: string;
  opts: string;
  smartInfo: smartInfo;
}

interface smartInfo {
  device: string;
  scsi: scsiInfo;
  nvme: nvmeInfo;
  ata: ataInfo;
  error: string;
}

interface scsiInfo {
  scsiCapacityBytes: number;
  scsiModeSenseBuf: string;
  scsirespLen: number;
  scsiBdLen: number;
  scsiOffset: number;
  sciRpm: number;
}

interface nvmeInfo {
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

interface ataInfo {
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

interface diskIOCountersStat {
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

interface serverOsInfo {
  addr: string;
  info: infoStat;
  sensors: temperatureStat[];
  users: userStat[];
  error: string;
}

interface infoStat {
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

interface temperatureStat {
  sensorKey: string;
  sensorTemperature: number;
}

interface userStat {
  user: string;
  terminal: string;
  host: string;
  started: number;
}

interface serverMemInfo {
  addr: string;
  swap: swapMemoryStat;
  virtualmem: virtualMemoryStat;
  error: string;
}

interface swapMemoryStat {
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

interface virtualMemoryStat {
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

interface serverProcInfo {
  addr: string;
  processes: sysProcess[];
  error: string;
}

interface sysProcess {
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

interface nethwConnectionStat {
  fd: number;
  family: number;
  type: number;
  localaddr: netAddr;
  remoteaddr: netAddr;
  status: string;
  uids: number[];
  pid: number;
}

interface netAddr {
  ip: string;
  port: number;
}

interface processIOCountersStat {
  readCount: number;
  writeCount: number;
  readBytes: number;
  writeBytes: number;
}

interface memoryInfoStat {
  rss: number;
  vms: number;
  hwm: number;
  data: number;
  stack: number;
  locked: number;
  swap: number;
}

interface nethwIOCounterStat {
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

interface processNmCtxSwitchesStat {
  voluntary: number;
  involuntary: number;
}

interface processPageFaultsStat {
  minorFaults: number;
  majorFaults: number;
  childMinorFaults: number;
  childMajorFaults: number;
}

interface processRLimitStat {
  resource: number;
  soft: number;
  hard: number;
  used: number;
}
