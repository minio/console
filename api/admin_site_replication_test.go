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

// These tests are for AdminAPI Tag based on swagger-console.yml

package api

import (
	"context"
	"fmt"
	"testing"

	"github.com/minio/madmin-go/v3"
	"github.com/stretchr/testify/assert"
)

func TestGetSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := AdminClientMock{}

	function := "getSiteReplicationInfo()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	retValueMock := madmin.SiteReplicationInfo{
		Enabled: true,
		Name:    "site1",
		Sites: []madmin.PeerInfo{
			{
				Endpoint:     "http://localhost:9000",
				Name:         "site1",
				DeploymentID: "12345",
			},
			{
				Endpoint:     "http://localhost:9001",
				Name:         "site2",
				DeploymentID: "123456",
			},
		},
		ServiceAccountAccessKey: "test-key",
	}

	expValueMock := &madmin.SiteReplicationInfo{
		Enabled: true,
		Name:    "site1",
		Sites: []madmin.PeerInfo{
			{
				Endpoint:     "http://localhost:9000",
				Name:         "site1",
				DeploymentID: "12345",
			},
			{
				Endpoint:     "http://localhost:9001",
				Name:         "site2",
				DeploymentID: "123456",
			},
		},
		ServiceAccountAccessKey: "test-key",
	}

	getSiteReplicationInfo = func(_ context.Context) (info *madmin.SiteReplicationInfo, err error) {
		return &retValueMock, nil
	}

	srInfo, err := adminClient.getSiteReplicationInfo(ctx)
	assert.Nil(err)
	assert.Equal(expValueMock, srInfo, fmt.Sprintf("Failed on %s: length of lists is not the same", function))
}

func TestAddSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := AdminClientMock{}

	function := "addSiteReplicationInfo()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	retValueMock := &madmin.ReplicateAddStatus{
		Success:                 true,
		Status:                  "success",
		ErrDetail:               "",
		InitialSyncErrorMessage: "",
	}

	expValueMock := &madmin.ReplicateAddStatus{
		Success:                 true,
		Status:                  "success",
		ErrDetail:               "",
		InitialSyncErrorMessage: "",
	}

	addSiteReplicationInfo = func(_ context.Context, _ []madmin.PeerSite) (res *madmin.ReplicateAddStatus, err error) {
		return retValueMock, nil
	}

	sites := []madmin.PeerSite{
		{
			Name:      "site1",
			Endpoint:  "http://localhost:9000",
			AccessKey: "test",
			SecretKey: "test",
		},
		{
			Name:      "site2",
			Endpoint:  "http://localhost:9001",
			AccessKey: "test",
			SecretKey: "test",
		},
	}

	srInfo, err := adminClient.addSiteReplicationInfo(ctx, sites, madmin.SRAddOptions{})
	assert.Nil(err)
	assert.Equal(expValueMock, srInfo, fmt.Sprintf("Failed on %s: length of lists is not the same", function))
}

func TestEditSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := AdminClientMock{}

	function := "editSiteReplicationInfo()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	retValueMock := &madmin.ReplicateEditStatus{
		Success:   true,
		Status:    "success",
		ErrDetail: "",
	}

	expValueMock := &madmin.ReplicateEditStatus{
		Success:   true,
		Status:    "success",
		ErrDetail: "",
	}

	editSiteReplicationInfo = func(_ context.Context, _ madmin.PeerInfo) (res *madmin.ReplicateEditStatus, err error) {
		return retValueMock, nil
	}

	site := madmin.PeerInfo{
		Name:         "",
		Endpoint:     "",
		DeploymentID: "12345",
	}

	srInfo, err := adminClient.editSiteReplicationInfo(ctx, site, madmin.SREditOptions{})
	assert.Nil(err)
	assert.Equal(expValueMock, srInfo, fmt.Sprintf("Failed on %s: length of lists is not the same", function))
}

func TestDeleteSiteReplicationInfo(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := AdminClientMock{}

	function := "deleteSiteReplicationInfo()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	retValueMock := &madmin.ReplicateRemoveStatus{
		Status:    "success",
		ErrDetail: "",
	}

	expValueMock := &madmin.ReplicateRemoveStatus{
		Status:    "success",
		ErrDetail: "",
	}

	deleteSiteReplicationInfoMock = func(_ context.Context, _ madmin.SRRemoveReq) (res *madmin.ReplicateRemoveStatus, err error) {
		return retValueMock, nil
	}

	remReq := madmin.SRRemoveReq{
		SiteNames: []string{
			"test1",
		},
		RemoveAll: false,
	}

	srInfo, err := adminClient.deleteSiteReplicationInfo(ctx, remReq)
	assert.Nil(err)
	assert.Equal(expValueMock, srInfo, fmt.Sprintf("Failed on %s: length of lists is not the same", function))
}

func TestSiteReplicationStatus(t *testing.T) {
	assert := assert.New(t)
	// mock minIO client
	adminClient := AdminClientMock{}

	function := "getSiteReplicationStatus()"
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	retValueMock := madmin.SRStatusInfo{
		Enabled:      true,
		MaxBuckets:   0,
		MaxUsers:     0,
		MaxGroups:    0,
		MaxPolicies:  0,
		Sites:        nil,
		StatsSummary: nil,
		BucketStats:  nil,
		PolicyStats:  nil,
		UserStats:    nil,
		GroupStats:   nil,
	}

	expValueMock := &madmin.SRStatusInfo{
		Enabled:      true,
		MaxBuckets:   0,
		MaxUsers:     0,
		MaxGroups:    0,
		MaxPolicies:  0,
		Sites:        nil,
		StatsSummary: nil,
		BucketStats:  nil,
		PolicyStats:  nil,
		UserStats:    nil,
		GroupStats:   nil,
	}

	getSiteReplicationStatus = func(_ context.Context, _ madmin.SRStatusOptions) (info *madmin.SRStatusInfo, err error) {
		return &retValueMock, nil
	}

	reqValues := madmin.SRStatusOptions{
		Buckets:  true,
		Policies: true,
		Users:    true,
		Groups:   true,
	}
	srInfo, err := adminClient.getSiteReplicationStatus(ctx, reqValues)
	if err != nil {
		assert.Error(err)
	}

	assert.Equal(expValueMock, srInfo, fmt.Sprintf("Failed on %s: expected result is not same", function))
}
