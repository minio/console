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

package operatorapi

import (
	"context"
	"errors"
	"sort"
	"strings"

	"github.com/minio/console/operatorapi/operations/operator_api"

	"github.com/minio/console/cluster"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/operatorapi/operations"
	directv1beta1apis "github.com/minio/direct-csi/pkg/apis/direct.csi.min.io/v1beta1"
	directv1beta2apis "github.com/minio/direct-csi/pkg/apis/direct.csi.min.io/v1beta2"
	directv1beta1 "github.com/minio/direct-csi/pkg/clientset/typed/direct.csi.min.io/v1beta1"
	directv1beta2 "github.com/minio/direct-csi/pkg/clientset/typed/direct.csi.min.io/v1beta2"
	"github.com/minio/direct-csi/pkg/sys"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/restmapper"
)

const XFS = "xfs"

func registerDirectCSIHandlers(api *operations.OperatorAPI) {
	api.OperatorAPIGetDirectCSIDriveListHandler = operator_api.GetDirectCSIDriveListHandlerFunc(func(params operator_api.GetDirectCSIDriveListParams, session *models.Principal) middleware.Responder {
		resp, err := getDirectCSIDrivesListResponse(session)
		if err != nil {
			return operator_api.NewGetDirectCSIDriveListDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewGetDirectCSIDriveListOK().WithPayload(resp)
	})
	api.OperatorAPIGetDirectCSIVolumeListHandler = operator_api.GetDirectCSIVolumeListHandlerFunc(func(params operator_api.GetDirectCSIVolumeListParams, session *models.Principal) middleware.Responder {
		resp, err := getDirectCSIVolumesListResponse(session)
		if err != nil {
			return operator_api.NewGetDirectCSIVolumeListDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewGetDirectCSIVolumeListOK().WithPayload(resp)
	})
	api.OperatorAPIDirectCSIFormatDriveHandler = operator_api.DirectCSIFormatDriveHandlerFunc(func(params operator_api.DirectCSIFormatDriveParams, session *models.Principal) middleware.Responder {
		resp, err := formatVolumesResponse(session, params)
		if err != nil {
			return operator_api.NewDirectCSIFormatDriveDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewDirectCSIFormatDriveOK().WithPayload(resp)
	})
}

// GetGroupKindVersions gets group/version/kind of given versions.
func getGroupKindVersions(discoveryClient *discovery.DiscoveryClient, group, kind string, versions ...string) (*schema.GroupVersionKind, error) {
	// discoveryClient := GetDiscoveryClient()
	apiGroupResources, err := restmapper.GetAPIGroupResources(discoveryClient)
	if err != nil {
		return nil, err
	}
	restMapper := restmapper.NewDiscoveryRESTMapper(apiGroupResources)
	gk := schema.GroupKind{
		Group: group,
		Kind:  kind,
	}
	mapper, err := restMapper.RESTMapping(gk, versions...)
	if err != nil {
		return nil, err
	}

	gvk := &schema.GroupVersionKind{
		Group:   mapper.Resource.Group,
		Version: mapper.Resource.Version,
		Kind:    mapper.Resource.Resource,
	}
	return gvk, nil
}

// getDirectCSIVolumesList returns direct-csi drives
func getDirectCSIDriveListv1beta2(ctx context.Context, clientset directv1beta2.DirectV1beta2Interface) (*models.GetDirectCSIDriveListResponse, error) {
	drivesList, err := clientset.DirectCSIDrives().List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	res := &models.GetDirectCSIDriveListResponse{}

	// implementation same as direct-csi `drives ls` command
	driveName := func(val string) string {
		dr := strings.ReplaceAll(val, sys.DirectCSIDevRoot+"/", "")
		dr = strings.ReplaceAll(dr, sys.HostDevRoot+"/", "")
		return strings.ReplaceAll(dr, sys.DirectCSIPartitionInfix, "")
	}
	drivesSorted := drivesList.Items
	// sort by nodename, path and status
	sort.Slice(drivesSorted, func(i, j int) bool {
		d1 := drivesSorted[i]
		d2 := drivesSorted[j]

		if v := strings.Compare(d1.Status.NodeName, d2.Status.NodeName); v != 0 {
			return v < 0
		}

		if v := strings.Compare(d1.Status.Path, d2.Status.Path); v != 0 {
			return v < 0
		}

		return strings.Compare(string(d1.Status.DriveStatus), string(d2.Status.DriveStatus)) < 0
	})
	for _, d := range drivesSorted {
		volumes := len(d.Finalizers)
		if volumes > 0 {
			volumes--
		}
		msg := ""
		for _, c := range d.Status.Conditions {
			if c.Type == string(directv1beta2apis.DirectCSIDriveConditionInitialized) {
				if c.Status != metav1.ConditionTrue {
					msg = c.Message
					continue
				}
			}
			if c.Type == string(directv1beta2apis.DirectCSIDriveConditionOwned) {
				if c.Status != metav1.ConditionTrue {
					msg = c.Message
					continue
				}
			}
		}
		dr := func(val string) string {
			dr := driveName(val)
			return strings.ReplaceAll("/dev/"+dr, sys.DirectCSIPartitionInfix, "")
		}(d.Status.Path)
		drStatus := d.Status.DriveStatus
		if msg != "" {
			drStatus = drStatus + "*"
			msg = strings.ReplaceAll(msg, d.Name, "")
			msg = strings.ReplaceAll(msg, sys.GetDirectCSIPath(d.Status.FilesystemUUID), dr)
			msg = strings.ReplaceAll(msg, sys.DirectCSIPartitionInfix, "")
			msg = strings.Split(msg, "\n")[0]
		}
		driveInfo := &models.DirectCSIDriveInfo{
			Drive:     dr,
			Capacity:  d.Status.TotalCapacity,
			Allocated: d.Status.AllocatedCapacity,
			Node:      d.Status.NodeName,
			Status:    string(drStatus),
			Message:   msg,
			Volumes:   int64(volumes),
		}
		res.Drives = append(res.Drives, driveInfo)
	}

	return res, nil
}

// getDirectCSIVolumesList returns direct-csi drives
func getDirectCSIDriveListv1beta1(ctx context.Context, clientset directv1beta1.DirectV1beta1Interface) (*models.GetDirectCSIDriveListResponse, error) {
	drivesList, err := clientset.DirectCSIDrives().List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	res := &models.GetDirectCSIDriveListResponse{}

	// implementation same as direct-csi `drives ls` command
	driveName := func(val string) string {
		dr := strings.ReplaceAll(val, sys.DirectCSIDevRoot+"/", "")
		dr = strings.ReplaceAll(dr, sys.HostDevRoot+"/", "")
		return strings.ReplaceAll(dr, sys.DirectCSIPartitionInfix, "")
	}
	drivesSorted := drivesList.Items
	// sort by nodename, path and status
	sort.Slice(drivesSorted, func(i, j int) bool {
		d1 := drivesSorted[i]
		d2 := drivesSorted[j]

		if v := strings.Compare(d1.Status.NodeName, d2.Status.NodeName); v != 0 {
			return v < 0
		}

		if v := strings.Compare(d1.Status.Path, d2.Status.Path); v != 0 {
			return v < 0
		}

		return strings.Compare(string(d1.Status.DriveStatus), string(d2.Status.DriveStatus)) < 0
	})
	for _, d := range drivesSorted {
		volumes := len(d.Finalizers)
		if volumes > 0 {
			volumes--
		}
		msg := ""
		for _, c := range d.Status.Conditions {
			if c.Type == string(directv1beta2apis.DirectCSIDriveConditionInitialized) {
				if c.Status != metav1.ConditionTrue {
					msg = c.Message
					continue
				}
			}
			if c.Type == string(directv1beta2apis.DirectCSIDriveConditionOwned) {
				if c.Status != metav1.ConditionTrue {
					msg = c.Message
					continue
				}
			}
		}
		dr := func(val string) string {
			dr := driveName(val)
			return strings.ReplaceAll("/dev/"+dr, sys.DirectCSIPartitionInfix, "")
		}(d.Status.Path)
		drStatus := d.Status.DriveStatus
		if msg != "" {
			drStatus = drStatus + "*"
			msg = strings.ReplaceAll(msg, d.Name, "")
			msg = strings.ReplaceAll(msg, sys.DirectCSIDevRoot, "/dev")
			msg = strings.ReplaceAll(msg, sys.DirectCSIPartitionInfix, "")
			msg = strings.Split(msg, "\n")[0]
		}
		driveInfo := &models.DirectCSIDriveInfo{
			Drive:     dr,
			Capacity:  d.Status.TotalCapacity,
			Allocated: d.Status.AllocatedCapacity,
			Node:      d.Status.NodeName,
			Status:    string(drStatus),
			Message:   msg,
			Volumes:   int64(volumes),
		}
		res.Drives = append(res.Drives, driveInfo)
	}

	return res, nil
}

func getDirectCSIDrivesListResponse(session *models.Principal) (*models.GetDirectCSIDriveListResponse, *models.Error) {
	ctx := context.Background()
	clientset, err := cluster.DirectCSIClientSet(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	gvk, err := getGroupKindVersions(clientset.DiscoveryClient, "direct.csi.min.io", "DirectCSIDrive", "v1beta2", "v1beta1")
	if err != nil {
		return nil, prepareError(err)
	}

	version := gvk.Version

	switch version {
	case "v1beta2":
		client, err := cluster.DirectCSIClientV1beta2(session.STSSessionToken)
		if err != nil {
			return nil, prepareError(err)
		}
		drives, err := getDirectCSIDriveListv1beta2(ctx, client)
		if err != nil {
			return nil, prepareError(err)
		}
		return drives, nil
	case "v1beta1":
		client, err := cluster.DirectCSIClientV1beta1(session.STSSessionToken)
		if err != nil {
			return nil, prepareError(err)
		}
		drives, err := getDirectCSIDriveListv1beta1(ctx, client)
		if err != nil {
			return nil, prepareError(err)
		}
		return drives, nil
	default:
		return nil, prepareError(errors.New("unsupported direct-csi version"))
	}
}

// getDirectCSIVolumesList returns direct-csi volumes
func getDirectCSIVolumesListv1beta2(ctx context.Context, clientset directv1beta2.DirectV1beta2Interface) (*models.GetDirectCSIVolumeListResponse, error) {
	drivesList, err := clientset.DirectCSIDrives().List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	volList, err := clientset.DirectCSIVolumes().List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	// implementation same as direct-csi `volumes ls` command
	drivePaths := map[string]string{}
	driveName := func(val string) string {
		dr := strings.ReplaceAll(val, sys.DirectCSIDevRoot+"/", "")
		return strings.ReplaceAll(dr, sys.HostDevRoot+"/", "")
	}

	for _, d := range drivesList.Items {
		drivePaths[d.Name] = driveName(d.Status.Path)
	}
	var volumes []*models.DirectCSIVolumeInfo
	for _, v := range volList.Items {
		vol := &models.DirectCSIVolumeInfo{
			Volume:   v.Name,
			Capacity: v.Status.TotalCapacity,
			Drive:    driveName(drivePaths[v.Status.Drive]),
			Node:     v.Status.NodeName,
		}

		volumes = append(volumes, vol)
	}

	res := &models.GetDirectCSIVolumeListResponse{
		Volumes: volumes,
	}
	return res, nil
}

func getDirectCSIVolumesListv1beta1(ctx context.Context, clientset directv1beta1.DirectV1beta1Interface) (*models.GetDirectCSIVolumeListResponse, error) {
	drivesList, err := clientset.DirectCSIDrives().List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	volList, err := clientset.DirectCSIVolumes().List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	// implementation same as direct-csi `volumes ls` command
	drivePaths := map[string]string{}
	driveName := func(val string) string {
		dr := strings.ReplaceAll(val, sys.DirectCSIDevRoot+"/", "")
		return strings.ReplaceAll(dr, sys.HostDevRoot+"/", "")
	}

	for _, d := range drivesList.Items {
		drivePaths[d.Name] = driveName(d.Status.Path)
	}
	var volumes []*models.DirectCSIVolumeInfo
	for _, v := range volList.Items {
		vol := &models.DirectCSIVolumeInfo{
			Volume:   v.Name,
			Capacity: v.Status.TotalCapacity,
			Drive:    driveName(drivePaths[v.Status.Drive]),
			Node:     v.Status.NodeName,
		}

		volumes = append(volumes, vol)
	}

	res := &models.GetDirectCSIVolumeListResponse{
		Volumes: volumes,
	}
	return res, nil
}

func getDirectCSIVolumesListResponse(session *models.Principal) (*models.GetDirectCSIVolumeListResponse, *models.Error) {
	ctx := context.Background()
	clientset, err := cluster.DirectCSIClientSet(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	gvk, err := getGroupKindVersions(clientset.DiscoveryClient, "direct.csi.min.io", "DirectCSIVolume", "v1beta2", "v1beta1")
	if err != nil {
		return nil, prepareError(err)
	}

	version := gvk.Version

	switch version {
	case "v1beta2":
		client, err := cluster.DirectCSIClientV1beta2(session.STSSessionToken)
		if err != nil {
			return nil, prepareError(err)
		}
		volumes, err := getDirectCSIVolumesListv1beta2(ctx, client)
		if err != nil {
			return nil, prepareError(err)
		}
		return volumes, nil
	case "v1beta1":
		client, err := cluster.DirectCSIClientV1beta1(session.STSSessionToken)
		if err != nil {
			return nil, prepareError(err)
		}
		volumes, err := getDirectCSIVolumesListv1beta1(ctx, client)
		if err != nil {
			return nil, prepareError(err)
		}
		return volumes, nil
	default:
		return nil, prepareError(errors.New("unsupported direct-csi version"))
	}
}

func formatDrivesv1beta1(ctx context.Context, clientset directv1beta1.DirectV1beta1Interface, drives []string, force bool) (*models.FormatDirectCSIDrivesResponse, error) {
	if len(drives) == 0 {
		return nil, errors.New("at least one drive needs to be set")
	}

	driveList, err := clientset.DirectCSIDrives().List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	driveName := func(val string) string {
		dr := strings.ReplaceAll(val, sys.DirectCSIDevRoot+"/", "")
		dr = strings.ReplaceAll(dr, sys.HostDevRoot+"/", "")
		return strings.ReplaceAll(dr, "-part-", "")
	}

	drivesArray := map[string]string{}

	for _, driveFromAPI := range drives {
		drivesArray[driveFromAPI] = driveFromAPI
	}

	if len(driveList.Items) == 0 {
		return nil, errors.New("no resources found globally")
	}

	var errors []*models.CsiFormatErrorResponse

	for _, driveItem := range driveList.Items {
		drName := "/dev/" + driveName(driveItem.Status.Path)
		driveName := driveItem.Status.NodeName + ":" + drName

		base := &models.CsiFormatErrorResponse{
			Node:  driveItem.Status.NodeName,
			Drive: drName,
			Error: "",
		}

		// Element is requested to be formatted
		if _, ok := drivesArray[driveName]; ok {
			if driveItem.Status.DriveStatus == directv1beta1apis.DriveStatusUnavailable {
				base.Error = "Status is unavailable"
				errors = append(errors, base)
				continue
			}

			if driveItem.Status.DriveStatus == directv1beta1apis.DriveStatusInUse {
				base.Error = "Drive in use. Cannot be formatted"
				errors = append(errors, base)
				continue
			}

			if driveItem.Status.DriveStatus == directv1beta1apis.DriveStatusReady {
				base.Error = "Drive already owned and managed"
				errors = append(errors, base)
				continue
			}

			if driveItem.Status.Filesystem != "" && !force {
				base.Error = "Drive already has a fs. Use force to overwrite"
				errors = append(errors, base)
				continue
			}

			// Validation passes, we request format
			driveItem.Spec.DirectCSIOwned = true
			driveItem.Spec.RequestedFormat = &directv1beta1apis.RequestedFormat{
				Filesystem: XFS,
				Force:      force,
			}

			_, err := clientset.DirectCSIDrives().Update(ctx, &driveItem, metav1.UpdateOptions{})
			if err != nil {
				base.Error = err.Error()
				errors = append(errors, base)
			}
		}
	}

	returnErrors := &models.FormatDirectCSIDrivesResponse{
		FormatIssuesList: errors,
	}

	return returnErrors, nil
}

func formatDrivesv1beta2(ctx context.Context, clientset directv1beta2.DirectV1beta2Interface, drives []string, force bool) (*models.FormatDirectCSIDrivesResponse, error) {
	if len(drives) == 0 {
		return nil, errors.New("at least one drive needs to be set")
	}

	driveList, err := clientset.DirectCSIDrives().List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	driveName := func(val string) string {
		dr := strings.ReplaceAll(val, sys.DirectCSIDevRoot+"/", "")
		dr = strings.ReplaceAll(dr, sys.HostDevRoot+"/", "")
		return strings.ReplaceAll(dr, "-part-", "")
	}

	drivesArray := map[string]string{}

	for _, driveFromAPI := range drives {
		drivesArray[driveFromAPI] = driveFromAPI
	}

	if len(driveList.Items) == 0 {
		return nil, errors.New("no resources found globally")
	}

	var errors []*models.CsiFormatErrorResponse

	for _, driveItem := range driveList.Items {
		drName := "/dev/" + driveName(driveItem.Status.Path)
		driveName := driveItem.Status.NodeName + ":" + drName

		base := &models.CsiFormatErrorResponse{
			Node:  driveItem.Status.NodeName,
			Drive: drName,
			Error: "",
		}

		// Element is requested to be formatted
		if _, ok := drivesArray[driveName]; ok {
			if driveItem.Status.DriveStatus == directv1beta2apis.DriveStatusUnavailable {
				base.Error = "Status is unavailable"
				errors = append(errors, base)
				continue
			}

			if driveItem.Status.DriveStatus == directv1beta2apis.DriveStatusInUse {
				base.Error = "Drive in use. Cannot be formatted"
				errors = append(errors, base)
				continue
			}

			if driveItem.Status.DriveStatus == directv1beta2apis.DriveStatusReady {
				base.Error = "Drive already owned and managed"
				errors = append(errors, base)
				continue
			}

			if driveItem.Status.Filesystem != "" && !force {
				base.Error = "Drive already has a fs. Use force to overwrite"
				errors = append(errors, base)
				continue
			}

			// Validation passes, we request format
			driveItem.Spec.DirectCSIOwned = true
			driveItem.Spec.RequestedFormat = &directv1beta2apis.RequestedFormat{
				Filesystem: XFS,
				Force:      force,
			}

			_, err := clientset.DirectCSIDrives().Update(ctx, &driveItem, metav1.UpdateOptions{})
			if err != nil {
				base.Error = err.Error()
				errors = append(errors, base)
			}
		}
	}

	returnErrors := &models.FormatDirectCSIDrivesResponse{
		FormatIssuesList: errors,
	}

	return returnErrors, nil
}

func formatVolumesResponse(session *models.Principal, params operator_api.DirectCSIFormatDriveParams) (*models.FormatDirectCSIDrivesResponse, *models.Error) {
	ctx := context.Background()
	clientset, err := cluster.DirectCSIClientSet(session.STSSessionToken)
	if err != nil {
		return nil, prepareError(err)
	}

	gvk, err := getGroupKindVersions(clientset.DiscoveryClient, "direct.csi.min.io", "DirectCSIDrive", "v1beta2", "v1beta1")
	if err != nil {
		return nil, prepareError(err)
	}

	version := gvk.Version

	switch version {
	case "v1beta2":
		client, err := cluster.DirectCSIClientV1beta2(session.STSSessionToken)
		if err != nil {
			return nil, prepareError(err)
		}
		formatResult, errFormat := formatDrivesv1beta2(ctx, client, params.Body.Drives, *params.Body.Force)
		if errFormat != nil {
			return nil, prepareError(errFormat)
		}
		return formatResult, nil
	case "v1beta1":
		client, err := cluster.DirectCSIClientV1beta1(session.STSSessionToken)
		if err != nil {
			return nil, prepareError(err)
		}
		formatResult, errFormat := formatDrivesv1beta1(ctx, client, params.Body.Drives, *params.Body.Force)
		if errFormat != nil {
			return nil, prepareError(errFormat)
		}
		return formatResult, nil
	default:
		return nil, prepareError(errors.New("unsupported direct-csi version"))
	}
}
