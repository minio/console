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
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"github.com/minio/madmin-go"
)

// An alias of string to represent the health color code of an object
type col string

const (
	colGrey   col = "Grey"
	colRed    col = "Red"
	colYellow col = "Yellow"
	colGreen  col = "Green"
)

var (
	hColOrder = []col{colRed, colYellow, colGreen}
	hColTable = map[int][]int{
		1: {0, -1, 1},
		2: {0, 1, 2},
		3: {1, 2, 3},
		4: {1, 2, 4},
		5: {1, 3, 5},
		6: {2, 4, 6},
		7: {2, 4, 7},
		8: {2, 5, 8},
	}
)

type healItemStatus struct {
	Status string `json:"status"`
	Error  string `json:"error,omitempty"`
	Type   string `json:"type"`
	Name   string `json:"name"`
	Before struct {
		Color     string                 `json:"color"`
		Offline   int                    `json:"offline"`
		Online    int                    `json:"online"`
		Missing   int                    `json:"missing"`
		Corrupted int                    `json:"corrupted"`
		Drives    []madmin.HealDriveInfo `json:"drives"`
	} `json:"before"`
	After struct {
		Color     string                 `json:"color"`
		Offline   int                    `json:"offline"`
		Online    int                    `json:"online"`
		Missing   int                    `json:"missing"`
		Corrupted int                    `json:"corrupted"`
		Drives    []madmin.HealDriveInfo `json:"drives"`
	} `json:"after"`
	Size int64 `json:"size"`
}

type healStatus struct {
	// Total time since heal start in seconds
	HealDuration float64 `json:"healDuration"`

	// Accumulated statistics of heal result records
	BytesScanned int64 `json:"bytesScanned"`

	// Counter for objects, and another counter for all kinds of
	// items
	ObjectsScanned int64 `json:"objectsScanned"`
	ItemsScanned   int64 `json:"itemsScanned"`

	// Counters for healed objects and all kinds of healed items
	ObjectsHealed int64 `json:"objectsHealed"`
	ItemsHealed   int64 `json:"itemsHealed"`

	ItemsHealthStatus []healItemStatus `json:"itemsHealthStatus"`
	// Map of health color code to number of objects with that
	// health color code.
	HealthBeforeCols map[col]int64 `json:"healthBeforeCols"`
	HealthAfterCols  map[col]int64 `json:"healthAfterCols"`
}

type healOptions struct {
	BucketName string
	Prefix     string
	ForceStart bool
	ForceStop  bool
	madmin.HealOpts
}

// startHeal starts healing of the servers based on heal options
func startHeal(ctx context.Context, conn WSConn, client MinioAdmin, hOpts *healOptions) error {
	// Initialize heal
	healStart, _, err := client.heal(ctx, hOpts.BucketName, hOpts.Prefix, hOpts.HealOpts, "", hOpts.ForceStart, hOpts.ForceStop)
	if err != nil {
		LogError("error initializing healing: %v", err)
		return err
	}
	if hOpts.ForceStop {
		return nil
	}
	clientToken := healStart.ClientToken
	hs := healStatus{
		HealthBeforeCols: make(map[col]int64),
		HealthAfterCols:  make(map[col]int64),
	}
	for {
		select {
		case <-ctx.Done():
			return nil
		default:
			_, res, err := client.heal(ctx, hOpts.BucketName, hOpts.Prefix, hOpts.HealOpts, clientToken, hOpts.ForceStart, hOpts.ForceStop)
			if err != nil {
				LogError("error on heal: %v", err)
				return err
			}

			hs.writeStatus(&res, conn)

			if res.Summary == "finished" {
				return nil
			}

			if res.Summary == "stopped" {
				return fmt.Errorf("heal had an error - %s", res.FailureDetail)
			}

			time.Sleep(time.Second)
		}
	}
}

