package operatorapi

import (
	"fmt"
	"io"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/meta"
	"k8s.io/apimachinery/pkg/api/resource"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/util/sets"
	"k8s.io/apimachinery/pkg/util/validation"
	"math"
	"net"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"time"
)

var maxAnnotationLen = 140

var (
	// globally skipped annotations
	skipAnnotations = sets.NewString(corev1.LastAppliedConfigAnnotation)
)

// PrefixWriter can write text at various indentation levels.
type PrefixWriter interface {
	// Write writes text with the specified indentation level.
	Write(level int, format string, a ...interface{})
	// WriteLine writes an entire line with no indentation level.
	WriteLine(a ...interface{})
	// Flush forces indentation to be reset.
	Flush()
}

// prefixWriter implements PrefixWriter
type prefixWriter struct {
	out io.Writer
}

var _ PrefixWriter = &prefixWriter{}

// NewPrefixWriter creates a new PrefixWriter.
func NewPrefixWriter(out io.Writer) PrefixWriter {
	return &prefixWriter{out: out}
}

func (pw *prefixWriter) Write(level int, format string, a ...interface{}) {
	levelSpace := "  "
	prefix := ""
	for i := 0; i < level; i++ {
		prefix += levelSpace
	}
	fmt.Fprintf(pw.out, prefix+format, a...)
}

func (pw *prefixWriter) WriteLine(a ...interface{}) {
	fmt.Fprintln(pw.out, a...)
}

type flusher interface {
	Flush()
}

func (pw *prefixWriter) Flush() {
	if f, ok := pw.out.(flusher); ok {
		f.Flush()
	}
}

type SortableVolumeMounts []corev1.VolumeMount

func (list SortableVolumeMounts) Len() int {
	return len(list)
}

func (list SortableVolumeMounts) Swap(i, j int) {
	list[i], list[j] = list[j], list[i]
}

func (list SortableVolumeMounts) Less(i, j int) bool {
	return list[i].MountPath < list[j].MountPath
}

type SortableVolumeDevices []corev1.VolumeDevice

func (list SortableVolumeDevices) Len() int {
	return len(list)
}

func (list SortableVolumeDevices) Swap(i, j int) {
	list[i], list[j] = list[j], list[i]
}

func (list SortableVolumeDevices) Less(i, j int) bool {
	return list[i].DevicePath < list[j].DevicePath
}

// printLabelsMultiline prints multiple labels with a proper alignment.
func printLabelsMultiline(w PrefixWriter, title string, labels map[string]string) {
	printLabelsMultilineWithIndent(w, "", title, "\t", labels, sets.NewString())
}

// printLabelsMultiline prints multiple labels with a user-defined alignment.
func printLabelsMultilineWithIndent(w PrefixWriter, initialIndent, title, innerIndent string, labels map[string]string, skip sets.String) {
	w.Write(0, "%s%s:%s", initialIndent, title, innerIndent)

	if len(labels) == 0 {
		w.WriteLine("<none>")
		return
	}

	// to print labels in the sorted order
	keys := make([]string, 0, len(labels))
	for key := range labels {
		if skip.Has(key) {
			continue
		}
		keys = append(keys, key)
	}
	if len(keys) == 0 {
		w.WriteLine("<none>")
		return
	}
	sort.Strings(keys)

	for i, key := range keys {
		if i != 0 {
			w.Write(0, "%s", initialIndent)
			w.Write(0, "%s", innerIndent)
		}
		w.Write(0, "%s=%s\n", key, labels[key])
	}
}

func printAnnotationsMultiline(w PrefixWriter, title string, annotations map[string]string) {
	w.Write(0, "%s:\t", title)

	// to print labels in the sorted order
	keys := make([]string, 0, len(annotations))
	for key := range annotations {
		if skipAnnotations.Has(key) {
			continue
		}
		keys = append(keys, key)
	}
	if len(keys) == 0 {
		w.WriteLine("<none>")
		return
	}
	sort.Strings(keys)
	indent := "\t"
	for i, key := range keys {
		if i != 0 {
			w.Write(0, indent)
		}
		value := strings.TrimSuffix(annotations[key], "\n")
		if (len(value)+len(key)+2) > maxAnnotationLen || strings.Contains(value, "\n") {
			w.Write(0, "%s:\n", key)
			for _, s := range strings.Split(value, "\n") {
				w.Write(0, "%s  %s\n", indent, shorten(s, maxAnnotationLen-2))
			}
		} else {
			w.Write(0, "%s: %s\n", key, value)
		}
	}
}

func shorten(s string, maxLength int) string {
	if len(s) > maxLength {
		return s[:maxLength] + "..."
	}
	return s
}

