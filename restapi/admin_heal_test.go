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

package restapi

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
	"testing"
	"time"

	"github.com/minio/madmin-go"
	"github.com/stretchr/testify/assert"
)

// assigning mock at runtime instead of compile time
var minioHealMock func(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
	forceStart, forceStop bool) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error)

func (ac adminClientMock) heal(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
	forceStart, forceStop bool,
) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error) {
	return minioHealMock(ctx, bucket, prefix, healOpts, clientToken, forceStart, forceStop)
}

func TestHeal(t *testing.T) {
	assert := assert.New(t)

	client := adminClientMock{}
	mockWSConn := mockConn{}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	function := "startHeal()"
	mockResultItem1 := madmin.HealResultItem{
		Type:         madmin.HealItemObject,
		SetCount:     1,
		DiskCount:    4,
		ParityBlocks: 2,
		DataBlocks:   2,
		Before: struct {
			Drives []madmin.HealDriveInfo `json:"drives"`
		}{
			Drives: []madmin.HealDriveInfo{
				{
					State: madmin.DriveStateOk,
				},
				{
					State: madmin.DriveStateOk,
				},
				{
					State: madmin.DriveStateOk,
				},
				{
					State: madmin.DriveStateMissing,
				},
			},
		},
		After: struct {
			Drives []madmin.HealDriveInfo `json:"drives"`
		}{
			Drives: []madmin.HealDriveInfo{
				{
					State: madmin.DriveStateOk,
				},
				{
					State: madmin.DriveStateOk,
				},
				{
					State: madmin.DriveStateOk,
				},
				{
					State: madmin.DriveStateOk,
				},
			},
		},
	}
	mockResultItem2 := madmin.HealResultItem{
		Type:         madmin.HealItemBucket,
		SetCount:     1,
		DiskCount:    4,
		ParityBlocks: 2,
		DataBlocks:   2,
		Before: struct {
			Drives []madmin.HealDriveInfo `json:"drives"`
		}{
			Drives: []madmin.HealDriveInfo{
				{
					State: madmin.DriveStateOk,
				},
				{
					State: madmin.DriveStateOk,
				},
				{
					State: madmin.DriveStateOk,
				},
				{
					State: madmin.DriveStateMissing,
				},
			},
		},
		After: struct {
			Drives []madmin.HealDriveInfo `json:"drives"`
		}{
			Drives: []madmin.HealDriveInfo{
				{
					State: madmin.DriveStateOk,
				},
				{
					State: madmin.DriveStateOk,
				},
				{
					State: madmin.DriveStateOk,
				},
				{
					State: madmin.DriveStateOk,
				},
			},
		},
	}
	mockHealTaskStatus := madmin.HealTaskStatus{
		StartTime: time.Now().UTC().Truncate(time.Second * 2), // mock 2 sec duration
		Items: []madmin.HealResultItem{
			mockResultItem1,
			mockResultItem2,
		},
		Summary: "finished",
	}

	testStreamSize := 1
	testReceiver := make(chan healStatus, testStreamSize)
	isClosed := false // testReceiver is closed?

	testOptions := &healOptions{
		BucketName: "testbucket",
		Prefix:     "",
		ForceStart: false,
		ForceStop:  false,
	}
	// Test-1: startHeal send simple stream of data, no errors
	minioHealMock = func(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
		forceStart, forceStop bool,
	) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error) {
		return healStart, mockHealTaskStatus, nil
	}
	writesCount := 1
	// mock connection WriteMessage() no error
	connWriteMessageMock = func(messageType int, data []byte) error {
		// emulate that receiver gets the message written
		var t healStatus
		_ = json.Unmarshal(data, &t)
		testReceiver <- t
		if writesCount == testStreamSize {
			// for testing we need to close the receiver channel
			if !isClosed {
				close(testReceiver)
				isClosed = true
			}
			return nil
		}
		writesCount++
		return nil
	}
	if err := startHeal(ctx, mockWSConn, client, testOptions); err != nil {
		t.Errorf("Failed on %s:, error occurred: %s", function, err.Error())
	}
	// check that the TestReceiver got the same number of data from Console.
	for i := range testReceiver {
		assert.Equal(int64(1), i.ObjectsScanned)
		assert.Equal(int64(1), i.ObjectsHealed)
		assert.Equal(int64(2), i.ItemsScanned)
		assert.Equal(int64(2), i.ItemsHealed)
		assert.Equal(int64(0), i.HealthBeforeCols[colGreen])
		assert.Equal(int64(1), i.HealthBeforeCols[colYellow])
		assert.Equal(int64(1), i.HealthBeforeCols[colRed])
		assert.Equal(int64(0), i.HealthBeforeCols[colGrey])
		assert.Equal(int64(2), i.HealthAfterCols[colGreen])
		assert.Equal(int64(0), i.HealthAfterCols[colYellow])
		assert.Equal(int64(0), i.HealthAfterCols[colRed])
		assert.Equal(int64(0), i.HealthAfterCols[colGrey])
	}

	// Test-2: startHeal error on init
	minioHealMock = func(ctx context.Context, bucket, prefix string, healOpts madmin.HealOpts, clientToken string,
		forceStart, forceStop bool,
	) (healStart madmin.HealStartSuccess, healTaskStatus madmin.HealTaskStatus, err error) {
		return healStart, mockHealTaskStatus, errors.New("error")
	}

	if err := startHeal(ctx, mockWSConn, client, testOptions); assert.Error(err) {
		assert.Equal("error", err.Error())
	}

	// Test-3: getHealOptionsFromReq return heal options from request
	u, _ := url.Parse("http://localhost/api/v1/heal/bucket1?prefix=file/&recursive=true&force-start=true&force-stop=true&remove=true&dry-run=true&scan=deep")
	req := &http.Request{
		URL: u,
	}
	opts, err := getHealOptionsFromReq(req)
	if assert.NoError(err) {
		expectedOptions := healOptions{
			BucketName: "bucket1",
			ForceStart: true,
			ForceStop:  true,
			Prefix:     "file/",
			HealOpts: madmin.HealOpts{
				Recursive: true,
				DryRun:    true,
				ScanMode:  madmin.HealDeepScan,
			},
		}
		assert.Equal(expectedOptions.BucketName, opts.BucketName)
		assert.Equal(expectedOptions.Prefix, opts.Prefix)
		assert.Equal(expectedOptions.Recursive, opts.Recursive)
		assert.Equal(expectedOptions.ForceStart, opts.ForceStart)
		assert.Equal(expectedOptions.DryRun, opts.DryRun)
		assert.Equal(expectedOptions.ScanMode, opts.ScanMode)
	}

	// Test-4: getHealOptionsFromReq return error if boolean value not valid
	u, _ = url.Parse("http://localhost/api/v1/heal/bucket1?prefix=file/&recursive=nonbool&force-start=true&force-stop=true&remove=true&dry-run=true&scan=deep")
	req = &http.Request{
		URL: u,
	}
	opts, err = getHealOptionsFromReq(req)
	if assert.Error(err) {
		assert.Equal("strconv.ParseBool: parsing \"nonbool\": invalid syntax", err.Error())
	}
	// Test-5: getHealOptionsFromReq return error if boolean value not valid
	u, _ = url.Parse("http://localhost/api/v1/heal/bucket1?prefix=file/&recursive=true&force-start=true&force-stop=true&remove=nonbool&dry-run=true&scan=deep")
	req = &http.Request{
		URL: u,
	}
	opts, err = getHealOptionsFromReq(req)
	if assert.Error(err) {
		assert.Equal("strconv.ParseBool: parsing \"nonbool\": invalid syntax", err.Error())
	}
	// Test-6: getHealOptionsFromReq return error if boolean value not valid
	u, _ = url.Parse("http://localhost/api/v1/heal/bucket1?prefix=file/&recursive=true&force-start=nonbool&force-stop=true&remove=true&dry-run=true&scan=deep")
	req = &http.Request{
		URL: u,
	}
	opts, err = getHealOptionsFromReq(req)
	if assert.Error(err) {
		assert.Equal("strconv.ParseBool: parsing \"nonbool\": invalid syntax", err.Error())
	}
	// Test-7: getHealOptionsFromReq return error if boolean value not valid
	u, _ = url.Parse("http://localhost/api/v1/heal/bucket1?prefix=file/&recursive=true&force-start=true&force-stop=nonbool&remove=true&dry-run=true&scan=deep")
	req = &http.Request{
		URL: u,
	}
	opts, err = getHealOptionsFromReq(req)
	if assert.Error(err) {
		assert.Equal("strconv.ParseBool: parsing \"nonbool\": invalid syntax", err.Error())
	}
	// Test-8: getHealOptionsFromReq return error if boolean value not valid
	u, _ = url.Parse("http://localhost/api/v1/heal/bucket1?prefix=file/&recursive=true&force-start=true&force-stop=true&remove=true&dry-run=nonbool&scan=deep")
	req = &http.Request{
		URL: u,
	}
	opts, err = getHealOptionsFromReq(req)
	if assert.Error(err) {
		assert.Equal("strconv.ParseBool: parsing \"nonbool\": invalid syntax", err.Error())
	}
}
