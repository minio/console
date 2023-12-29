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

import React, { useCallback, useEffect, useState, Fragment } from "react";
import {
  Autocomplete,
  Button,
  DataTable,
  EventSubscriptionIcon,
  Grid,
  InputBox,
} from "mds";
import { ErrorResponseHandler } from "../../../../common/types";
import { setModalErrorSnackMessage } from "../../../../systemSlice";
import { useAppDispatch } from "../../../../store";
import { api } from "api";
import { NotificationEventType } from "api/consoleApi";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import {
  formFieldStyles,
  modalBasic,
  modalStyleUtils,
} from "../../Common/FormComponents/common/styleLibrary";

interface IAddEventProps {
  open: boolean;
  selectedBucket: string;
  closeModalAndRefresh: () => void;
}

const AddEvent = ({
  open,
  selectedBucket,
  closeModalAndRefresh,
}: IAddEventProps) => {
  const dispatch = useAppDispatch();
  const [addLoading, setAddLoading] = useState<boolean>(false);
  const [prefix, setPrefix] = useState<string>("");
  const [suffix, setSuffix] = useState<string>("");
  const [arn, setArn] = useState<string>("");
  const [selectedEvents, setSelectedEvents] = useState<NotificationEventType[]>(
    [],
  );
  const [arnList, setArnList] = useState<string[] | undefined>([]);

  const addRecord = (event: React.FormEvent) => {
    event.preventDefault();
    if (addLoading) {
      return;
    }
    setAddLoading(true);
    api.buckets
      .createBucketEvent(selectedBucket, {
        configuration: {
          arn: arn,
          events: selectedEvents,
          prefix: prefix,
          suffix: suffix,
        },
        ignoreExisting: true,
      })
      .then(() => {
        setAddLoading(false);
        closeModalAndRefresh();
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  };

  const fetchArnList = useCallback(() => {
    setAddLoading(true);
    api.admin
      .arnList()
      .then((res) => {
        if (res.data.arns !== null) {
          setArnList(res.data.arns);
        }
        setAddLoading(false);
      })
      .catch((err: ErrorResponseHandler) => {
        setAddLoading(false);
        dispatch(setModalErrorSnackMessage(err));
      });
  }, [dispatch]);

  useEffect(() => {
    fetchArnList();
  }, [fetchArnList]);

  const events = [
    { label: "PUT - Object Uploaded", value: NotificationEventType.Put },
    { label: "GET - Object accessed", value: NotificationEventType.Get },
    { label: "DELETE - Object Deleted", value: NotificationEventType.Delete },
    {
      label: "REPLICA - Object Replicated",
      value: NotificationEventType.Replica,
    },
    { label: "ILM - Object Transitioned", value: NotificationEventType.Ilm },
    {
      label:
        "SCANNER - Object has too many versions / Prefixes has too many sub-folders",
      value: NotificationEventType.Scanner,
    },
  ];

  const handleClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetD = event.target;
    const value = targetD.value;
    const checked = targetD.checked;

    let elements: NotificationEventType[] = [...selectedEvents];

    if (checked) {
      elements.push(value as NotificationEventType);
    } else {
      elements = elements.filter((element) => element !== value);
    }

    setSelectedEvents(elements);
  };

  const arnValues = arnList?.map((arnConstant) => ({
    label: arnConstant,
    value: arnConstant,
  }));

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
      title="Subscribe To Bucket Events"
      titleIcon={<EventSubscriptionIcon />}
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          addRecord(e);
        }}
      >
        <Grid container>
          <Grid item xs={12} sx={modalBasic.formScrollable}>
            <Grid
              item
              xs={12}
              sx={{
                ...formFieldStyles.formFieldRow,
                "& div div .MuiOutlinedInput-root": {
                  padding: 0,
                },
              }}
            >
              <Autocomplete
                onChange={(value: string) => {
                  setArn(value);
                }}
                id="select-access-policy"
                name="select-access-policy"
                label={"ARN"}
                value={arn}
                options={arnValues || []}
                helpTip={
                  <Fragment>
                    <a
                      target="blank"
                      href="https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html"
                    >
                      Amazon Resource Name
                    </a>
                  </Fragment>
                }
              />
            </Grid>
            <Grid item xs={12} sx={formFieldStyles.formFieldRow}>
              <InputBox
                id="prefix-input"
                name="prefix-input"
                label="Prefix"
                value={prefix}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPrefix(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sx={formFieldStyles.formFieldRow}>
              <InputBox
                id="suffix-input"
                name="suffix-input"
                label="Suffix"
                value={suffix}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSuffix(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sx={formFieldStyles.formFieldRow}>
              <DataTable
                columns={[{ label: "Event", elementKey: "label" }]}
                idField={"value"}
                records={events}
                onSelect={handleClick}
                selectedItems={selectedEvents}
                noBackground
                customPaperHeight={"260px"}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sx={modalStyleUtils.modalButtonBar}>
            <Button
              id={"cancel-add-event"}
              type="button"
              variant="regular"
              disabled={addLoading}
              onClick={() => {
                closeModalAndRefresh();
              }}
              label={"Cancel"}
            />
            <Button
              id={"save-event"}
              type="submit"
              variant="callAction"
              disabled={addLoading || arn === "" || selectedEvents.length === 0}
              label={"Save"}
            />
          </Grid>
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default AddEvent;