func describeVolumes(volumes []corev1.Volume, w PrefixWriter, space string) {
	if len(volumes) == 0 {
		w.Write(0, "%sVolumes:\t<none>\n", space)
		return
	}

	w.Write(0, "%sVolumes:\n", space)
	for _, volume := range volumes {
		nameIndent := ""
		if len(space) > 0 {
			nameIndent = " "
		}
		w.Write(1, "%s%v:\n", nameIndent, volume.Name)
		switch {
		case volume.VolumeSource.HostPath != nil:
			printHostPathVolumeSource(volume.VolumeSource.HostPath, w)
		case volume.VolumeSource.EmptyDir != nil:
			printEmptyDirVolumeSource(volume.VolumeSource.EmptyDir, w)
		case volume.VolumeSource.GCEPersistentDisk != nil:
			printGCEPersistentDiskVolumeSource(volume.VolumeSource.GCEPersistentDisk, w)
		case volume.VolumeSource.AWSElasticBlockStore != nil:
			printAWSElasticBlockStoreVolumeSource(volume.VolumeSource.AWSElasticBlockStore, w)
		case volume.VolumeSource.GitRepo != nil:
			printGitRepoVolumeSource(volume.VolumeSource.GitRepo, w)
		case volume.VolumeSource.Secret != nil:
			printSecretVolumeSource(volume.VolumeSource.Secret, w)
		case volume.VolumeSource.ConfigMap != nil:
			printConfigMapVolumeSource(volume.VolumeSource.ConfigMap, w)
		case volume.VolumeSource.NFS != nil:
			printNFSVolumeSource(volume.VolumeSource.NFS, w)
		case volume.VolumeSource.ISCSI != nil:
			printISCSIVolumeSource(volume.VolumeSource.ISCSI, w)
		case volume.VolumeSource.Glusterfs != nil:
			printGlusterfsVolumeSource(volume.VolumeSource.Glusterfs, w)
		case volume.VolumeSource.PersistentVolumeClaim != nil:
			printPersistentVolumeClaimVolumeSource(volume.VolumeSource.PersistentVolumeClaim, w)
		case volume.VolumeSource.Ephemeral != nil:
			printEphemeralVolumeSource(volume.VolumeSource.Ephemeral, w)
		case volume.VolumeSource.RBD != nil:
			printRBDVolumeSource(volume.VolumeSource.RBD, w)
		case volume.VolumeSource.Quobyte != nil:
			printQuobyteVolumeSource(volume.VolumeSource.Quobyte, w)
		case volume.VolumeSource.DownwardAPI != nil:
			printDownwardAPIVolumeSource(volume.VolumeSource.DownwardAPI, w)
		case volume.VolumeSource.AzureDisk != nil:
			printAzureDiskVolumeSource(volume.VolumeSource.AzureDisk, w)
		case volume.VolumeSource.VsphereVolume != nil:
			printVsphereVolumeSource(volume.VolumeSource.VsphereVolume, w)
		case volume.VolumeSource.Cinder != nil:
			printCinderVolumeSource(volume.VolumeSource.Cinder, w)
		case volume.VolumeSource.PhotonPersistentDisk != nil:
			printPhotonPersistentDiskVolumeSource(volume.VolumeSource.PhotonPersistentDisk, w)
		case volume.VolumeSource.PortworxVolume != nil:
			printPortworxVolumeSource(volume.VolumeSource.PortworxVolume, w)
		case volume.VolumeSource.ScaleIO != nil:
			printScaleIOVolumeSource(volume.VolumeSource.ScaleIO, w)
		case volume.VolumeSource.CephFS != nil:
			printCephFSVolumeSource(volume.VolumeSource.CephFS, w)
		case volume.VolumeSource.StorageOS != nil:
			printStorageOSVolumeSource(volume.VolumeSource.StorageOS, w)
		case volume.VolumeSource.FC != nil:
			printFCVolumeSource(volume.VolumeSource.FC, w)
		case volume.VolumeSource.AzureFile != nil:
			printAzureFileVolumeSource(volume.VolumeSource.AzureFile, w)
		case volume.VolumeSource.FlexVolume != nil:
			printFlexVolumeSource(volume.VolumeSource.FlexVolume, w)
		case volume.VolumeSource.Flocker != nil:
			printFlockerVolumeSource(volume.VolumeSource.Flocker, w)
		case volume.VolumeSource.Projected != nil:
			printProjectedVolumeSource(volume.VolumeSource.Projected, w)
		case volume.VolumeSource.CSI != nil:
			printCSIVolumeSource(volume.VolumeSource.CSI, w)
		default:
			w.Write(1, "<unknown>\n")
		}
	}
}

func printHostPathVolumeSource(hostPath *corev1.HostPathVolumeSource, w PrefixWriter) {
	hostPathType := "<none>"
	if hostPath.Type != nil {
		hostPathType = string(*hostPath.Type)
	}
	w.Write(2, "Type:\tHostPath (bare host directory volume)\n"+
		"    Path:\t%v\n"+
		"    HostPathType:\t%v\n",
		hostPath.Path, hostPathType)
}

func printEmptyDirVolumeSource(emptyDir *corev1.EmptyDirVolumeSource, w PrefixWriter) {
	var sizeLimit string
	if emptyDir.SizeLimit != nil && emptyDir.SizeLimit.Cmp(resource.Quantity{}) > 0 {
		sizeLimit = fmt.Sprintf("%v", emptyDir.SizeLimit)
	} else {
		sizeLimit = "<unset>"
	}
	w.Write(2, "Type:\tEmptyDir (a temporary directory that shares a pod's lifetime)\n"+
		"    Medium:\t%v\n"+
		"    SizeLimit:\t%v\n",
		emptyDir.Medium, sizeLimit)
}

func printGCEPersistentDiskVolumeSource(gce *corev1.GCEPersistentDiskVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tGCEPersistentDisk (a Persistent Disk resource in Google Compute Engine)\n"+
		"    PDName:\t%v\n"+
		"    FSType:\t%v\n"+
		"    Partition:\t%v\n"+
		"    ReadOnly:\t%v\n",
		gce.PDName, gce.FSType, gce.Partition, gce.ReadOnly)
}

func printAWSElasticBlockStoreVolumeSource(aws *corev1.AWSElasticBlockStoreVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tAWSElasticBlockStore (a Persistent Disk resource in AWS)\n"+
		"    VolumeID:\t%v\n"+
		"    FSType:\t%v\n"+
		"    Partition:\t%v\n"+
		"    ReadOnly:\t%v\n",
		aws.VolumeID, aws.FSType, aws.Partition, aws.ReadOnly)
}

func printGitRepoVolumeSource(git *corev1.GitRepoVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tGitRepo (a volume that is pulled from git when the pod is created)\n"+
		"    Repository:\t%v\n"+
		"    Revision:\t%v\n",
		git.Repository, git.Revision)
}

func printSecretVolumeSource(secret *corev1.SecretVolumeSource, w PrefixWriter) {
	optional := secret.Optional != nil && *secret.Optional
	w.Write(2, "Type:\tSecret (a volume populated by a Secret)\n"+
		"    SecretName:\t%v\n"+
		"    Optional:\t%v\n",
		secret.SecretName, optional)
}

func printConfigMapVolumeSource(configMap *corev1.ConfigMapVolumeSource, w PrefixWriter) {
	optional := configMap.Optional != nil && *configMap.Optional
	w.Write(2, "Type:\tConfigMap (a volume populated by a ConfigMap)\n"+
		"    Name:\t%v\n"+
		"    Optional:\t%v\n",
		configMap.Name, optional)
}

func printProjectedVolumeSource(projected *corev1.ProjectedVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tProjected (a volume that contains injected data from multiple sources)\n")
	for _, source := range projected.Sources {
		if source.Secret != nil {
			w.Write(2, "SecretName:\t%v\n"+
				"    SecretOptionalName:\t%v\n",
				source.Secret.Name, source.Secret.Optional)
		} else if source.DownwardAPI != nil {
			w.Write(2, "DownwardAPI:\ttrue\n")
		} else if source.ConfigMap != nil {
			w.Write(2, "ConfigMapName:\t%v\n"+
				"    ConfigMapOptional:\t%v\n",
				source.ConfigMap.Name, source.ConfigMap.Optional)
		} else if source.ServiceAccountToken != nil {
			w.Write(2, "TokenExpirationSeconds:\t%d\n",
				*source.ServiceAccountToken.ExpirationSeconds)
		}
	}
}

func printNFSVolumeSource(nfs *corev1.NFSVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tNFS (an NFS mount that lasts the lifetime of a pod)\n"+
		"    Server:\t%v\n"+
		"    Path:\t%v\n"+
		"    ReadOnly:\t%v\n",
		nfs.Server, nfs.Path, nfs.ReadOnly)
}

func printQuobyteVolumeSource(quobyte *corev1.QuobyteVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tQuobyte (a Quobyte mount on the host that shares a pod's lifetime)\n"+
		"    Registry:\t%v\n"+
		"    Volume:\t%v\n"+
		"    ReadOnly:\t%v\n",
		quobyte.Registry, quobyte.Volume, quobyte.ReadOnly)
}