func (h *healStatus) writeStatus(s *madmin.HealTaskStatus, conn WSConn) error {
	// Update state
	h.updateDuration(s)
	for _, item := range s.Items {
		err := h.updateStats(item)
		if err != nil {
			LogError("error on updateStats: %v", err)
			return err
		}
	}

	// Serialize message to be sent
	infoBytes, err := json.Marshal(h)
	if err != nil {
		LogError("error on json.Marshal: %v", err)
		return err
	}
	// Send Message through websocket connection
	err = conn.writeMessage(websocket.TextMessage, infoBytes)
	if err != nil {
		LogError("error writeMessage: %v", err)
		return err
	}
	return nil
}

func (h *healStatus) updateDuration(s *madmin.HealTaskStatus) {
	h.HealDuration = time.Now().UTC().Sub(s.StartTime).Round(time.Second).Seconds()
}

func (h *healStatus) updateStats(i madmin.HealResultItem) error {
	// update general status
	if i.Type == madmin.HealItemObject {
		// Objects whose size could not be found have -1 size
		// returned.
		if i.ObjectSize >= 0 {
			h.BytesScanned += i.ObjectSize
		}
		h.ObjectsScanned++
	}
	h.ItemsScanned++

	beforeUp, afterUp := i.GetOnlineCounts()
	if afterUp > beforeUp {
		if i.Type == madmin.HealItemObject {
			h.ObjectsHealed++
		}
		h.ItemsHealed++
	}
	// update per item status
	itemStatus := healItemStatus{}
	// get color health status
	var beforeColor, afterColor col
	var err error
	switch i.Type {
	case madmin.HealItemMetadata, madmin.HealItemBucket:
		beforeColor, afterColor, err = getReplicatedFileHCCChange(i)
	default:
		if i.Type == madmin.HealItemObject {
			itemStatus.Size = i.ObjectSize
		}
		beforeColor, afterColor, err = getObjectHCCChange(i)
	}
	if err != nil {
		return err
	}
	itemStatus.Status = "success"
	itemStatus.Before.Color = strings.ToLower(string(beforeColor))
	itemStatus.After.Color = strings.ToLower(string(afterColor))
	itemStatus.Type, itemStatus.Name = getHRITypeAndName(i)
	itemStatus.Before.Online, itemStatus.After.Online = beforeUp, afterUp
	itemStatus.Before.Missing, itemStatus.After.Missing = i.GetMissingCounts()
	itemStatus.Before.Corrupted, itemStatus.After.Corrupted = i.GetCorruptedCounts()
	itemStatus.Before.Offline, itemStatus.After.Offline = i.GetOfflineCounts()
	itemStatus.Before.Drives = i.Before.Drives
	itemStatus.After.Drives = i.After.Drives
	h.ItemsHealthStatus = append(h.ItemsHealthStatus, itemStatus)
	h.HealthBeforeCols[beforeColor]++
	h.HealthAfterCols[afterColor]++
	return nil
}

// getObjectHCCChange - returns before and after color change for
// objects
func getObjectHCCChange(h madmin.HealResultItem) (b, a col, err error) {
	parityShards := h.ParityBlocks
	dataShards := h.DataBlocks

	onlineBefore, onlineAfter := h.GetOnlineCounts()
	surplusShardsBeforeHeal := onlineBefore - dataShards
	surplusShardsAfterHeal := onlineAfter - dataShards
	b, err = getHColCode(surplusShardsBeforeHeal, parityShards)
	if err != nil {
		return
	}
	a, err = getHColCode(surplusShardsAfterHeal, parityShards)
	return

}

// getReplicatedFileHCCChange - fetches health color code for metadata
// files that are replicated.
func getReplicatedFileHCCChange(h madmin.HealResultItem) (b, a col, err error) {
	getColCode := func(numAvail int) (c col, err error) {
		// calculate color code for replicated object similar
		// to erasure coded objects
		quorum := h.DiskCount/h.SetCount/2 + 1
		surplus := numAvail/h.SetCount - quorum
		parity := h.DiskCount/h.SetCount - quorum
		c, err = getHColCode(surplus, parity)
		return
	}

	onlineBefore, onlineAfter := h.GetOnlineCounts()
	b, err = getColCode(onlineBefore)
	if err != nil {
		return
	}
	a, err = getColCode(onlineAfter)
	return
}

