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

import React, {useState, useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Button, LinearProgress} from "@material-ui/core";
import {createStyles, Theme, withStyles} from "@material-ui/core/styles";
import {modalBasic} from "../Common/FormComponents/common/styleLibrary";
import api from "../../../common/api";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import InputBoxWrapper from "../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../Common/FormComponents/SelectWrapper/SelectWrapper";

const styles = (theme: Theme) =>
    createStyles({
        errorBlock: {
            color: "red",
        },
        buttonContainer: {
            textAlign: "right",
        },
        ...modalBasic,
    });

interface IAddBucketProps {
    classes: any;
    open: boolean;
    closeModalAndRefresh: () => void;
}

const AddRemoteBucket = ({
                             classes,
                             open,
                             closeModalAndRefresh,
                         }: IAddBucketProps) => {
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState("");
    const [bucketName, setBucketName] = useState("");
    const [accessKey, setAccessKey] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [sourceBucket, setSourceBucket] = useState("");
    const [targetURL, setTargetURL] = useState("");
    const [targetBucket, setTargetBucket] = useState("");
    const [remoteARN, setRemoteARN] = useState("");
    const [status, setStatus] = useState("");
    const [service, setService] = useState("");
    const [arnList, setArnList] = useState([]);

    useEffect(() => {
        if (addLoading) {
            addRecord();
        }
    }, [addLoading]);

    const addRecord = () => {
        const remoteBucketInfo = {
            name: bucketName,
            accessKey: accessKey,
            secretKey: secretKey,
            sourceBucket: sourceBucket,
            targetURL: targetURL,
            targetBucket: targetBucket,
            remoteARN: remoteARN,
            status,
            service,
        };

        api
            .invoke("POST", "/api/v1/remote-buckets", remoteBucketInfo)
            .then((res) => {
                setAddLoading(false);
                setAddError("");
                closeModalAndRefresh();
            })
            .catch((err) => {
                setAddLoading(false);
                setAddError(err);
            });
    }


    const arnValues = arnList.map((arnConstant) => ({
        label: arnConstant,
        value: arnConstant,
    }));

    const serviceOptions = [
        {label: "None", value: ""},
        {label: "Replication", value: "replication"},
    ];

    return (
        <ModalWrapper
            title="Create Remote Bucket"
            modalOpen={open}
            onClose={() => {
                setAddError("");
                closeModalAndRefresh();
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <form
                noValidate
                autoComplete="off"
                onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    addRecord();
                }}
            >
                <Grid container>
                    <Grid item xs={12} className={classes.formScrollable}>
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
                            <InputBoxWrapper
                                id="bucket-name"
                                name="bucket-name"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setBucketName(e.target.value);
                                }}
                                label="Remote Bucket Name"
                                value={bucketName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputBoxWrapper
                                id="accessKey"
                                name="accessKey"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setAccessKey(e.target.value);
                                }}
                                label="Access Key"
                                value={accessKey}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputBoxWrapper
                                id="secretKey"
                                name="secretKey"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setSecretKey(e.target.value);
                                }}
                                label="Secret Key"
                                value={secretKey}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputBoxWrapper
                                id="sourceBucket"
                                name="sourceBucket"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setSourceBucket(e.target.value);
                                }}
                                label="Source Bucket"
                                value={sourceBucket}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputBoxWrapper
                                id="targetURL"
                                name="targetURL"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setTargetURL(e.target.value);
                                }}
                                label="Target URL"
                                value={targetURL}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputBoxWrapper
                                id="targetBucket"
                                name="targetBucket"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setTargetBucket(e.target.value);
                                }}
                                label="Target Bucket"
                                value={targetBucket}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SelectWrapper
                                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                    setRemoteARN(e.target.value as string);
                                }}
                                id="remoteARN"
                                name="remoteARN"
                                label={"Remote ARN"}
                                value={remoteARN}
                                options={arnValues}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputBoxWrapper
                                id="status"
                                name="status"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setStatus(e.target.value);
                                }}
                                label="Status"
                                value={status}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <SelectWrapper
                                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                                    setService(e.target.value as string);
                                }}
                                id="service"
                                name="service"
                                label={"Service"}
                                value={service}
                                options={serviceOptions}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.buttonContainer}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={addLoading}
                        >
                            Save
                        </Button>
                    </Grid>
                    {addLoading && (
                        <Grid item xs={12}>
                            <LinearProgress/>
                        </Grid>
                    )}
                </Grid>
            </form>
        </ModalWrapper>
    );
}

export default withStyles(styles)(AddRemoteBucket);
