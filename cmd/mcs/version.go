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

package main

import (
	"fmt"

	"github.com/minio/cli"
	"github.com/minio/m3/mcs/pkg"
)

// starts the server
var versionCmd = cli.Command{
	Name:   "version",
	Usage:  "shows mcs version",
	Action: version,
}

// starts the controller
func version(ctx *cli.Context) error {
	fmt.Printf("MCS version %s (%s - %s. Commit %s)", pkg.Version, pkg.ReleaseTag, pkg.ReleaseTime, pkg.CommitID)
	return nil
}
