// Code generated by go-swagger; DO NOT EDIT.

// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
//

package system

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the generate command

import (
	"errors"
	"net/url"
	golangswaggerpaths "path"
	"strings"

	"github.com/go-openapi/swag"
)

// DashboardWidgetDetailsURL generates an URL for the dashboard widget details operation
type DashboardWidgetDetailsURL struct {
	WidgetID int32

	End   *int64
	Start *int64
	Step  *int32

	_basePath string
	// avoid unkeyed usage
	_ struct{}
}

// WithBasePath sets the base path for this url builder, only required when it's different from the
// base path specified in the swagger spec.
// When the value of the base path is an empty string
func (o *DashboardWidgetDetailsURL) WithBasePath(bp string) *DashboardWidgetDetailsURL {
	o.SetBasePath(bp)
	return o
}

// SetBasePath sets the base path for this url builder, only required when it's different from the
// base path specified in the swagger spec.
// When the value of the base path is an empty string
func (o *DashboardWidgetDetailsURL) SetBasePath(bp string) {
	o._basePath = bp
}

// Build a url path and query string
func (o *DashboardWidgetDetailsURL) Build() (*url.URL, error) {
	var _result url.URL

	var _path = "/admin/info/widgets/{widgetId}"

	widgetID := swag.FormatInt32(o.WidgetID)
	if widgetID != "" {
		_path = strings.Replace(_path, "{widgetId}", widgetID, -1)
	} else {
		return nil, errors.New("widgetId is required on DashboardWidgetDetailsURL")
	}

	_basePath := o._basePath
	if _basePath == "" {
		_basePath = "/api/v1"
	}
	_result.Path = golangswaggerpaths.Join(_basePath, _path)

	qs := make(url.Values)

	var endQ string
	if o.End != nil {
		endQ = swag.FormatInt64(*o.End)
	}
	if endQ != "" {
		qs.Set("end", endQ)
	}

	var startQ string
	if o.Start != nil {
		startQ = swag.FormatInt64(*o.Start)
	}
	if startQ != "" {
		qs.Set("start", startQ)
	}

	var stepQ string
	if o.Step != nil {
		stepQ = swag.FormatInt32(*o.Step)
	}
	if stepQ != "" {
		qs.Set("step", stepQ)
	}

	_result.RawQuery = qs.Encode()

	return &_result, nil
}

// Must is a helper function to panic when the url builder returns an error
func (o *DashboardWidgetDetailsURL) Must(u *url.URL, err error) *url.URL {
	if err != nil {
		panic(err)
	}
	if u == nil {
		panic("url can't be nil")
	}
	return u
}

// String returns the string representation of the path with query string
func (o *DashboardWidgetDetailsURL) String() string {
	return o.Must(o.Build()).String()
}

// BuildFull builds a full url with scheme, host, path and query string
func (o *DashboardWidgetDetailsURL) BuildFull(scheme, host string) (*url.URL, error) {
	if scheme == "" {
		return nil, errors.New("scheme is required for a full url on DashboardWidgetDetailsURL")
	}
	if host == "" {
		return nil, errors.New("host is required for a full url on DashboardWidgetDetailsURL")
	}

	base, err := o.Build()
	if err != nil {
		return nil, err
	}

	base.Scheme = scheme
	base.Host = host
	return base, nil
}

// StringFull returns the string representation of a complete url
func (o *DashboardWidgetDetailsURL) StringFull(scheme, host string) string {
	return o.Must(o.BuildFull(scheme, host)).String()
}
