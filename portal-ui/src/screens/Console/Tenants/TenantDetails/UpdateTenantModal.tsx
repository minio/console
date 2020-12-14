import React, { useState, Fragment, useEffect, useCallback } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import ModalWrapper from "../../Common/ModalWrapper/ModalWrapper";
import { Button, Grid } from "@material-ui/core";
import InputBoxWrapper from "../../Common/FormComponents/InputBoxWrapper/InputBoxWrapper";
import FormSwitchWrapper from "../../Common/FormComponents/FormSwitchWrapper/FormSwitchWrapper";
import api from "../../../../common/api";
import { modalBasic } from "../../Common/FormComponents/common/styleLibrary";

interface IUpdateTenantModal {
  open: boolean;
  closeModalAndRefresh: (update: boolean) => any;
  namespace: string;
  idTenant: string;
  classes: any;
}

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

const UpdateTenantModal = ({
  open,
  closeModalAndRefresh,
  namespace,
  idTenant,
  classes,
}: IUpdateTenantModal) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [minioImage, setMinioImage] = useState<string>("");
  const [consoleImage, setConsoleImage] = useState<string>("");
  const [imageRegistry, setImageRegistry] = useState<boolean>(false);
  const [imageRegistryEndpoint, setImageRegistryEndpoint] = useState<string>(
    ""
  );
  const [imageRegistryUsername, setImageRegistryUsername] = useState<string>(
    ""
  );
  const [imageRegistryPassword, setImageRegistryPassword] = useState<string>(
    ""
  );
  const [validMinioImage, setValidMinioImage] = useState<boolean>(true);
  const [validConsoleImage, setValidConsoleImage] = useState<boolean>(true);

  const validateImage = useCallback(
    (fieldToCheck: string) => {
      const pattern = new RegExp("^$|^((.*?)/(.*?):(.+))$");

      switch (fieldToCheck) {
        case "consoleImage":
          setValidConsoleImage(pattern.test(consoleImage));
          break;
        case "minioImage":
          setValidMinioImage(pattern.test(minioImage));
          break;
      }
    },
    [consoleImage, minioImage]
  );

  useEffect(() => {
    validateImage("minioImage");
  }, [minioImage, validateImage]);

  useEffect(() => {
    validateImage("consoleImage");
  }, [consoleImage, validateImage]);

  const closeAction = () => {
    closeModalAndRefresh(false);
  };

  const resetForm = () => {
    setMinioImage("");
    setConsoleImage("");
    setImageRegistry(false);
    setImageRegistryEndpoint("");
    setImageRegistryUsername("");
    setImageRegistryPassword("");
  };

  const updateMinIOImage = () => {
    setIsSending(true);

    let payload = {
      image: minioImage,
      console_image: consoleImage,
      enable_prometheus: true,
    };

    if (imageRegistry) {
      const registry: any = {
        image_registry: {
          registry: imageRegistryEndpoint,
          username: imageRegistryUsername,
          password: imageRegistryPassword,
        },
      };
      payload = {
        ...payload,
        ...registry,
      };
    }

    api
      .invoke(
        "PUT",
        `/api/v1/namespaces/${namespace}/tenants/${idTenant}`,
        payload
      )
      .then((res) => {
        setIsSending(false);
        closeModalAndRefresh(true);
      })
      .catch((error) => {
        setError(error);
        setIsSending(false);
      });
  };

  return (
    <ModalWrapper
      title={"Update MinIO Version"}
      modalOpen={open}
      onClose={closeAction}
    >
      <Grid container>
        <Grid item xs={12} className={classes.formScrollable}>
          {error !== "" && <span className={classes.errorBlock}>{error}</span>}
          <span>
            Please enter the MinIO image from dockerhub to use. If blank, then
            latest build will be used.
          </span>
          <br />
          <br />
          <Grid item xs={12}>
            <InputBoxWrapper
              value={minioImage}
              label={"MinIO's Image"}
              id={"minioImage"}
              name={"minioImage"}
              placeholder={"E.g. minio/minio:RELEASE.2020-05-08T02-40-49Z"}
              onChange={(e) => {
                setMinioImage(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <InputBoxWrapper
              value={consoleImage}
              label={"Console's Image"}
              id={"consoleImage"}
              name={"consoleImage"}
              placeholder={"E.g. minio/console:v0.3.13"}
              onChange={(e) => {
                setConsoleImage(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormSwitchWrapper
              value="imageRegistry"
              id="setImageRegistry"
              name="setImageRegistry"
              checked={imageRegistry}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setImageRegistry(!imageRegistry);
              }}
              label={"Set Custom Image Registry"}
              indicatorLabels={["Yes", "No"]}
            />
          </Grid>
          {imageRegistry && (
            <Fragment>
              <Grid item xs={12}>
                <InputBoxWrapper
                  value={imageRegistryEndpoint}
                  label={"Endpoint"}
                  id={"imageRegistry"}
                  name={"imageRegistry"}
                  placeholder={"E.g. https://index.docker.io/v1/"}
                  onChange={(e) => {
                    setImageRegistryEndpoint(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  value={imageRegistryUsername}
                  label={"Username"}
                  id={"imageRegistryUsername"}
                  name={"imageRegistryUsername"}
                  placeholder={"Enter image registry username"}
                  onChange={(e) => {
                    setImageRegistryUsername(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <InputBoxWrapper
                  value={imageRegistryPassword}
                  label={"Password"}
                  id={"imageRegistryPassword"}
                  name={"imageRegistryPassword"}
                  placeholder={"Enter image registry password"}
                  onChange={(e) => {
                    setImageRegistryPassword(e.target.value);
                  }}
                />
              </Grid>
            </Fragment>
          )}
        </Grid>
        <Grid item xs={12} className={classes.buttonContainer}>
          <button
            type="button"
            color="primary"
            className={classes.clearButton}
            onClick={resetForm}
          >
            Clear
          </button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              !validMinioImage ||
              !validConsoleImage ||
              (imageRegistry &&
                (imageRegistryEndpoint.trim() === "" ||
                  imageRegistryUsername.trim() === "" ||
                  imageRegistryPassword.trim() === "")) ||
              isSending
            }
            onClick={updateMinIOImage}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </ModalWrapper>
  );
};

export default withStyles(styles)(UpdateTenantModal);