func printPortworxVolumeSource(pwxVolume *corev1.PortworxVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tPortworxVolume (a Portworx Volume resource)\n"+
		"    VolumeID:\t%v\n",
		pwxVolume.VolumeID)
}

func printISCSIVolumeSource(iscsi *corev1.ISCSIVolumeSource, w PrefixWriter) {
	initiator := "<none>"
	if iscsi.InitiatorName != nil {
		initiator = *iscsi.InitiatorName
	}
	w.Write(2, "Type:\tISCSI (an ISCSI Disk resource that is attached to a kubelet's host machine and then exposed to the pod)\n"+
		"    TargetPortal:\t%v\n"+
		"    IQN:\t%v\n"+
		"    Lun:\t%v\n"+
		"    ISCSIInterface\t%v\n"+
		"    FSType:\t%v\n"+
		"    ReadOnly:\t%v\n"+
		"    Portals:\t%v\n"+
		"    DiscoveryCHAPAuth:\t%v\n"+
		"    SessionCHAPAuth:\t%v\n"+
		"    SecretRef:\t%v\n"+
		"    InitiatorName:\t%v\n",
		iscsi.TargetPortal, iscsi.IQN, iscsi.Lun, iscsi.ISCSIInterface, iscsi.FSType, iscsi.ReadOnly, iscsi.Portals, iscsi.DiscoveryCHAPAuth, iscsi.SessionCHAPAuth, iscsi.SecretRef, initiator)
}

func printGlusterfsVolumeSource(glusterfs *corev1.GlusterfsVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tGlusterfs (a Glusterfs mount on the host that shares a pod's lifetime)\n"+
		"    EndpointsName:\t%v\n"+
		"    Path:\t%v\n"+
		"    ReadOnly:\t%v\n",
		glusterfs.EndpointsName, glusterfs.Path, glusterfs.ReadOnly)
}

func printPersistentVolumeClaimVolumeSource(claim *corev1.PersistentVolumeClaimVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tPersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)\n"+
		"    ClaimName:\t%v\n"+
		"    ReadOnly:\t%v\n",
		claim.ClaimName, claim.ReadOnly)
}

func printEphemeralVolumeSource(ephemeral *corev1.EphemeralVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tEphemeralVolume (an inline specification for a volume that gets created and deleted with the pod)\n")
	if ephemeral.VolumeClaimTemplate != nil {
		printPersistentVolumeClaim(NewNestedPrefixWriter(w, 2),
			&corev1.PersistentVolumeClaim{
				ObjectMeta: ephemeral.VolumeClaimTemplate.ObjectMeta,
				Spec:       ephemeral.VolumeClaimTemplate.Spec,
			}, false /* not a full PVC */)
	}
}

type nestedPrefixWriter struct {
	PrefixWriter
	indent int
}

var _ PrefixWriter = &prefixWriter{}

// NewPrefixWriter creates a new PrefixWriter.
func NewNestedPrefixWriter(out PrefixWriter, indent int) PrefixWriter {
	return &nestedPrefixWriter{PrefixWriter: out, indent: indent}
}

func (npw *nestedPrefixWriter) Write(level int, format string, a ...interface{}) {
	npw.PrefixWriter.Write(level+npw.indent, format, a...)
}

func (npw *nestedPrefixWriter) WriteLine(a ...interface{}) {
	npw.PrefixWriter.Write(npw.indent, "%s", fmt.Sprintln(a...))
}

// printPersistentVolumeClaim is used for both PVCs and PersistentVolumeClaimTemplate. For the latter,
// we need to skip some fields which have no meaning.
func printPersistentVolumeClaim(w PrefixWriter, pvc *corev1.PersistentVolumeClaim, isFullPVC bool) {
	if isFullPVC {
		w.Write(0, "Name:\t%s\n", pvc.Name)
		w.Write(0, "Namespace:\t%s\n", pvc.Namespace)
	}
	w.Write(0, "StorageClass:\t%s\n", GetPersistentVolumeClaimClass(pvc))
	if isFullPVC {
		if pvc.ObjectMeta.DeletionTimestamp != nil {
			w.Write(0, "Status:\tTerminating (lasts %s)\n", translateTimestampSince(*pvc.ObjectMeta.DeletionTimestamp))
		} else {
			w.Write(0, "Status:\t%v\n", pvc.Status.Phase)
		}
	}
	w.Write(0, "Volume:\t%s\n", pvc.Spec.VolumeName)
	printLabelsMultiline(w, "Labels", pvc.Labels)
	printAnnotationsMultiline(w, "Annotations", pvc.Annotations)
	if isFullPVC {
		w.Write(0, "Finalizers:\t%v\n", pvc.ObjectMeta.Finalizers)
	}
	storage := pvc.Spec.Resources.Requests[corev1.ResourceStorage]
	capacity := ""
	accessModes := ""
	if pvc.Spec.VolumeName != "" {
		accessModes = GetAccessModesAsString(pvc.Status.AccessModes)
		storage = pvc.Status.Capacity[corev1.ResourceStorage]
		capacity = storage.String()
	}
	w.Write(0, "Capacity:\t%s\n", capacity)
	w.Write(0, "Access Modes:\t%s\n", accessModes)
	if pvc.Spec.VolumeMode != nil {
		w.Write(0, "VolumeMode:\t%v\n", *pvc.Spec.VolumeMode)
	}
	if pvc.Spec.DataSource != nil {
		w.Write(0, "DataSource:\n")
		if pvc.Spec.DataSource.APIGroup != nil {
			w.Write(1, "APIGroup:\t%v\n", *pvc.Spec.DataSource.APIGroup)
		}
		w.Write(1, "Kind:\t%v\n", pvc.Spec.DataSource.Kind)
		w.Write(1, "Name:\t%v\n", pvc.Spec.DataSource.Name)
	}
}

func printRBDVolumeSource(rbd *corev1.RBDVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tRBD (a Rados Block Device mount on the host that shares a pod's lifetime)\n"+
		"    CephMonitors:\t%v\n"+
		"    RBDImage:\t%v\n"+
		"    FSType:\t%v\n"+
		"    RBDPool:\t%v\n"+
		"    RadosUser:\t%v\n"+
		"    Keyring:\t%v\n"+
		"    SecretRef:\t%v\n"+
		"    ReadOnly:\t%v\n",
		rbd.CephMonitors, rbd.RBDImage, rbd.FSType, rbd.RBDPool, rbd.RadosUser, rbd.Keyring, rbd.SecretRef, rbd.ReadOnly)
}

func printDownwardAPIVolumeSource(d *corev1.DownwardAPIVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tDownwardAPI (a volume populated by information about the pod)\n    Items:\n")
	for _, mapping := range d.Items {
		if mapping.FieldRef != nil {
			w.Write(3, "%v -> %v\n", mapping.FieldRef.FieldPath, mapping.Path)
		}
		if mapping.ResourceFieldRef != nil {
			w.Write(3, "%v -> %v\n", mapping.ResourceFieldRef.Resource, mapping.Path)
		}
	}
}

