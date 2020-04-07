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

import React, { ChangeEvent } from "react";
import Grid from "@material-ui/core/Grid";
import Title from "../../../../common/Title";
import Typography from "@material-ui/core/Typography";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField
} from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import api from "../../../../common/api";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import { ArnList } from "../types";

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red"
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold"
        }
      }
    }
  });

interface IAddEventProps {
  classes: any;
  open: boolean;
  selectedBucket: string;
  closeModalAndRefresh: () => void;
}

interface IAddEventState {
  addLoading: boolean;
  addError: string;
  prefix: string;
  suffix: string;
  arn: string;
  selectedEvents: string[];
  arnList: string[];
}

class AddEvent extends React.Component<IAddEventProps, IAddEventState> {
  state: IAddEventState = {
    addLoading: false,
    addError: "",
    prefix: "",
    suffix: "",
    arn: "",
    selectedEvents: [],
    arnList: []
  };

  addRecord(event: React.FormEvent) {
    event.preventDefault();
    const { prefix, suffix, addLoading, arn, selectedEvents } = this.state;
    const { selectedBucket } = this.props;
    if (addLoading) {
      return;
    }
    this.setState({ addLoading: true }, () => {
      api
        .invoke("POST", `/api/v1/buckets/${selectedBucket}/events`, {
          configuration: {
            arn: arn,
            events: selectedEvents,
            prefix: prefix,
            suffix: suffix
          },
          ignoreExisting: true
        })
        .then(res => {
          this.setState(
            {
              addLoading: false,
              addError: ""
            },
            () => {
              this.props.closeModalAndRefresh();
            }
          );
        })
        .catch(err => {
          this.setState({
            addLoading: false,
            addError: err
          });
        });
    });
  }

  fetchArnList() {
    this.setState({ addLoading: true }, () => {
      api
        .invoke("GET", `/api/v1/admin/arns`)
        .then((res: ArnList) => {
          let arns: string[] = [];
          if (res.arns !== null) {
            arns = res.arns;
          }
          this.setState({
            addLoading: false,
            arnList: arns,
            addError: ""
          });
        })
        .catch((err: any) => {
          this.setState({ addLoading: false, addError: err });
        });
    });
  }

  componentDidMount(): void {
    this.fetchArnList();
  }

  render() {
    const { classes, open } = this.props;
    const { addLoading, addError, arn, selectedEvents, arnList } = this.state;

    const events = [
      { label: "PUT - Object Uploaded", value: "put" },
      { label: "GET - Object accessed", value: "get" },
      { label: "DELETE - Object Deleted", value: "delete" }
    ];

    const handleClick = (
      event: React.MouseEvent<unknown> | ChangeEvent<unknown>,
      name: string
    ) => {
      const selectedIndex = selectedEvents.indexOf(name);
      let newSelected: string[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selectedEvents, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selectedEvents.slice(1));
      } else if (selectedIndex === selectedEvents.length - 1) {
        newSelected = newSelected.concat(selectedEvents.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selectedEvents.slice(0, selectedIndex),
          selectedEvents.slice(selectedIndex + 1)
        );
      }

      this.setState({ selectedEvents: newSelected });
    };

    return (
      <Dialog
        open={open}
        onClose={() => {
          this.setState({ addError: "" }, () => {
            this.props.closeModalAndRefresh();
          });
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Title>Subscribe To Event</Title>
        </DialogTitle>
        <DialogContent>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              this.addRecord(e);
            }}
          >
            <Grid container>
              {addError !== "" && (
                <Grid item xs={12}>
                  <Typography
                    component="p"
                    variant="body1"
                    className={classes.errorBlock}
                  >
                    {addError}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControl className={classes.formControl} fullWidth>
                  <InputLabel id="select-access-policy">ARN</InputLabel>
                  <Select
                    labelId="select-access-policy"
                    id="select-access-policy"
                    value={arn}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      this.setState({ arn: e.target.value as string });
                    }}
                  >
                    {arnList.map(arn => (
                      <MenuItem value={arn}>{arn}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Table size="medium">
                  <TableHead className={classes.minTableHeader}>
                    <TableRow>
                      <TableCell>Select</TableCell>
                      <TableCell>Event</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map(row => (
                      <TableRow
                        key={`group-${row.value}`}
                        onClick={event => handleClick(event, row.value)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            value={row.value}
                            color="primary"
                            inputProps={{
                              "aria-label": "secondary checkbox"
                            }}
                            onChange={event => handleClick(event, row.value)}
                            checked={selectedEvents.includes(row.value)}
                          />
                        </TableCell>
                        <TableCell className={classes.wrapCell}>
                          {row.label}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-basic"
                  fullWidth
                  label="Prefix"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ prefix: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-basic"
                  fullWidth
                  label="Suffix"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ suffix: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <br />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={addLoading}
                >
                  Save
                </Button>
              </Grid>
              {addLoading && (
                <Grid item xs={12}>
                  <LinearProgress />
                </Grid>
              )}
            </Grid>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddEvent);
