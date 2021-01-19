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
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/go-openapi/runtime/middleware"
	"github.com/minio/console/models"
	"github.com/minio/console/restapi/operations"
	"github.com/minio/console/restapi/operations/admin_api"
)

func registerAdminInfoHandlers(api *operations.ConsoleAPI) {
	// return usage stats
	api.AdminAPIAdminInfoHandler = admin_api.AdminInfoHandlerFunc(func(params admin_api.AdminInfoParams, session *models.Principal) middleware.Responder {
		infoResp, err := getAdminInfoResponse(session, params)
		if err != nil {
			return admin_api.NewAdminInfoDefault(int(err.Code)).WithPayload(err)
		}
		return admin_api.NewAdminInfoOK().WithPayload(infoResp)
	})

}

type usageInfo struct {
	Buckets    int64
	Objects    int64
	Usage      int64
	DisksUsage int64
}

// getAdminInfo invokes admin info and returns a parsed `usageInfo` structure
func getAdminInfo(ctx context.Context, client MinioAdmin) (*usageInfo, error) {
	serverInfo, err := client.serverInfo(ctx)
	if err != nil {
		return nil, err
	}
	// we are trimming uint64 to int64 this will report an incorrect measurement for numbers greater than
	// 9,223,372,036,854,775,807

	var usedSpace int64
	for _, serv := range serverInfo.Servers {
		for _, disk := range serv.Disks {
			usedSpace += int64(disk.UsedSpace)
		}
	}

	return &usageInfo{
		Buckets:    int64(serverInfo.Buckets.Count),
		Objects:    int64(serverInfo.Objects.Count),
		Usage:      int64(serverInfo.Usage.Size),
		DisksUsage: usedSpace,
	}, nil
}

type Target struct {
	Expr         string
	Interval     string
	LegendFormat string
}

type ReduceOptions struct {
	Calcs []string
}

type MetricOptions struct {
	ReduceOptions ReduceOptions
}

type Metric struct {
	Title   string
	Type    string
	Options MetricOptions
	Targets []Target
}

type WidgetLabel struct {
	Name string
}

var labels = []WidgetLabel{
	{Name: "instance"},
	{Name: "disk"},
}