func printAzureDiskVolumeSource(d *corev1.AzureDiskVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tAzureDisk (an Azure Data Disk mount on the host and bind mount to the pod)\n"+
		"    DiskName:\t%v\n"+
		"    DiskURI:\t%v\n"+
		"    Kind: \t%v\n"+
		"    FSType:\t%v\n"+
		"    CachingMode:\t%v\n"+
		"    ReadOnly:\t%v\n",
		d.DiskName, d.DataDiskURI, *d.Kind, *d.FSType, *d.CachingMode, *d.ReadOnly)
}

func printVsphereVolumeSource(vsphere *corev1.VsphereVirtualDiskVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tvSphereVolume (a Persistent Disk resource in vSphere)\n"+
		"    VolumePath:\t%v\n"+
		"    FSType:\t%v\n"+
		"    StoragePolicyName:\t%v\n",
		vsphere.VolumePath, vsphere.FSType, vsphere.StoragePolicyName)
}

func printPhotonPersistentDiskVolumeSource(photon *corev1.PhotonPersistentDiskVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tPhotonPersistentDisk (a Persistent Disk resource in photon platform)\n"+
		"    PdID:\t%v\n"+
		"    FSType:\t%v\n",
		photon.PdID, photon.FSType)
}

func printCinderVolumeSource(cinder *corev1.CinderVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tCinder (a Persistent Disk resource in OpenStack)\n"+
		"    VolumeID:\t%v\n"+
		"    FSType:\t%v\n"+
		"    ReadOnly:\t%v\n"+
		"    SecretRef:\t%v\n",
		cinder.VolumeID, cinder.FSType, cinder.ReadOnly, cinder.SecretRef)
}

func printScaleIOVolumeSource(sio *corev1.ScaleIOVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tScaleIO (a persistent volume backed by a block device in ScaleIO)\n"+
		"    Gateway:\t%v\n"+
		"    System:\t%v\n"+
		"    Protection Domain:\t%v\n"+
		"    Storage Pool:\t%v\n"+
		"    Storage Mode:\t%v\n"+
		"    VolumeName:\t%v\n"+
		"    FSType:\t%v\n"+
		"    ReadOnly:\t%v\n",
		sio.Gateway, sio.System, sio.ProtectionDomain, sio.StoragePool, sio.StorageMode, sio.VolumeName, sio.FSType, sio.ReadOnly)
}

func printCephFSVolumeSource(cephfs *corev1.CephFSVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tCephFS (a CephFS mount on the host that shares a pod's lifetime)\n"+
		"    Monitors:\t%v\n"+
		"    Path:\t%v\n"+
		"    User:\t%v\n"+
		"    SecretFile:\t%v\n"+
		"    SecretRef:\t%v\n"+
		"    ReadOnly:\t%v\n",
		cephfs.Monitors, cephfs.Path, cephfs.User, cephfs.SecretFile, cephfs.SecretRef, cephfs.ReadOnly)
}

func printStorageOSVolumeSource(storageos *corev1.StorageOSVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tStorageOS (a StorageOS Persistent Disk resource)\n"+
		"    VolumeName:\t%v\n"+
		"    VolumeNamespace:\t%v\n"+
		"    FSType:\t%v\n"+
		"    ReadOnly:\t%v\n",
		storageos.VolumeName, storageos.VolumeNamespace, storageos.FSType, storageos.ReadOnly)
}

func printFCVolumeSource(fc *corev1.FCVolumeSource, w PrefixWriter) {
	lun := "<none>"
	if fc.Lun != nil {
		lun = strconv.Itoa(int(*fc.Lun))
	}
	w.Write(2, "Type:\tFC (a Fibre Channel disk)\n"+
		"    TargetWWNs:\t%v\n"+
		"    LUN:\t%v\n"+
		"    FSType:\t%v\n"+
		"    ReadOnly:\t%v\n",
		strings.Join(fc.TargetWWNs, ", "), lun, fc.FSType, fc.ReadOnly)
}

func printAzureFileVolumeSource(azureFile *corev1.AzureFileVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tAzureFile (an Azure File Service mount on the host and bind mount to the pod)\n"+
		"    SecretName:\t%v\n"+
		"    ShareName:\t%v\n"+
		"    ReadOnly:\t%v\n",
		azureFile.SecretName, azureFile.ShareName, azureFile.ReadOnly)
}

func printFlexVolumeSource(flex *corev1.FlexVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tFlexVolume (a generic volume resource that is provisioned/attached using an exec based plugin)\n"+
		"    Driver:\t%v\n"+
		"    FSType:\t%v\n"+
		"    SecretRef:\t%v\n"+
		"    ReadOnly:\t%v\n"+
		"    Options:\t%v\n",
		flex.Driver, flex.FSType, flex.SecretRef, flex.ReadOnly, flex.Options)
}

func printFlockerVolumeSource(flocker *corev1.FlockerVolumeSource, w PrefixWriter) {
	w.Write(2, "Type:\tFlocker (a Flocker volume mounted by the Flocker agent)\n"+
		"    DatasetName:\t%v\n"+
		"    DatasetUUID:\t%v\n",
		flocker.DatasetName, flocker.DatasetUUID)
}

func printCSIVolumeSource(csi *corev1.CSIVolumeSource, w PrefixWriter) {
	var readOnly bool
	var fsType string
	if csi.ReadOnly != nil && *csi.ReadOnly {
		readOnly = true
	}
	if csi.FSType != nil {
		fsType = *csi.FSType
	}
	w.Write(2, "Type:\tCSI (a Container Storage Interface (CSI) volume source)\n"+
		"    Driver:\t%v\n"+
		"    FSType:\t%v\n"+
		"    ReadOnly:\t%v\n",
		csi.Driver, fsType, readOnly)
	printCSIPersistentVolumeAttributesMultiline(w, "VolumeAttributes", csi.VolumeAttributes)
}

func printCSIPersistentVolumeAttributesMultiline(w PrefixWriter, title string, annotations map[string]string) {
	printCSIPersistentVolumeAttributesMultilineIndent(w, "", title, "\t", annotations, sets.NewString())
}

func printCSIPersistentVolumeAttributesMultilineIndent(w PrefixWriter, initialIndent, title, innerIndent string, attributes map[string]string, skip sets.String) {
	w.Write(2, "%s%s:%s", initialIndent, title, innerIndent)

	if len(attributes) == 0 {
		w.WriteLine("<none>")
		return
	}

	// to print labels in the sorted order
	keys := make([]string, 0, len(attributes))
	for key := range attributes {
		if skip.Has(key) {
			continue
		}
		keys = append(keys, key)
	}
	if len(attributes) == 0 {
		w.WriteLine("<none>")
		return
	}
	sort.Strings(keys)

	for i, key := range keys {
		if i != 0 {
			w.Write(2, initialIndent)
			w.Write(2, innerIndent)
		}
		line := fmt.Sprintf("%s=%s", key, attributes[key])
		if len(line) > maxAnnotationLen {
			w.Write(2, "%s...\n", line[:maxAnnotationLen])
		} else {
			w.Write(2, "%s\n", line)
		}
	}
}

