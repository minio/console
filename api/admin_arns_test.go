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

package api

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"testing"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/api/operations/system"
	"github.com/minio/console/models"

	"github.com/go-openapi/loads"
	"github.com/minio/console/api/operations"
	"github.com/minio/madmin-go/v3"

	asrt "github.com/stretchr/testify/assert"
)

func TestArnsList(t *testing.T) {
	assert := asrt.New(t)
	adminClient := AdminClientMock{}
	// Test-1 : getArns() returns proper arn list
	MinioServerInfoMock = func(_ context.Context) (madmin.InfoMessage, error) {
		return madmin.InfoMessage{
			SQSARN: []string{"uno"},
		}, nil
	}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	arnsList, err := getArns(ctx, adminClient)
	assert.NotNil(arnsList, "arn list was returned nil")
	if arnsList != nil {
		assert.Equal(len(arnsList.Arns), 1, "Incorrect arns count")
	}
	assert.Nil(err, "Error should have been nil")

	// Test-2 : getArns(ctx) fails for whatever reason
	MinioServerInfoMock = func(_ context.Context) (madmin.InfoMessage, error) {
		return madmin.InfoMessage{}, errors.New("some reason")
	}

	arnsList, err = getArns(ctx, adminClient)
	assert.Nil(arnsList, "arn list was not returned nil")
	assert.NotNil(err, "An error should have been returned")
}

func TestRegisterAdminArnsHandlers(t *testing.T) {
	assert := asrt.New(t)
	swaggerSpec, err := loads.Embedded(SwaggerJSON, FlatSwaggerJSON)
	if err != nil {
		assert.Fail("Error")
	}
	api := operations.NewConsoleAPI(swaggerSpec)
	api.SystemArnListHandler = nil
	registerAdminArnsHandlers(api)
	if api.SystemArnListHandler == nil {
		assert.Fail("Assignment should happen")
	} else {
		fmt.Println("Function got assigned: ", api.SystemArnListHandler)
	}

	// To test error case in registerAdminArnsHandlers
	request, _ := http.NewRequest(
		"GET",
		"http://localhost:9090/api/v1/buckets/",
		nil,
	)
	ArnListParamsStruct := system.ArnListParams{
		HTTPRequest: request,
	}
	modelsPrincipal := models.Principal{
		STSAccessKeyID: "accesskey",
	}
	var value middleware.Responder = api.SystemArnListHandler.Handle(ArnListParamsStruct, &modelsPrincipal)
	str := fmt.Sprintf("%#v", value)
	fmt.Println("value: ", str)
	assert.Equal(strings.Contains(str, "_statusCode:500"), true)
}
