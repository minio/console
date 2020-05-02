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
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/minio/minio/pkg/madmin"
)

const logTimeFormat string = "15:04:05 MST 01/02/2006"

// startConsoleLog starts log of the servers
// by first setting a websocket reader that will
// check for a heartbeat.
//
// A WaitGroup is used to handle goroutines and to ensure
// all finish in the proper order. If any, sendConsoleLogInfo()
// or wsReadCheck() returns, trace should end.
func startConsoleLog(conn WSConn, client MinioAdmin) (mError error) {
	// a WaitGroup waits for a collection of goroutines to finish
	wg := sync.WaitGroup{}
	// a cancel context is needed to end all goroutines used
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Set number of goroutines to wait. wg.Wait()
	// waitsuntil counter is zero (all are done)
	wg.Add(3)
	// start go routine for reading websocket heartbeat
	readErr := wsReadCheck(ctx, &wg, conn)
	// send Stream of Console Log Info to the ws c.connection
	logCh := sendConsoleLogInfo(ctx, &wg, conn, client)
	// If wsReadCheck returns it means that it is not possible to check
	// ws heartbeat anymore so we stop from doing Console Log, cancel context
	// for all goroutines.
	go func(wg *sync.WaitGroup) {
		defer wg.Done()
		if err := <-readErr; err != nil {
			log.Println("error on wsReadCheck:", err)
			mError = err
		}
		// cancel context for all goroutines.
		cancel()
	}(&wg)

	// get logCh err on finish
	if err := <-logCh; err != nil {
		mError = err
	}

	// if logCh closes for any reason,
	// cancel context for all goroutines
	cancel()
	// wait all goroutines to finish
	wg.Wait()
	return mError
}

// sendlogInfo sends stream of Console Log Info to the ws connection
func sendConsoleLogInfo(ctx context.Context, wg *sync.WaitGroup, conn WSConn, client MinioAdmin) <-chan error {
	// decrements the WaitGroup counter
	// by one when the function returns
	defer wg.Done()
	ch := make(chan error)
	go func(ch chan<- error) {
		defer close(ch)

		// TODO: accept parameters as variables
		// name of node, default = "" (all)
		node := ""
		// number of log lines
		lineCount := 100
		// type of logs "minio"|"application"|"all" default = "all"
		logKind := "all"
		// Start listening on all Console Log activity.
		logCh := client.getLogs(ctx, node, lineCount, logKind)

		for logInfo := range logCh {
			if logInfo.Err != nil {
				log.Println("error on console logs:", logInfo.Err)
				ch <- logInfo.Err
				return
			}

			// Serialize message to be sent
			bytes, err := json.Marshal(serializeConsoleLogInfo(&logInfo))
			if err != nil {
				fmt.Println("error on json.Marshal:", err)
				ch <- err
				return
			}

			// Send Message through websocket connection
			err = conn.writeMessage(websocket.TextMessage, bytes)
			if err != nil {
				log.Println("error writeMessage:", err)
				ch <- err
				return
			}
		}
	}(ch)

	return ch
}

func serializeConsoleLogInfo(l *madmin.LogInfo) (logInfo madmin.LogInfo) {
	logInfo = *l
	if logInfo.ConsoleMsg != "" {
		if strings.HasPrefix(logInfo.ConsoleMsg, "\n") {
			logInfo.ConsoleMsg = strings.TrimPrefix(logInfo.ConsoleMsg, "\n")
		}
	}
	if logInfo.Time != "" {
		logInfo.Time = getLogTime(logInfo.Time)
	}
	return logInfo
}

func getLogTime(lt string) string {
	tm, err := time.Parse(time.RFC3339Nano, lt)
	if err != nil {
		return lt
	}
	return tm.Format(logTimeFormat)
}