func describeContainers(label string, containers []corev1.Container, containerStatuses []corev1.ContainerStatus,
	resolverFn EnvVarResolverFunc, w PrefixWriter, space string) {
	statuses := map[string]corev1.ContainerStatus{}
	for _, status := range containerStatuses {
		statuses[status.Name] = status
	}

	describeContainersLabel(containers, label, space, w)

	for _, container := range containers {
		status, ok := statuses[container.Name]
		describeContainerBasicInfo(container, status, ok, space, w)
		describeContainerCommand(container, w)
		if ok {
			describeContainerState(status, w)
		}
		describeContainerResource(container, w)
		describeContainerProbe(container, w)
		if len(container.EnvFrom) > 0 {
			describeContainerEnvFrom(container, w)
		}
		describeContainerEnvVars(container, resolverFn, w)
		describeContainerVolumes(container, w)
	}
}

func describeContainersLabel(containers []corev1.Container, label, space string, w PrefixWriter) {
	none := ""
	if len(containers) == 0 {
		none = " <none>"
	}
	w.Write(0, "%s%s:%s\n", space, label, none)
}

func describeContainerBasicInfo(container corev1.Container, status corev1.ContainerStatus, ok bool, space string, w PrefixWriter) {
	nameIndent := ""
	if len(space) > 0 {
		nameIndent = " "
	}
	w.Write(1, "%s%v:\n", nameIndent, container.Name)
	if ok {
		w.Write(2, "Container ID:\t%s\n", status.ContainerID)
	}
	w.Write(2, "Image:\t%s\n", container.Image)
	if ok {
		w.Write(2, "Image ID:\t%s\n", status.ImageID)
	}
	portString := describeContainerPorts(container.Ports)
	if strings.Contains(portString, ",") {
		w.Write(2, "Ports:\t%s\n", portString)
	} else {
		w.Write(2, "Port:\t%s\n", stringOrNone(portString))
	}
	hostPortString := describeContainerHostPorts(container.Ports)
	if strings.Contains(hostPortString, ",") {
		w.Write(2, "Host Ports:\t%s\n", hostPortString)
	} else {
		w.Write(2, "Host Port:\t%s\n", stringOrNone(hostPortString))
	}
}

func describeContainerPorts(cPorts []corev1.ContainerPort) string {
	ports := make([]string, 0, len(cPorts))
	for _, cPort := range cPorts {
		ports = append(ports, fmt.Sprintf("%d/%s", cPort.ContainerPort, cPort.Protocol))
	}
	return strings.Join(ports, ", ")
}

func describeContainerHostPorts(cPorts []corev1.ContainerPort) string {
	ports := make([]string, 0, len(cPorts))
	for _, cPort := range cPorts {
		ports = append(ports, fmt.Sprintf("%d/%s", cPort.HostPort, cPort.Protocol))
	}
	return strings.Join(ports, ", ")
}

func describeContainerCommand(container corev1.Container, w PrefixWriter) {
	if len(container.Command) > 0 {
		w.Write(2, "Command:\n")
		for _, c := range container.Command {
			for _, s := range strings.Split(c, "\n") {
				w.Write(3, "%s\n", s)
			}
		}
	}
	if len(container.Args) > 0 {
		w.Write(2, "Args:\n")
		for _, arg := range container.Args {
			for _, s := range strings.Split(arg, "\n") {
				w.Write(3, "%s\n", s)
			}
		}
	}
}

func describeContainerResource(container corev1.Container, w PrefixWriter) {
	resources := container.Resources
	if len(resources.Limits) > 0 {
		w.Write(2, "Limits:\n")
	}
	for _, name := range SortedResourceNames(resources.Limits) {
		quantity := resources.Limits[name]
		w.Write(3, "%s:\t%s\n", name, quantity.String())
	}

	if len(resources.Requests) > 0 {
		w.Write(2, "Requests:\n")
	}
	for _, name := range SortedResourceNames(resources.Requests) {
		quantity := resources.Requests[name]
		w.Write(3, "%s:\t%s\n", name, quantity.String())
	}
}

type SortableResourceNames []corev1.ResourceName

func (list SortableResourceNames) Len() int {
	return len(list)
}

func (list SortableResourceNames) Swap(i, j int) {
	list[i], list[j] = list[j], list[i]
}

func (list SortableResourceNames) Less(i, j int) bool {
	return list[i] < list[j]
}

// SortedResourceNames returns the sorted resource names of a resource list.
func SortedResourceNames(list corev1.ResourceList) []corev1.ResourceName {
	resources := make([]corev1.ResourceName, 0, len(list))
	for res := range list {
		resources = append(resources, res)
	}
	sort.Sort(SortableResourceNames(resources))
	return resources
}

func describeContainerState(status corev1.ContainerStatus, w PrefixWriter) {
	describeStatus("State", status.State, w)
	if status.LastTerminationState.Terminated != nil {
		describeStatus("Last State", status.LastTerminationState, w)
	}
	w.Write(2, "Ready:\t%v\n", printBool(status.Ready))
	w.Write(2, "Restart Count:\t%d\n", status.RestartCount)
}

func describeContainerProbe(container corev1.Container, w PrefixWriter) {
	if container.LivenessProbe != nil {
		probe := DescribeProbe(container.LivenessProbe)
		w.Write(2, "Liveness:\t%s\n", probe)
	}
	if container.ReadinessProbe != nil {
		probe := DescribeProbe(container.ReadinessProbe)
		w.Write(2, "Readiness:\t%s\n", probe)
	}
	if container.StartupProbe != nil {
		probe := DescribeProbe(container.StartupProbe)
		w.Write(2, "Startup:\t%s\n", probe)
	}
}

func describeContainerVolumes(container corev1.Container, w PrefixWriter) {
	// Show volumeMounts
	none := ""
	if len(container.VolumeMounts) == 0 {
		none = "\t<none>"
	}
	w.Write(2, "Mounts:%s\n", none)
	sort.Sort(SortableVolumeMounts(container.VolumeMounts))
	for _, mount := range container.VolumeMounts {
		flags := []string{}
		if mount.ReadOnly {
			flags = append(flags, "ro")
		} else {
			flags = append(flags, "rw")
		}
		if len(mount.SubPath) > 0 {
			flags = append(flags, fmt.Sprintf("path=%q", mount.SubPath))
		}
		w.Write(3, "%s from %s (%s)\n", mount.MountPath, mount.Name, strings.Join(flags, ","))
	}
	// Show volumeDevices if exists
	if len(container.VolumeDevices) > 0 {
		w.Write(2, "Devices:%s\n", none)
		sort.Sort(SortableVolumeDevices(container.VolumeDevices))
		for _, device := range container.VolumeDevices {
			w.Write(3, "%s from %s\n", device.DevicePath, device.Name)
		}
	}
}

