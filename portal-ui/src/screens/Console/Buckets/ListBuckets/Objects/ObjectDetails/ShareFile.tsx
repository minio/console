import React, { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {
  modalBasic,
  predefinedList,
} from "../../../../Common/FormComponents/common/styleLibrary";
import ModalWrapper from "../../../../Common/ModalWrapper/ModalWrapper";
import DateSelector from "../../../../Common/FormComponents/DateSelector/DateSelector";
import { CopyIcon } from "../../../../../../icons";

const styles = (theme: Theme) =>
  createStyles({
    copyButtonContainer: {
      paddingLeft: 16,
    },
    modalContent: {
      paddingBottom: 53,
    },
    ...modalBasic,
    ...predefinedList,
  });

interface IShareFileProps {
  classes: any;
  open: boolean;
  closeModalAndRefresh: () => void;
}

const ShareFile = ({
  classes,
  open,
  closeModalAndRefresh,
}: IShareFileProps) => {
  return (
    <ModalWrapper
      title="Share File"
      modalOpen={open}
      onClose={() => {
        closeModalAndRefresh();
      }}
    >
      <Grid container className={classes.modalContent}>
        <Grid item xs={12} className={classes.dateContainer}>
          <DateSelector
            id="date"
            label="Active until"
            borderBottom={false}
            addSwitch={true}
          />
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={10} className={classes.predefinedList}>
            {"https://somelink.will/go/here"}
          </Grid>
          <Grid item xs={2} className={classes.copyButtonContainer}>
            <CopyToClipboard text={"https://somelink.will/go/here"}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CopyIcon />}
                onClick={() => {
                  console.log("copied!");
                }}
              >
                Copy
              </Button>
            </CopyToClipboard>
          </Grid>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default withStyles(styles)(ShareFile);
