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
	"fmt"
	"os"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/cluster"
	"github.com/minio/console/models"
	"github.com/minio/console/operatorapi/operations"
	"github.com/minio/console/operatorapi/operations/operator_api"
	errors "github.com/minio/console/restapi"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

var (
	mpConfigMapDefault = "mp-config"
	mpConfigMapKey     = "MP_CONFIG_KEY"
	mpEmail            = "email"
	emailNotSetMsg     = "Email was not sent in request"
)

func registerMarketplaceHandlers(api *operations.OperatorAPI) {
	api.OperatorAPIGetMPIntegrationHandler = operator_api.GetMPIntegrationHandlerFunc(func(params operator_api.GetMPIntegrationParams, session *models.Principal) middleware.Responder {
		payload, err := getMPIntegrationResponse(session, params)
		if err != nil {
			return operator_api.NewGetMPIntegrationDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewGetMPIntegrationOK().WithPayload(payload)
	})

	api.OperatorAPIPostMPIntegrationHandler = operator_api.PostMPIntegrationHandlerFunc(func(params operator_api.PostMPIntegrationParams, session *models.Principal) middleware.Responder {
		err := postMPIntegrationResponse(session, params)
		if err != nil {
			return operator_api.NewPostMPIntegrationDefault(int(err.Code)).WithPayload(err)
		}
		return operator_api.NewPostMPIntegrationCreated()
	})
}

func getMPIntegrationResponse(session *models.Principal, params operator_api.GetMPIntegrationParams) (*models.MpIntegration, *models.Error) {
	if true { // This block will be removed once service to register emails is deployed
		return nil, &models.Error{Code: 501}
	}
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	if err != nil {
		return nil, errors.ErrorWithContext(ctx, err)
	}
	mpEmail, err := getMPEmail(ctx, &k8sClient{client: clientSet})
	if err != nil {
		return nil, errors.ErrorWithContext(ctx, errors.ErrNotFound)
	}
	return &models.MpIntegration{
		Email: mpEmail,
	}, nil
}

func getMPEmail(ctx context.Context, clientSet K8sClientI) (string, error) {
	cm, err := clientSet.getConfigMap(ctx, "default", getMPConfigMapKey(mpConfigMapKey), metav1.GetOptions{})
	if err != nil {
		return "", err
	}
	return cm.Data[mpEmail], nil
}

func postMPIntegrationResponse(session *models.Principal, params operator_api.PostMPIntegrationParams) *models.Error {
	if true { // This block will be removed once service to register emails is deployed
		return &models.Error{Code: 501}
	}
	clientSet, err := cluster.K8sClient(session.STSSessionToken)
	ctx, cancel := context.WithCancel(params.HTTPRequest.Context())
	defer cancel()
	if err != nil {
		return errors.ErrorWithContext(ctx, err)
	}
	return setMPIntegration(ctx, params.Body.Email, &k8sClient{client: clientSet})
}

func setMPIntegration(ctx context.Context, email string, clientSet K8sClientI) *models.Error {
	if email == "" {
		return errors.ErrorWithContext(ctx, errors.ErrBadRequest, fmt.Errorf(emailNotSetMsg))
	}
	if _, err := setMPEmail(ctx, email, clientSet); err != nil {
		return errors.ErrorWithContext(ctx, err)
	}
	return nil
}

func setMPEmail(ctx context.Context, email string, clientSet K8sClientI) (*corev1.ConfigMap, error) {
	cm := createCM(email)
	return clientSet.createConfigMap(ctx, "default", cm, metav1.CreateOptions{})
}

func createCM(email string) *corev1.ConfigMap {
	return &corev1.ConfigMap{
		TypeMeta: metav1.TypeMeta{
			Kind:       "ConfigMap",
			APIVersion: "v1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      getMPConfigMapKey(mpConfigMapKey),
			Namespace: "default",
		},
		Data: map[string]string{mpEmail: email},
	}
}

func getMPConfigMapKey(envVar string) string {
	if mp := os.Getenv(envVar); mp != "" {
		return mp
	}
	return mpConfigMapDefault
}