func describeContainerEnvVars(container corev1.Container, resolverFn EnvVarResolverFunc, w PrefixWriter) {
	none := ""
	if len(container.Env) == 0 {
		none = "\t<none>"
	}
	w.Write(2, "Environment:%s\n", none)

	for _, e := range container.Env {
		if e.ValueFrom == nil {
			for i, s := range strings.Split(e.Value, "\n") {
				if i == 0 {
					w.Write(3, "%s:\t%s\n", e.Name, s)
				} else {
					w.Write(3, "\t%s\n", s)
				}
			}
			continue
		}

		switch {
		case e.ValueFrom.FieldRef != nil:
			var valueFrom string
			if resolverFn != nil {
				valueFrom = resolverFn(e)
			}
			w.Write(3, "%s:\t%s (%s:%s)\n", e.Name, valueFrom, e.ValueFrom.FieldRef.APIVersion, e.ValueFrom.FieldRef.FieldPath)
		case e.ValueFrom.ResourceFieldRef != nil:
			valueFrom, err := ExtractContainerResourceValue(e.ValueFrom.ResourceFieldRef, &container)
			if err != nil {
				valueFrom = ""
			}
			resource := e.ValueFrom.ResourceFieldRef.Resource
			if valueFrom == "0" && (resource == "limits.cpu" || resource == "limits.memory") {
				valueFrom = "node allocatable"
			}
			w.Write(3, "%s:\t%s (%s)\n", e.Name, valueFrom, resource)
		case e.ValueFrom.SecretKeyRef != nil:
			optional := e.ValueFrom.SecretKeyRef.Optional != nil && *e.ValueFrom.SecretKeyRef.Optional
			w.Write(3, "%s:\t<set to the key '%s' in secret '%s'>\tOptional: %t\n", e.Name, e.ValueFrom.SecretKeyRef.Key, e.ValueFrom.SecretKeyRef.Name, optional)
		case e.ValueFrom.ConfigMapKeyRef != nil:
			optional := e.ValueFrom.ConfigMapKeyRef.Optional != nil && *e.ValueFrom.ConfigMapKeyRef.Optional
			w.Write(3, "%s:\t<set to the key '%s' of config map '%s'>\tOptional: %t\n", e.Name, e.ValueFrom.ConfigMapKeyRef.Key, e.ValueFrom.ConfigMapKeyRef.Name, optional)
		}
	}
}

// ExtractContainerResourceValue extracts the value of a resource
// in an already known container
func ExtractContainerResourceValue(fs *corev1.ResourceFieldSelector, container *corev1.Container) (string, error) {
	divisor := resource.Quantity{}
	if divisor.Cmp(fs.Divisor) == 0 {
		divisor = resource.MustParse("1")
	} else {
		divisor = fs.Divisor
	}

	switch fs.Resource {
	case "limits.cpu":
		return convertResourceCPUToString(container.Resources.Limits.Cpu(), divisor)
	case "limits.memory":
		return convertResourceMemoryToString(container.Resources.Limits.Memory(), divisor)
	case "limits.ephemeral-storage":
		return convertResourceEphemeralStorageToString(container.Resources.Limits.StorageEphemeral(), divisor)
	case "requests.cpu":
		return convertResourceCPUToString(container.Resources.Requests.Cpu(), divisor)
	case "requests.memory":
		return convertResourceMemoryToString(container.Resources.Requests.Memory(), divisor)
	case "requests.ephemeral-storage":
		return convertResourceEphemeralStorageToString(container.Resources.Requests.StorageEphemeral(), divisor)
	}
	// handle extended standard resources with dynamic names
	// example: requests.hugepages-<pageSize> or limits.hugepages-<pageSize>
	if strings.HasPrefix(fs.Resource, "requests.") {
		resourceName := corev1.ResourceName(strings.TrimPrefix(fs.Resource, "requests."))
		if IsHugePageResourceName(resourceName) {
			return convertResourceHugePagesToString(container.Resources.Requests.Name(resourceName, resource.BinarySI), divisor)
		}
	}
	if strings.HasPrefix(fs.Resource, "limits.") {
		resourceName := corev1.ResourceName(strings.TrimPrefix(fs.Resource, "limits."))
		if IsHugePageResourceName(resourceName) {
			return convertResourceHugePagesToString(container.Resources.Limits.Name(resourceName, resource.BinarySI), divisor)
		}
	}
	return "", fmt.Errorf("Unsupported container resource : %v", fs.Resource)
}

// convertResourceCPUToString converts cpu value to the format of divisor and returns
// ceiling of the value.
func convertResourceCPUToString(cpu *resource.Quantity, divisor resource.Quantity) (string, error) {
	c := int64(math.Ceil(float64(cpu.MilliValue()) / float64(divisor.MilliValue())))
	return strconv.FormatInt(c, 10), nil
}

// convertResourceMemoryToString converts memory value to the format of divisor and returns
// ceiling of the value.
func convertResourceMemoryToString(memory *resource.Quantity, divisor resource.Quantity) (string, error) {
	m := int64(math.Ceil(float64(memory.Value()) / float64(divisor.Value())))
	return strconv.FormatInt(m, 10), nil
}

// convertResourceHugePagesToString converts hugepages value to the format of divisor and returns
// ceiling of the value.
func convertResourceHugePagesToString(hugePages *resource.Quantity, divisor resource.Quantity) (string, error) {
	m := int64(math.Ceil(float64(hugePages.Value()) / float64(divisor.Value())))
	return strconv.FormatInt(m, 10), nil
}

// convertResourceEphemeralStorageToString converts ephemeral storage value to the format of divisor and returns
// ceiling of the value.
func convertResourceEphemeralStorageToString(ephemeralStorage *resource.Quantity, divisor resource.Quantity) (string, error) {
	m := int64(math.Ceil(float64(ephemeralStorage.Value()) / float64(divisor.Value())))
	return strconv.FormatInt(m, 10), nil
}

// IsHugePageResourceName returns true if the resource name has the huge page
// resource prefix.
func IsHugePageResourceName(name corev1.ResourceName) bool {
	return strings.HasPrefix(string(name), corev1.ResourceHugePagesPrefix)
}

func describeContainerEnvFrom(container corev1.Container, w PrefixWriter) {
	none := ""
	if len(container.EnvFrom) == 0 {
		none = "\t<none>"
	}
	w.Write(2, "Environment Variables from:%s\n", none)

	for _, e := range container.EnvFrom {
		from := ""
		name := ""
		optional := false
		if e.ConfigMapRef != nil {
			from = "ConfigMap"
			name = e.ConfigMapRef.Name
			optional = e.ConfigMapRef.Optional != nil && *e.ConfigMapRef.Optional
		} else if e.SecretRef != nil {
			from = "Secret"
			name = e.SecretRef.Name
			optional = e.SecretRef.Optional != nil && *e.SecretRef.Optional
		}
		if len(e.Prefix) == 0 {
			w.Write(3, "%s\t%s\tOptional: %t\n", name, from, optional)
		} else {
			w.Write(3, "%s\t%s with prefix '%s'\tOptional: %t\n", name, from, e.Prefix, optional)
		}
	}
}

