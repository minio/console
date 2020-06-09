import React, { useState } from "react";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import Grid from "@material-ui/core/Grid";
import {
  factorForDropdown,
  getTotalSize,
  niceBytes,
} from "../../../../common/utils";
import { Button, LinearProgress } from "@material-ui/core";

interface IAddZoneProps {
  classes: any;
  open: boolean;
  onCloseZoneAndReload: (shouldReload: boolean) => void;
  volumesPerInstance: number;
  volumeSize: number;
}

const styles = (theme: Theme) =>
  createStyles({
    errorBlock: {
      color: "red",
    },
    buttonContainer: {
      textAlign: "right",
    },
    multiContainer: {
      display: "flex",
      alignItems: "center" as const,
      justifyContent: "flex-start" as const,
    },
    sizeFactorContainer: {
      marginLeft: 8,
    },
    bottomContainer: {
      display: "flex",
      flexGrow: 1,
      alignItems: "center",
      "& div": {
        flexGrow: 1,
        width: "100%",
      },
    },
    factorElements: {
      display: "flex",
      justifyContent: "flex-start",
    },
    sizeNumber: {
      fontSize: 35,
      fontWeight: 700,
      textAlign: "center",
    },
    sizeDescription: {
      fontSize: 14,
      color: "#777",
      textAlign: "center",
    },
    ...modalBasic,
  });

const AddZoneModal = ({
  classes,
  open,
  onCloseZoneAndReload,
  volumesPerInstance,
  volumeSize,
}: IAddZoneProps) => {
  const [addSending, setAddSending] = useState<boolean>(false);
  const [zoneName, setZoneName] = useState<string>("");
  const [numberOfInstances, setNumberOfInstances] = useState<number>(0);

  const instanceCapacity: number = volumeSize * volumesPerInstance;
  const totalCapacity: number = instanceCapacity * numberOfInstances;

  return (
    <ModalWrapper
      onClose={() => onCloseZoneAndReload(false)}
      modalOpen={open}
      title="Add Zone"
    >
      <form
        noValidate
        autoComplete="off"
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          setAddSending(true);
        }}
      >
        <Grid item xs={12}>
          <InputBoxWrapper
            id="zone_name"
            name="zone_name"
            type="string"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setZoneName(e.target.value);
            }}
            label="Name"
            value={zoneName}
          />
        </Grid>
        <Grid item xs={12}>
          <InputBoxWrapper
            id="number_instances"
            name="number_instances"
            type="number"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setNumberOfInstances(parseInt(e.target.value));
            }}
            label="Volumes per Server"
            value={numberOfInstances.toString(10)}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} className={classes.bottomContainer}>
            <div className={classes.factorElements}>
              <div>
                <div className={classes.sizeNumber}>
                  {niceBytes(instanceCapacity.toString(10))}
                </div>
                <div className={classes.sizeDescription}>Instance Capacity</div>
              </div>
              <div>
                <div className={classes.sizeNumber}>
                  {niceBytes(totalCapacity.toString(10))}
                </div>
                <div className={classes.sizeDescription}>Total Capacity</div>
              </div>
            </div>
            <div className={classes.buttonContainer}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={addSending}
              >
                Save
              </Button>
            </div>
          </Grid>
          {addSending && (
            <Grid item xs={12}>
              <LinearProgress />
            </Grid>
          )}
        </Grid>
      </form>
    </ModalWrapper>
  );
};

export default withStyles(styles)(AddZoneModal);