var widgets = []Metric{
	{
		Title: "Uptime",
		Type:  "stat",

		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},

		Targets: []Target{
			{
				Expr:         "time() - max(process_start_time_seconds)",
				LegendFormat: "{{instance}}",
			},
		},
	},
	{
		Title: "Total Online disks",
		Type:  "stat",

		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},

		Targets: []Target{
			{
				Expr:         "sum(minio_disks_total)",
				LegendFormat: "Total online disks in MinIO Cluster",
			},
		},
	},
	{
		Title: "Total Data",
		Type:  "gauge",

		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"lastNotNull",
				},
			},
		},

		Targets: []Target{
			{
				Expr:         "topk(1, sum(bucket_usage_size) by (instance))",
				LegendFormat: "",
			},
		},
	},
	{
		Title: "Data Growth",
		Type:  "graph",
		Targets: []Target{
			{
				Expr:         "topk(1, sum(bucket_usage_size) by (instance))",
				LegendFormat: "Total Storage Used",
			},
		},
	},
	{
		Title: "Object size distribution",
		Type:  "bargauge",

		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},

		Targets: []Target{
			{
				Expr:         "max by (object_size) (bucket_objects_histogram)",
				LegendFormat: "{{object_size}}",
			},
		},
	},
	{
		Title: "Total Offline disks",
		Type:  "singlestat",
		Targets: []Target{
			{
				Expr:         "sum(minio_disks_offline)",
				LegendFormat: "Total offline disks in MinIO Cluster",
			},
		},
	},
	{
		Title: "Total Online Servers",
		Type:  "stat",

		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},

		Targets: []Target{
			{
				Expr:         "count by (instances) (minio_version_info)",
				LegendFormat: "",
			},
		},
	},
	{
		Title: "Total S3 Traffic Inbound",
		Type:  "stat",

		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},

		Targets: []Target{
			{
				Expr:         "sum without (instance) (s3_rx_bytes_total)",
				LegendFormat: "",
			},
		},
	},
	{
		Title: "Number of Buckets",
		Type:  "stat",

		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"lastNotNull",
				},
			},
		},

		Targets: []Target{
			{
				Expr:         "count(count by (bucket) (bucket_objects_count))",
				LegendFormat: "",
			},
		},
	},
	{
		Title: "S3 API Request & Error Rate",
		Type:  "graph",
		Targets: []Target{
			{
				Expr:         "sum without (instance,api)(rate(s3_requests_total[10m]))",
				LegendFormat: "S3 Requests",
			},
			{
				Expr:         "sum without (instance,api)(rate(s3_errors_total[10m]))",
				LegendFormat: "S3 Errors",
			},
		},
	},
	{
		Title: "Total Open FDs",
		Type:  "stat",

		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},

		Targets: []Target{
			{
				Expr:         "sum without (instance)(process_open_fds)",
				LegendFormat: "",
			},
		},
	},
	{
		Title: "Total S3 Traffic Outbound",
		Type:  "stat",

		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},

		Targets: []Target{
			{
				Expr:         "sum without (instance)(s3_tx_bytes_total)",
				LegendFormat: "",
			},
		},
	},
	{
		Title: "Number of Objects",
		Type:  "stat",

		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"lastNotNull",
				},
			},
		},

		Targets: []Target{
			{
				Expr:         "topk(1, sum(bucket_objects_count) by (instance))",
				LegendFormat: "",
			},
		},
	},
	{
		Title: "Total Goroutines",
		Type:  "stat",

		Options: MetricOptions{
			ReduceOptions: ReduceOptions{
				Calcs: []string{
					"mean",
				},
			},
		},

		Targets: []Target{
			{
				Expr:         "sum without (instance) (go_goroutines)",
				LegendFormat: "",
			},
		},
	},
	{
		Title: "S3 API Data Transfer",
		Type:  "graph",
		Targets: []Target{
			{
				Expr:         "sum without (instance,api)(rate(s3_tx_bytes_total[5m]))",
				LegendFormat: "S3 Data Sent",
			},
			{
				Expr:         "sum without (instance,api)(rate(s3_rx_bytes_total[5m]))",
				LegendFormat: "S3 Data Received",
			},
		},
	},
	{
		Title: "Total S3 API Data Transfer",
		Type:  "graph",
		Targets: []Target{
			{
				Expr:         "sum without (instance) (s3_rx_bytes_total)",
				LegendFormat: "S3 Bytes Received {{instance}}",
			},
			{
				Expr:         "sum without (instance) (s3_tx_bytes_total)",
				LegendFormat: "S3 Bytes Sent {{instance}}",
			},
		},
	},
	{
		Title: "Active S3 Requests",
		Type:  "graph",
		Targets: []Target{
			{
				Expr:         "s3_requests_current{instance=~\"$instance\"}",
				LegendFormat: "Instance {{instance}} function {{api}}",
			},
		},
	},
	{
		Title: "Internode Data Transfer",
		Type:  "graph",
		Targets: []Target{
			{
				Expr:         "internode_rx_bytes_total{instance=~\"$instance\"}",
				LegendFormat: "Internode Bytes Received {{instance}}",
			},
			{
				Expr:         "internode_tx_bytes_total{instance=~\"$instance\"}",
				LegendFormat: "Internode Bytes Sent {{instance}}",
			},
		},
	},
	{
		Title: "Online Disks",
		Type:  "graph",
		Targets: []Target{
			{
				Expr:         "minio_disks_total{instance=~\"$instance\"} - minio_disks_offline{instance=~\"$instance\"}",
				LegendFormat: "Online Disks {{instance}}",
			},
		},
	},
	{
		Title: "Disk Usage",
		Type:  "graph",
		Targets: []Target{
			{
				Expr:         "disk_storage_used{disk=~\"$disk\",instance=~\"$instance\"}",
				LegendFormat: "Used Capacity {{instance}} {{disk}}",
			},
		},
	},
}

type Widget struct {
	Title string
	Type  string
}

type DataResult struct {
	Metric map[string]string `json:"metric"`
	Values []interface{}     `json:"values"`
}

type PromRespData struct {
	ResultType string       `json:"resultType"`
	Result     []DataResult `json:"result"`
}
type PromResp struct {
	Status string       `json:"status"`
	Data   PromRespData `json:"data"`
}

type LabelResponse struct {
	Status string   `json:"status"`
	Data   []string `json:"data"`
}
type LabelResults struct {
	Label    string
	Response LabelResponse
}