// DescribeProbe is exported for consumers in other API groups that have probes
func DescribeProbe(probe *corev1.Probe) string {
	attrs := fmt.Sprintf("delay=%ds timeout=%ds period=%ds #success=%d #failure=%d", probe.InitialDelaySeconds, probe.TimeoutSeconds, probe.PeriodSeconds, probe.SuccessThreshold, probe.FailureThreshold)
	switch {
	case probe.Exec != nil:
		return fmt.Sprintf("exec %v %s", probe.Exec.Command, attrs)
	case probe.HTTPGet != nil:
		url := &url.URL{}
		url.Scheme = strings.ToLower(string(probe.HTTPGet.Scheme))
		if len(probe.HTTPGet.Port.String()) > 0 {
			url.Host = net.JoinHostPort(probe.HTTPGet.Host, probe.HTTPGet.Port.String())
		} else {
			url.Host = probe.HTTPGet.Host
		}
		url.Path = probe.HTTPGet.Path
		return fmt.Sprintf("http-get %s %s", url.String(), attrs)
	case probe.TCPSocket != nil:
		return fmt.Sprintf("tcp-socket %s:%s %s", probe.TCPSocket.Host, probe.TCPSocket.Port.String(), attrs)

	case probe.GRPC != nil:
		return fmt.Sprintf("grpc <pod>:%d %s %s", probe.GRPC.Port, *(probe.GRPC.Service), attrs)
	}
	return fmt.Sprintf("unknown %s", attrs)
}

// Scheme is the default instance of runtime.Scheme to which types in the Kubernetes API are already registered.
var Scheme = runtime.NewScheme()

type EnvVarResolverFunc func(e corev1.EnvVar) string

// EnvValueFrom is exported for use by describers in other packages
func EnvValueRetriever(pod *corev1.Pod) EnvVarResolverFunc {
	return func(e corev1.EnvVar) string {
		gv, err := schema.ParseGroupVersion(e.ValueFrom.FieldRef.APIVersion)
		if err != nil {
			return ""
		}
		gvk := gv.WithKind("Pod")
		internalFieldPath, _, err := Scheme.ConvertFieldLabel(gvk, e.ValueFrom.FieldRef.FieldPath, "")
		if err != nil {
			return "" // pod validation should catch this on create
		}

		valueFrom, err := ExtractFieldPathAsString(pod, internalFieldPath)
		if err != nil {
			return "" // pod validation should catch this on create
		}

		return valueFrom
	}
}

// FormatMap formats map[string]string to a string.
func FormatMap(m map[string]string) (fmtStr string) {
	// output with keys in sorted order to provide stable output
	keys := sets.NewString()
	for key := range m {
		keys.Insert(key)
	}
	for _, key := range keys.List() {
		fmtStr += fmt.Sprintf("%v=%q\n", key, m[key])
	}
	fmtStr = strings.TrimSuffix(fmtStr, "\n")

	return
}

// ExtractFieldPathAsString extracts the field from the given object
// and returns it as a string.  The object must be a pointer to an
// API type.
func ExtractFieldPathAsString(obj interface{}, fieldPath string) (string, error) {
	accessor, err := meta.Accessor(obj)
	if err != nil {
		return "", nil
	}

	if path, subscript, ok := SplitMaybeSubscriptedPath(fieldPath); ok {
		switch path {
		case "metadata.annotations":
			if errs := validation.IsQualifiedName(strings.ToLower(subscript)); len(errs) != 0 {
				return "", fmt.Errorf("invalid key subscript in %s: %s", fieldPath, strings.Join(errs, ";"))
			}
			return accessor.GetAnnotations()[subscript], nil
		case "metadata.labels":
			if errs := validation.IsQualifiedName(subscript); len(errs) != 0 {
				return "", fmt.Errorf("invalid key subscript in %s: %s", fieldPath, strings.Join(errs, ";"))
			}
			return accessor.GetLabels()[subscript], nil
		default:
			return "", fmt.Errorf("fieldPath %q does not support subscript", fieldPath)
		}
	}

	switch fieldPath {
	case "metadata.annotations":
		return FormatMap(accessor.GetAnnotations()), nil
	case "metadata.labels":
		return FormatMap(accessor.GetLabels()), nil
	case "metadata.name":
		return accessor.GetName(), nil
	case "metadata.namespace":
		return accessor.GetNamespace(), nil
	case "metadata.uid":
		return string(accessor.GetUID()), nil
	}

	return "", fmt.Errorf("unsupported fieldPath: %v", fieldPath)
}

// SplitMaybeSubscriptedPath checks whether the specified fieldPath is
// subscripted, and
//  - if yes, this function splits the fieldPath into path and subscript, and
//    returns (path, subscript, true).
//  - if no, this function returns (fieldPath, "", false).
//
// Example inputs and outputs:
//  - "metadata.annotations['myKey']" --> ("metadata.annotations", "myKey", true)
//  - "metadata.annotations['a[b]c']" --> ("metadata.annotations", "a[b]c", true)
//  - "metadata.labels['']"           --> ("metadata.labels", "", true)
//  - "metadata.labels"               --> ("metadata.labels", "", false)
func SplitMaybeSubscriptedPath(fieldPath string) (string, string, bool) {
	if !strings.HasSuffix(fieldPath, "']") {
		return fieldPath, "", false
	}
	s := strings.TrimSuffix(fieldPath, "']")
	parts := strings.SplitN(s, "['", 2)
	if len(parts) < 2 {
		return fieldPath, "", false
	}
	if len(parts[0]) == 0 {
		return fieldPath, "", false
	}
	return parts[0], parts[1], true
}

func describeStatus(stateName string, state corev1.ContainerState, w PrefixWriter) {
	switch {
	case state.Running != nil:
		w.Write(2, "%s:\tRunning\n", stateName)
		w.Write(3, "Started:\t%v\n", state.Running.StartedAt.Time.Format(time.RFC1123Z))
	case state.Waiting != nil:
		w.Write(2, "%s:\tWaiting\n", stateName)
		if state.Waiting.Reason != "" {
			w.Write(3, "Reason:\t%s\n", state.Waiting.Reason)
		}
	case state.Terminated != nil:
		w.Write(2, "%s:\tTerminated\n", stateName)
		if state.Terminated.Reason != "" {
			w.Write(3, "Reason:\t%s\n", state.Terminated.Reason)
		}
		if state.Terminated.Message != "" {
			w.Write(3, "Message:\t%s\n", state.Terminated.Message)
		}
		w.Write(3, "Exit Code:\t%d\n", state.Terminated.ExitCode)
		if state.Terminated.Signal > 0 {
			w.Write(3, "Signal:\t%d\n", state.Terminated.Signal)
		}
		w.Write(3, "Started:\t%s\n", state.Terminated.StartedAt.Time.Format(time.RFC1123Z))
		w.Write(3, "Finished:\t%s\n", state.Terminated.FinishedAt.Time.Format(time.RFC1123Z))
	default:
		w.Write(2, "%s:\tWaiting\n", stateName)
	}
}

