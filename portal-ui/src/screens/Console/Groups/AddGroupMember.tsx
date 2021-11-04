import React, { useState } from "react";
import UsersSelectors from "./UsersSelectors";
import ModalWrapper from "../Common/ModalWrapper/ModalWrapper";
import PredefinedList from "../Common/FormComponents/PredefinedList/PredefinedList";
import Grid from "@mui/material/Grid";
import { Button } from "@mui/material";
import api from "../../../common/api";
import { ErrorResponseHandler } from "../../../common/types";
import { setModalErrorSnackMessage } from "../../../actions";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { modalBasic } from "../Common/FormComponents/common/styleLibrary";
import withStyles from "@mui/styles/withStyles";

type UserPickerModalProps = {
  classes?: any;
  title?: string;
  preSelectedUsers?: string[];
  selectedGroup?: string;
  open: boolean;
  onClose: () => void;
  onSaveClick: () => void;
  groupStatus?: string;
};

const styles = (theme: Theme) =>
  createStyles({
    buttonContainer: {
      textAlign: "right",
      marginTop: "1rem",
    },
    ...modalBasic,
  });

const AddGroupMember = ({
  classes,
  title = "",
  groupStatus = "enabled",
  preSelectedUsers = [],
  selectedGroup = "",
  open,
  onClose,
}: UserPickerModalProps) => {
  const [selectedUsers, setSelectedUsers] = useState(preSelectedUsers);

  function addMembersToGroup() {
    return api
      .invoke("PUT", `/api/v1/group?name=${encodeURI(selectedGroup)}`, {
        group: selectedGroup,
        members: selectedUsers,
        status: groupStatus,
      })
      .then((res) => {
        onClose();
      })
      .catch((err: ErrorResponseHandler) => {
        onClose();
        setModalErrorSnackMessage(err);
      });
  }

  return (
    <ModalWrapper modalOpen={open} onClose={onClose} title={title}>
      <PredefinedList label={`Selected Group`} content={selectedGroup} />

      <br />
      <UsersSelectors
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
        editMode={!selectedGroup}
      />

      <Grid item xs={12} className={classes.buttonContainer}>
        <button
          type="button"
          color="primary"
          className={classes.clearButton}
          onClick={() => {
            setSelectedUsers(preSelectedUsers);
          }}
        >
          Clear
        </button>

        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={() => {
            addMembersToGroup();
          }}
        >
          Save
        </Button>
      </Grid>
    </ModalWrapper>
  );
};

const mapDispatchToProps = {
  setModalErrorSnackMessage,
};

const connector = connect(null, mapDispatchToProps);
export default withStyles(styles)(connector(AddGroupMember));
