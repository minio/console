import React, { useState } from "react";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import SelectWrapper from "../../Common/FormComponents/SelectWrapper/SelectWrapper";
import Grid from "@material-ui/core/Grid";
import { factorForDropdown, getTotalSize } from "../../../../common/utils";
import { Button, LinearProgress } from "@material-ui/core";

interface IAddZoneProps {
  classes: any;
  open: boolean;
  onCloseZoneAndReload: (shouldReload: boolean) => void;
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
}: IAddZoneProps) => {
  const [addSending, setAddSending] = useState<boolean>(false);
  const [zoneName, setZoneName] = useState<string>("");
  const [numberOfInstances, setNumberOfInstances] = useState<number>(0);
  const [volumesPerInstance, setVolumesPerInstance] = useState<number>(0);
  const [sizeFactor, setSizeFactor] = useState<string>("GiB");
  const [volumeConfiguration, setVolumeConfig] = useState<string>("");
  const [storageClass, setStorageClass] = useState<string>("");

  const instanceCapacity: number =
    parseFloat(volumeConfiguration) * volumesPerInstance;
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
          <InputBoxWrapper
            id="volumes_per_instance"
            name="volumes_per_instance"
            type="number"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setVolumesPerInstance(parseInt(e.target.value));
            }}
            label="Volumes per Instance"
            value={volumesPerInstance.toString(10)}
          />
        </Grid>
        <Grid item xs={12}>
          <div className={classes.multiContainer}>
            <div>
              <InputBoxWrapper
                id="volume_size"
                name="volume_size"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setVolumeConfig(e.target.value);
                }}
                label="Size"
                value={volumeConfiguration}
              />
            </div>
            <div className={classes.sizeFactorContainer}>
              <SelectWrapper
                label=""
                id="size_factor"
                name="size_factor"
                value={sizeFactor}
                onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                  setSizeFactor(e.target.value as string);
                }}
                options={factorForDropdown()}
              />
            </div>
          </div>
          <Grid item xs={12}>
            <InputBoxWrapper
              id="storage_class"
              name="storage_class"
              type="string"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setStorageClass(e.target.value);
              }}
              label="Volumes per Server"
              value={storageClass}
            />
          </Grid>
          <Grid item xs={12} className={classes.bottomContainer}>
            <div className={classes.factorElements}>
              <div>
                <div className={classes.sizeNumber}>
                  {getTotalSize(instanceCapacity.toString(10), sizeFactor)}
                </div>
                <div className={classes.sizeDescription}>Instance Capacity</div>
              </div>
              <div>
                <div className={classes.sizeNumber}>
                  {getTotalSize(totalCapacity.toString(10), sizeFactor)}
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