// GetAccessModesAsString returns a string representation of an array of access modes.
// modes, when present, are always in the same order: RWO,ROX,RWX,RWOP.
func GetAccessModesAsString(modes []corev1.PersistentVolumeAccessMode) string {
	modes = removeDuplicateAccessModes(modes)
	modesStr := []string{}
	if ContainsAccessMode(modes, corev1.ReadWriteOnce) {
		modesStr = append(modesStr, "RWO")
	}
	if ContainsAccessMode(modes, corev1.ReadOnlyMany) {
		modesStr = append(modesStr, "ROX")
	}
	if ContainsAccessMode(modes, corev1.ReadWriteMany) {
		modesStr = append(modesStr, "RWX")
	}
	if ContainsAccessMode(modes, corev1.ReadWriteOncePod) {
		modesStr = append(modesStr, "RWOP")
	}
	return strings.Join(modesStr, ",")
}

// removeDuplicateAccessModes returns an array of access modes without any duplicates
func removeDuplicateAccessModes(modes []corev1.PersistentVolumeAccessMode) []corev1.PersistentVolumeAccessMode {
	accessModes := []corev1.PersistentVolumeAccessMode{}
	for _, m := range modes {
		if !ContainsAccessMode(accessModes, m) {
			accessModes = append(accessModes, m)
		}
	}
	return accessModes
}

func ContainsAccessMode(modes []corev1.PersistentVolumeAccessMode, mode corev1.PersistentVolumeAccessMode) bool {
	for _, m := range modes {
		if m == mode {
			return true
		}
	}
	return false
}

// GetPersistentVolumeClaimClass returns StorageClassName. If no storage class was
// requested, it returns "".
func GetPersistentVolumeClaimClass(claim *corev1.PersistentVolumeClaim) string {
	// Use beta annotation first
	if class, found := claim.Annotations[corev1.BetaStorageClassAnnotation]; found {
		return class
	}

	if claim.Spec.StorageClassName != nil {
		return *claim.Spec.StorageClassName
	}

	return ""
}

func printBool(value bool) string {
	if value {
		return "True"
	}

	return "False"
}

// printPodTolerationsMultiline prints multiple tolerations with a proper alignment.
func printPodTolerationsMultiline(w PrefixWriter, title string, tolerations []corev1.Toleration) {
	printTolerationsMultilineWithIndent(w, "", title, "\t", tolerations)
}

// printTolerationsMultilineWithIndent prints multiple tolerations with a user-defined alignment.
func printTolerationsMultilineWithIndent(w PrefixWriter, initialIndent, title, innerIndent string, tolerations []corev1.Toleration) {
	w.Write(0, "%s%s:%s", initialIndent, title, innerIndent)

	if len(tolerations) == 0 {
		w.WriteLine("<none>")
		return
	}

	// to print tolerations in the sorted order
	sort.Slice(tolerations, func(i, j int) bool {
		return tolerations[i].Key < tolerations[j].Key
	})

	for i, toleration := range tolerations {
		if i != 0 {
			w.Write(0, "%s", initialIndent)
			w.Write(0, "%s", innerIndent)
		}
		w.Write(0, "%s", toleration.Key)
		if len(toleration.Value) != 0 {
			w.Write(0, "=%s", toleration.Value)
		}
		if len(toleration.Effect) != 0 {
			w.Write(0, ":%s", toleration.Effect)
		}
		// tolerations:
		// - operator: "Exists"
		// is a special case which tolerates everything
		if toleration.Operator == corev1.TolerationOpExists && len(toleration.Value) == 0 {
			if len(toleration.Key) != 0 || len(toleration.Effect) != 0 {
				w.Write(0, " op=Exists")
			} else {
				w.Write(0, "op=Exists")
			}
		}

		if toleration.TolerationSeconds != nil {
			w.Write(0, " for %ds", *toleration.TolerationSeconds)
		}
		w.Write(0, "\n")
	}
}

var supportedQoSComputeResources = sets.NewString(string(corev1.ResourceCPU), string(corev1.ResourceMemory))

func isSupportedQoSComputeResource(name corev1.ResourceName) bool {
	return supportedQoSComputeResources.Has(string(name))
}

// GetPodQOS returns the QoS class of a pod.
// A pod is besteffort if none of its containers have specified any requests or limits.
// A pod is guaranteed only when requests and limits are specified for all the containers and they are equal.
// A pod is burstable if limits and requests do not match across all containers.
func getPodQOS(pod *corev1.Pod) corev1.PodQOSClass {
	requests := corev1.ResourceList{}
	limits := corev1.ResourceList{}
	zeroQuantity := resource.MustParse("0")
	isGuaranteed := true
	allContainers := []corev1.Container{}
	allContainers = append(allContainers, pod.Spec.Containers...)
	allContainers = append(allContainers, pod.Spec.InitContainers...)
	for _, container := range allContainers {
		// process requests
		for name, quantity := range container.Resources.Requests {
			if !isSupportedQoSComputeResource(name) {
				continue
			}
			if quantity.Cmp(zeroQuantity) == 1 {
				delta := quantity.DeepCopy()
				if _, exists := requests[name]; !exists {
					requests[name] = delta
				} else {
					delta.Add(requests[name])
					requests[name] = delta
				}
			}
		}
		// process limits
		qosLimitsFound := sets.NewString()
		for name, quantity := range container.Resources.Limits {
			if !isSupportedQoSComputeResource(name) {
				continue
			}
			if quantity.Cmp(zeroQuantity) == 1 {
				qosLimitsFound.Insert(string(name))
				delta := quantity.DeepCopy()
				if _, exists := limits[name]; !exists {
					limits[name] = delta
				} else {
					delta.Add(limits[name])
					limits[name] = delta
				}
			}
		}

		if !qosLimitsFound.HasAll(string(corev1.ResourceMemory), string(corev1.ResourceCPU)) {
			isGuaranteed = false
		}
	}
	if len(requests) == 0 && len(limits) == 0 {
		return corev1.PodQOSBestEffort
	}
	// Check is requests match limits for all resources.
	if isGuaranteed {
		for name, req := range requests {
			if lim, exists := limits[name]; !exists || lim.Cmp(req) != 0 {
				isGuaranteed = false
				break
			}
		}
	}
	if isGuaranteed &&
		len(requests) == len(limits) {
		return corev1.PodQOSGuaranteed
	}
	return corev1.PodQOSBurstable
}
