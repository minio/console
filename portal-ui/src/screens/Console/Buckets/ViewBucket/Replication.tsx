import React, { useState, useEffect } from "react";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import { Button, LinearProgress } from "@material-ui/core";

interface IReplicationModal {
  open: boolean;
  closeModalAndRefresh: () => any;
  classes: any;
}

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    buttonContainer: {
      textAlign: "right",
    },
    ...modalBasic,
  });

const Replication = ({
  open,
  closeModalAndRefresh,
  classes,
}: IReplicationModal) => {
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [remoteURL, setRemoteURL] = useState("");
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [ARN, setARN] = useState("");
  const [arnValues, setARNValues] = useState([]);

  useEffect(() => {
    if (addLoading) {
      addRecord();
    }
  }, [addLoading]);

  const addRecord = () => {
    setAddLoading(false);
  };

  return (
    <ModalWrapper
      modalOpen={open}
      onClose={() => {
        setAddError("");
        closeModalAndRefresh();
      }}
      title="Set Bucket Replication"
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setAddLoading(true);
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
                id="remote-url"
                name="remote-url"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setRemoteURL(e.target.value);
                }}
                label="Remote URL"
                value={remoteURL}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="source"
                name="source"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSource(e.target.value);
                }}
                label="Source"
                value={source}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBoxWrapper
                id="target"
                name="target"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setTarget(e.target.value);
                }}
                label="Target"
                value={target}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectWrapper
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setARN(e.target.value as string);
                }}
                id="arn"
                name="arn"
                label={"ARN"}
                value={ARN}
                options={arnValues}
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
              <LinearProgress />
            </Grid>
          )}
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default withStyles(styles)(Replication);