func getHColCode(surplusShards, parityShards int) (c col, err error) {
	if parityShards < 1 || parityShards > 8 || surplusShards > parityShards {
		return c, fmt.Errorf("invalid parity shard count/surplus shard count given")
	}
	if surplusShards < 0 {
		return colGrey, err
	}
	colRow := hColTable[parityShards]
	for index, val := range colRow {
		if val != -1 && surplusShards <= val {
			return hColOrder[index], err
		}
	}
	return c, fmt.Errorf("cannot get a heal color code")
}

func getHRITypeAndName(i madmin.HealResultItem) (typ, name string) {
	name = fmt.Sprintf("%s/%s", i.Bucket, i.Object)
	switch i.Type {
	case madmin.HealItemMetadata:
		typ = "system"
		name = i.Detail
	case madmin.HealItemBucketMetadata:
		typ = "system"
		name = "bucket-metadata:" + name
	case madmin.HealItemBucket:
		typ = "bucket"
	case madmin.HealItemObject:
		typ = "object"
	default:
		typ = fmt.Sprintf("!! Unknown heal result record %#v !!", i)
		name = typ
	}
	return
}

// getHealOptionsFromReq return options from request for healing process
// path come as : `/heal/<namespace>/<tenantName>/bucket1`
// and query params come on request form
func getHealOptionsFromReq(req *http.Request) (*healOptions, error) {
	hOptions := healOptions{}
	re := regexp.MustCompile(`(/heal/)(.*?)(\?.*?$|$)`)
	matches := re.FindAllSubmatch([]byte(req.URL.Path), -1)
	// matches comes as e.g.
	// [["...", "/heal/", "bucket1"]]
	// [["/heal/" "/heal/" ""]]

	if len(matches) == 0 || len(matches[0]) < 3 {
		return nil, fmt.Errorf("invalid url: %s", req.URL.Path)
	}
	hOptions.BucketName = strings.TrimSpace(string(matches[0][2]))
	hOptions.Prefix = req.FormValue("prefix")
	hOptions.HealOpts.ScanMode = transformScanStr(req.FormValue("scan"))

	if req.FormValue("force-start") != "" {
		boolVal, err := strconv.ParseBool(req.FormValue("force-start"))
		if err != nil {
			return nil, err
		}
		hOptions.ForceStart = boolVal
	}
	if req.FormValue("force-stop") != "" {
		boolVal, err := strconv.ParseBool(req.FormValue("force-stop"))
		if err != nil {
			return nil, err
		}
		hOptions.ForceStop = boolVal
	}
	// heal recursively
	if req.FormValue("recursive") != "" {
		boolVal, err := strconv.ParseBool(req.FormValue("recursive"))
		if err != nil {
			return nil, err
		}
		hOptions.HealOpts.Recursive = boolVal
	}
	// remove dangling objects in heal sequence
	if req.FormValue("remove") != "" {
		boolVal, err := strconv.ParseBool(req.FormValue("remove"))
		if err != nil {
			return nil, err
		}
		hOptions.HealOpts.Remove = boolVal
	}
	// only inspect data
	if req.FormValue("dry-run") != "" {
		boolVal, err := strconv.ParseBool(req.FormValue("dry-run"))
		if err != nil {
			return nil, err
		}
		hOptions.HealOpts.DryRun = boolVal
	}
	return &hOptions, nil
}

func transformScanStr(scanStr string) madmin.HealScanMode {
	switch scanStr {
	case "deep":
		return madmin.HealDeepScan
	}
	return madmin.HealNormalScan
}
