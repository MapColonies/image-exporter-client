import React, { useState, useEffect } from 'react';
import * as  turf from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import distance from '@turf/distance/dist/js'; //TODO: make a consumption "REGULAR"
import { Polygon } from 'geojson';
import { useFormik } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography
} from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';
import { BBoxCorner, Corner } from '../bbox/bbox-corner-indicator';
import { NotchLabel } from './notch-label';
import getTiles from '../../../common/helpers/osm-tile-list';
import EXPORTER_CONFIG from '../../../common/config';

const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    spacer: {
      marginRight: '16px'
    },
    errorContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 'auto',
      color: theme.palette.error.main,
    },
    noBorder: {
      border: 'unset',
    },
    readOnly: {
      backgroundColor: 'transparent !important',
    },
    infoLabel: {
      width: '110px',
    },
  })
);

const isValidPackName = (e: React.ChangeEvent<any>) => {
  const data = (e.nativeEvent as any).data;
  if(!data)
    return true;

  const charIdx = data.search(/[a-zA-Z0-9]+/i);
  return (charIdx === 0);
};

const isValidZoomValue = (zoom: number) => {
  return zoom >=1 && zoom <= 20;
}

interface ExportDialogProps {
  isOpen: boolean;
  selectedPolygon: Polygon;
  onSetOpen: (open: boolean) => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = (
  props
) => {
  const { isOpen, onSetOpen, selectedPolygon } = props;
  const classes = useStyle();
  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      bottomLeftLat: selectedPolygon.coordinates[0][0][1],
      bottomLeftLon: selectedPolygon.coordinates[0][0][0],
      topRightLat: selectedPolygon.coordinates[0][2][1],
      topRightLon: selectedPolygon.coordinates[0][2][0],
      minZoom: 2,
      maxZoom: 18,
      packageName: ''
    },
    onSubmit: values => {
      const tiles = getTiles(selectedPolygon, formik.values.minZoom, formik.values.maxZoom );
      console.log(tiles.length, tiles);
      // const err = validate(values, intl);
      // if (!err.latDistance && !err.lonDistance) {
      //   const line = turf.lineString([
      //     [values.bottomLeftLon, values.bottomLeftLat],
      //     [values.topRightLon, values.topRightLat],
      //   ]);
      //   const polygon = bboxPolygon(bbox(line));
      //   console.log('polygon', polygon.geometry);

      //   onPolygonUpdate(polygon.geometry);
      //   handleClose(false);
      // }
      // else {
      //   setFormErrors(err);
      // }

    },
  });
  const [numTiles, setNumTiles] = useState(0);
  useEffect(()=>{
    if( isValidZoomValue(formik.values.minZoom) &&
        isValidZoomValue(formik.values.maxZoom) && 
        formik.values.maxZoom >= formik.values.minZoom ){
      const tiles = getTiles(selectedPolygon, formik.values.minZoom, formik.values.maxZoom );
      setNumTiles(tiles.length);
      setFormErrors({ minMaxZooms: '' });
      // console.log(tiles.length, tiles);
    }else{
      setFormErrors({ minMaxZooms: 'Enter valid zoom values' });
    }
  },[formik.values.minZoom, formik.values.maxZoom, selectedPolygon]);

  const [formErrors, setFormErrors] = useState({ minMaxZooms: '' });

  const handleClose = (isOpened: boolean): void => {
    onSetOpen(isOpened);
  };

  const checkPackName = (e: React.ChangeEvent<any>) => {
    return isValidPackName(e) ? formik.handleChange(e) : false;
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle>
        <FormattedMessage id="export.dialog.title" />
      </DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              placeholder={intl.formatMessage({ id: 'export.dialog-field.package_name.placeholder' })}
              id="packageName"
              name="packageName"
              type="text"
              onChange={checkPackName}
              value={formik.values.packageName}
              fullwidth
            />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={<NotchLabel text={intl.formatMessage({ id: 'export.dialog-field.top_right_lat.label' })}/>}
              id="topRightLat"
              name="topRightLat"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.topRightLat}
              className={classes.spacer}
              readOnly
              outlined
            />
            <TextField
              label={<NotchLabel text={intl.formatMessage({ id: 'export.dialog-field.top_right_lon.label' })}/>}
              id="topRightLon"
              name="topRightLon"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.topRightLon}
              className={classes.spacer}
              readOnly
              outlined
            />
            <BBoxCorner corner={Corner.TOP_RIGHT} />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={<NotchLabel text={intl.formatMessage({ id: 'export.dialog-field.bottom_left_lat.label' })}/>}
              id="bottomLeftLat"
              name="bottomLeftLat"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.bottomLeftLat}
              className={classes.spacer}
              readOnly
              outlined
            />
            <TextField
              label={<NotchLabel text={intl.formatMessage({ id: 'export.dialog-field.bottom_left_lon.label' })}/>}
              id="bottomLeftLon"
              name="bottomLeftLon"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.bottomLeftLon}
              className={classes.spacer}
              readOnly
              outlined
            />
            <BBoxCorner corner={Corner.BOTTOM_LEFT} />
          </Box>
          <Box style={{ display: 'flex', marginBottom: '16px' }}>
            <TextField
              label={intl.formatMessage({ id: 'export.dialog-field.min_zoom.label' })}
              id="minZoom"
              name="minZoom"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.minZoom}
              className={classes.spacer}
            />
            <TextField
              label={intl.formatMessage({ id: 'export.dialog-field.max_zoom.label' })}
              id="maxZoom"
              name="maxZoom"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.maxZoom}
              className={classes.spacer}
            />
            <BBoxCorner corner={Corner.UNKNOWN} className={classes.noBorder} />
          </Box>

          <Box style={{ display: 'flex' }}>
            <Typography use="body1" className={classes.infoLabel}>
              <FormattedMessage id="export.dialog-info.label" />
            </Typography>
            <Typography use="body2">
              ~{numTiles} tiles,&nbsp;
            </Typography>
            <Typography use="body2" style={{marginLeft: '32px'}}>
              ~{Math.ceil(numTiles*EXPORTER_CONFIG.EXPORT.AVG_TILE_SIZE_KB)}Mb
            </Typography>
          </Box>
          <Box style={{ display: 'flex' }}>
            <Typography use="body1" className={classes.infoLabel}>
              <FormattedMessage id="export.dialog-info.link.label" /> 
            </Typography>
            <Typography use="body2">
              https://packages/{formik.values.packageName}.gpkg
            </Typography>
          </Box>

          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '16px' }}>
            {
              (!!formErrors.minMaxZooms) ?
                <div className={classes.errorContainer}>
                  {`${intl.formatMessage({ id: 'general.error.label' })}: ${formErrors.minMaxZooms}`}
                </div> :
                null
            }
            <Button type="button" onClick={(): void => { handleClose(false); }}>
              <FormattedMessage id="general.cancel-btn.text" />
            </Button>
            <Button raised type="submit" disabled={!!formErrors.minMaxZooms || !formik.values.packageName}>
              <FormattedMessage id="general.ok-btn.text" />
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>

  );
}