// getAdminInfoResponse returns the response containing total buckets, objects and usage.
func getAdminInfoResponse(session *models.Principal, params admin_api.AdminInfoParams) (*models.AdminInfoResponse, *models.Error) {
	prometheusURL := getPrometheusURL()

	if prometheusURL == "" {
		mAdmin, err := newMAdminClient(session)
		if err != nil {
			return nil, prepareError(err)
		}
		// create a minioClient interface implementation
		// defining the client to be used
		adminClient := adminClient{client: mAdmin}
		// 20 seconds timeout
		ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
		defer cancel()
		// serialize output
		usage, err := getAdminInfo(ctx, adminClient)
		if err != nil {
			return nil, prepareError(err)
		}
		sessionResp := &models.AdminInfoResponse{
			Buckets: usage.Buckets,
			Objects: usage.Objects,
			Usage:   usage.Usage,
		}
		return sessionResp, nil
	}

	labelResultsCh := make(chan LabelResults)

	for _, lbl := range labels {
		go func(lbl WidgetLabel) {
			endpoint := fmt.Sprintf("%s/api/v1/label/%s/values", prometheusURL, lbl.Name)

			resp, err := http.Get(endpoint)
			if err != nil {
				log.Println(err)
				return
			}
			defer func() {
				if err := resp.Body.Close(); err != nil {
					log.Println(err)
				}
			}()

			if resp.StatusCode != 200 {
				body, err := ioutil.ReadAll(resp.Body)
				if err != nil {
					log.Println(err)
					return
				}
				log.Println(endpoint)
				log.Println(resp.StatusCode)
				log.Println(string(body))
				return
			}

			var response LabelResponse
			jd := json.NewDecoder(resp.Body)
			if err = jd.Decode(&response); err != nil {
				log.Println(err)
				return
			}

			labelResultsCh <- LabelResults{Label: lbl.Name, Response: response}

		}(lbl)
	}

	labelMap := make(map[string][]string)

	// wait for as many goroutines that come back in less than 1 second
LabelsWaitLoop:
	for {
		select {
		case <-time.After(1 * time.Second):
			break LabelsWaitLoop
		case res := <-labelResultsCh:
			labelMap[res.Label] = res.Response.Data
			if len(labelMap) >= len(labels) {
				break LabelsWaitLoop
			}
		}
	}

	// launch a goroutines per widget

	results := make(chan models.Widget)
	for _, m := range widgets {
		go func(m Metric, params admin_api.AdminInfoParams) {
			targetResults := make(chan *models.ResultTarget)
			// for each target we will launch another goroutine to fetch the values
			for _, target := range m.Targets {
				go func(target Target, params admin_api.AdminInfoParams) {
					apiType := "query_range"
					now := time.Now()
					extraParamters := fmt.Sprintf("&start=%d&end=%d&step=%d", now.Add(-15*time.Minute).Unix(), now.Unix(), *params.Step)

					if params.Start != nil && params.End != nil {
						extraParamters = fmt.Sprintf("&start=%d&end=%d&step=%d", *params.Start, *params.End, *params.Step)
					}

					queryExpr := target.Expr

					if strings.Contains(queryExpr, "$") {
						var re = regexp.MustCompile(`\$([a-z]+)`)

						for _, match := range re.FindAllStringSubmatch(queryExpr, -1) {
							if val, ok := labelMap[match[1]]; ok {
								queryExpr = strings.ReplaceAll(queryExpr, "$"+match[1], fmt.Sprintf("(%s)", strings.Join(val, "|")))
							}
						}
					}

					endpoint := fmt.Sprintf("%s/api/v1/%s?query=%s%s", getPrometheusURL(), apiType, url.QueryEscape(queryExpr), extraParamters)
					resp, err := http.Get(endpoint)
					if err != nil {
						log.Println(err)
						return
					}
					defer func() {
						if err := resp.Body.Close(); err != nil {
							log.Println(err)
						}
					}()

					if resp.StatusCode != 200 {
						body, err := ioutil.ReadAll(resp.Body)
						if err != nil {
							log.Println(err)
							return
						}
						log.Println(endpoint)
						log.Println(resp.StatusCode)
						log.Println(string(body))
						return
					}

					var response PromResp
					jd := json.NewDecoder(resp.Body)
					if err = jd.Decode(&response); err != nil {
						log.Println(err)
						return
					}
					//body, _ := ioutil.ReadAll(resp.Body)
					//err = json.Unmarshal(body, &response)
					//if err != nil {
					//	log.Println(err)
					//}

					targetResult := models.ResultTarget{
						LegendFormat: target.LegendFormat,
						ResultType:   response.Data.ResultType,
					}
					for _, r := range response.Data.Result {
						targetResult.Result = append(targetResult.Result, &models.WidgetResult{
							Metric: r.Metric,
							Values: r.Values,
						})
					}

					//xx, err := json.Marshal(response)
					//if err != nil {
					//	log.Println(err)
					//}
					//log.Println("----", m.Title)
					//log.Println(string(body))
					//log.Println(string(xx))
					//log.Println("=====")

					targetResults <- &targetResult

				}(target, params)
			}

			wdgtResult := models.Widget{
				Title: m.Title,
				Type:  m.Type,
			}
			if len(m.Options.ReduceOptions.Calcs) > 0 {
				wdgtResult.Options = &models.WidgetOptions{
					ReduceOptions: &models.WidgetOptionsReduceOptions{
						Calcs: m.Options.ReduceOptions.Calcs,
					},
				}
			}
			// count how many targets we have received
			targetsReceived := 0

			for res := range targetResults {
				wdgtResult.Targets = append(wdgtResult.Targets, res)
				targetsReceived++
				// upon receiving the total number of targets needed, we can close the channel to not lock the goroutine
				if targetsReceived >= len(m.Targets) {
					close(targetResults)
				}
			}

			results <- wdgtResult
		}(m, params)
	}

	// count the number of widgets that have completed calculating
	totalWidgets := 0
	sessionResp := &models.AdminInfoResponse{}

	var wdgts []*models.Widget
	// wait for as many goroutines that come back in less than 1 second
WaitLoop:
	for {
		select {
		case <-time.After(1 * time.Second):
			break WaitLoop
		case res := <-results:
			wdgts = append(wdgts, &res)
			totalWidgets++
			if totalWidgets >= len(widgets) {
				break WaitLoop
			}
		}
	}

	sessionResp.Widgets = wdgts

	return sessionResp, nil
}
