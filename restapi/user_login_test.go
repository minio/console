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

package restapi

import (
	"errors"
	"testing"

	mcCmd "github.com/minio/mc/cmd"
	"github.com/minio/mc/pkg/probe"
	"github.com/stretchr/testify/assert"
)

var mcBuildS3ConfigMock func(url, accessKey, secretKey, api, lookup string) (*mcCmd.Config, *probe.Error)

type mcCmdMock struct{}

func (mc mcCmdMock) BuildS3Config(url, accessKey, secretKey, api, lookup string) (*mcCmd.Config, *probe.Error) {
	return mcBuildS3ConfigMock(url, accessKey, secretKey, api, lookup)
}

// TestLogin tests the case of passing a valid and an invalid access/secret pair
func TestLogin(t *testing.T) {
	assert := assert.New(t)
	// We will write a test against play
	// Probe the credentials
	mcx := mcCmdMock{}
	access := "ABCDEFHIJK"
	secret := "ABCDEFHIJKABCDEFHIJK"

	// Test Case 1: Valid credentials
	mcBuildS3ConfigMock = func(url, accessKey, secretKey, api, lookup string) (config *mcCmd.Config, p *probe.Error) {
		return &mcCmd.Config{}, nil
	}

	sessionID, err := login(mcx, &access, &secret)
	assert.NotEmpty(sessionID, "Session ID was returned empty")
	assert.Nil(err, "error creating a session")

	// Test Case 2: Invalid credentials
	mcBuildS3ConfigMock = func(url, accessKey, secretKey, api, lookup string) (config *mcCmd.Config, p *probe.Error) {
		return nil, probe.NewError(errors.New("Bad credentials"))
	}

	sessionID, err = login(mcx, &access, &secret)
	assert.Empty(sessionID, "Session ID was not returned empty")
	assert.NotNil(err, "not error returned creating a session")
}
