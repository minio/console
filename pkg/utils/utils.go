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

package utils

import (
	"context"
)

// Key used for Get/SetReqInfo
type key string

const (
	ContextLogKey            = key("console-log")
	ContextRequestID         = key("request-id")
	ContextRequestUserID     = key("request-user-id")
	ContextRequestUserAgent  = key("request-user-agent")
	ContextRequestHost       = key("request-host")
	ContextRequestRemoteAddr = key("request-remote-addr")
	ContextAuditKey          = key("request-audit-entry")
	ContextClientIP          = key("client-ip")
)

// ClientIPFromContext attempts to get the Client IP from a context, if it's not present, it returns
// 127.0.0.1
func ClientIPFromContext(ctx context.Context) string {
	val := ctx.Value(ContextClientIP)
	if val != nil {
		return val.(string)
	}
	return "127.0.0.1"
}
