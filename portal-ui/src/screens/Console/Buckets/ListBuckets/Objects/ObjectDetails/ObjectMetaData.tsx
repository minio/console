import React, { useCallback, useEffect, useState, Fragment } from "react";
import useApi from "../../../../Common/Hooks/useApi";
import { ErrorResponseHandler } from "../../../../../../common/types";
import { MetadataResponse } from "./types";
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import { Box, Table, TableBody, TableCell, TableRow } from "@mui/material";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import {detailsPanel, spacingUtils} from "../../../../Common/FormComponents/common/styleLibrary";
import { withStyles } from "@mui/styles";

interface IObjectMetadata {
  bucketName: string;
  internalPaths: string;
  classes?: any;
  actualInfo: any;
  linear?: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    propertiesIcon: {
      marginLeft: 5,
      "& .min-icon": {
        height: 12,
      },
    },

    capitalizeFirst: {
      textTransform: "capitalize",
      "& .min-icon": {
        width: 16,
        height: 16,
      },
    },
    titleCol: {
      width: "25%",
    },
    titleItem: {
      width: "35%",
    },
    ...spacingUtils,
      ...detailsPanel,
  });

const ObjectMetaData = ({
  bucketName,
  internalPaths,
  classes,
  actualInfo,
  linear = false,
}: IObjectMetadata) => {
  const [metaData, setMetaData] = useState<any>({});

  const onMetaDataSuccess = (res: MetadataResponse) => {
    let metadata = get(res, "objectMetadata", {});

    setMetaData(metadata);
  };
  const onMetaDataError = (err: ErrorResponseHandler) => false;

  const [, invokeMetaDataApi] = useApi(onMetaDataSuccess, onMetaDataError);

  const metaKeys = Object.keys(metaData);
  const loadMetaData = useCallback(() => {
    invokeMetaDataApi(
      "GET",
      `/api/v1/buckets/${bucketName}/objects/metadata?prefix=${internalPaths}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucketName, internalPaths, actualInfo]);

  useEffect(() => {
    if (actualInfo) {
      loadMetaData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualInfo, loadMetaData]);

  if (linear) {
    return (
      <Fragment>
        {metaKeys.map((element: string, index: number) => {
          const renderItem = Array.isArray(metaData[element])
            ? metaData[element].map(decodeURIComponent).join(", ")
            : decodeURIComponent(metaData[element]);

          return (
            <Box className={classes.metadataLinear}>
              <strong>{element}</strong>
              <br />
              {renderItem}
            </Box>
          );
        })}
      </Fragment>
    );
  }

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: "25px",
          marginBottom: "5px",
        }}
      >
        <h3
          style={{
            marginTop: "0",
            marginBottom: "0",
          }}
        >
          Object Metadata
        </h3>
      </Grid>

      <Grid item xs={12}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {metaKeys.map((element: string, index: number) => {
              const renderItem = Array.isArray(metaData[element])
                ? metaData[element].map(decodeURIComponent).join(", ")
                : decodeURIComponent(metaData[element]);

              return (
                <TableRow key={`tRow-${index.toString()}`}>
                  <TableCell
                    component="th"
                    scope="row"
                    className={classes.titleItem}
                  >
                    {element}
                  </TableCell>
                  <TableCell align="right">{renderItem}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(ObjectMetaData);
