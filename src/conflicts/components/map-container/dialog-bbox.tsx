import React, { useState } from 'react';
import * as  turf from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import distance  from '@turf/distance/dist/js'; //TODO: make a consumption "REGULAR"
import { Polygon } from 'geojson';
import { useFormik } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button} from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import EXPORTER_CONFIG from '../../../common/config';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';

  const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    bbox:{
      overflow: 'hidden',
      position: 'relative',
      border: 'solid 1px', 
      width: '60px', 
      height: '56px',
    },

    bboxLeftBottomCorner: {
      "&::before": {
        margin: '-1em',
        borderRadius: '50%',
        position: 'absolute',
        padding: '1em',
        boxShadow: '0 0 7px #b53',
        background: '#95a',
        content: "''",
        bottom: 0,
        left: 0 
      }
    },
    bboxRightTopCorner: {
      "&::before": {
        margin: '-1em',
        borderRadius: '50%',
        position: 'absolute',
        padding: '1em',
        boxShadow: '0 0 7px #b53',
        background: '#95a',
        content: "''",
        top: 0,
        right: 0   
      }
    },
    spacer: {
      marginRight: '16px'
    },
    errorContainer: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 'auto',
      color: theme.palette.error.main,
    }

  })
);

interface BBoxCorners {
  bottomLeftLat: number;
  bottomLeftLon: number;
  topRightLat: number;
  topRightLon: number;
}

interface BBoxCornersError {
  latDistance: string;
  lonDistance: string;
}

const validate = (values: BBoxCorners, intl: IntlShape): BBoxCornersError => {
  const errors: BBoxCornersError = {latDistance: '', lonDistance: ''};

  try{
    turf.lineString([
      [values.bottomLeftLon, values.bottomLeftLat],
      [values.topRightLon, values.topRightLat], 
    ]);

    const yDistance = distance(
      [values.bottomLeftLon, values.bottomLeftLat],
      [values.bottomLeftLon, values.topRightLat]);
    
    const xDistance = distance(
      [values.bottomLeftLon, values.bottomLeftLat],
      [values.topRightLon, values.bottomLeftLat]);
  
    if (yDistance > EXPORTER_CONFIG.BOUNDARIES.MAX_Y_KM){
      errors.latDistance = intl.formatMessage({id: 'custom-bbox.form-error.y-distance.text'});
    }
    if (xDistance > EXPORTER_CONFIG.BOUNDARIES.MAX_X_KM){
      errors.lonDistance = intl.formatMessage({id: 'custom-bbox.form-error.x-distance.text'});
    }
  }
  catch(err){
    errors.latDistance = 'Not valid coordinates';
  }

  return errors;
};


interface DialogBBoxProps {
  isOpen: boolean;
  onSetOpen: (open: boolean) => void;
  onPolygonUpdate: (polygon: Polygon) => void;
}

export const DialogBBox: React.FC<DialogBBoxProps> = (
  props
) => {
  const { isOpen, onSetOpen, onPolygonUpdate } = props;
  const classes = useStyle();
  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      bottomLeftLat: 0,
      bottomLeftLon: 0,
      topRightLat: 0,
      topRightLon: 0,
    },
    onSubmit: values => {
      const err = validate(values, intl);
      if(!err.latDistance && !err.lonDistance){
        const line = turf.lineString([
          [values.bottomLeftLon, values.bottomLeftLat],
          [values.topRightLon, values.topRightLat], 
        ]);
        const polygon = bboxPolygon(bbox(line));
        console.log('polygon', polygon.geometry);
  
        onPolygonUpdate(polygon.geometry);
        handleClose(false);
      }
      else{
        setFormErrors(err);
      }

    },
  });

  const [formErrors, setFormErrors] = useState({latDistance: '', lonDistance: ''});
  
  const handleClose = (isOpened:boolean):void => {
    onSetOpen(isOpened);
  }
  return (
      <Dialog open={isOpen}>
        <DialogTitle>
          <FormattedMessage id="custom-bbox.dialog.title"/>
        </DialogTitle>
        <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Box style={{display: 'flex', marginBottom: '16px'}}>
            <TextField 
              label={intl.formatMessage({id: 'custom-bbox.dialog-field.top_right_lat.text'})} 
              id="topRightLat"
              name="topRightLat"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.topRightLat}
              className={classes.spacer}
            />
            <TextField 
              label={intl.formatMessage({id: 'custom-bbox.dialog-field.top_right_lon.text'})} 
              id="topRightLon"
              name="topRightLon"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.topRightLon}
              className={classes.spacer}
            />
            <div className={`${classes.bbox} ${classes.bboxRightTopCorner}`}></div>
          </Box>
          <Box style={{display: 'flex'}}>
          <TextField 
              label={intl.formatMessage({id: 'custom-bbox.dialog-field.bottom_left_lat.text'})} 
              id="bottomLeftLat"
              name="bottomLeftLat"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.bottomLeftLat}
              className={classes.spacer}
            />
            <TextField 
              label={intl.formatMessage({id: 'custom-bbox.dialog-field.bottom_left_lon.text'})}
              id="bottomLeftLon"
              name="bottomLeftLon"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.bottomLeftLon}
              className={classes.spacer}
            />
            <div className={`${classes.bbox} ${classes.bboxLeftBottomCorner}`}></div>
          </Box>
          <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '16px' }}>
            {
              (!!formErrors.latDistance || !!formErrors.lonDistance) ? 
              <div className={classes.errorContainer}>
                {`${intl.formatMessage({id: 'general.error.label'})}: ${formErrors.latDistance} ${formErrors.lonDistance}`}
              </div> : 
              null
            }
            <Button type="button" onClick={()=>{handleClose(false);}}>
              <FormattedMessage id="general.cancel-btn.text"/>
            </Button>
            <Button raised type="submit">
              <FormattedMessage id="general.ok-btn.text"/>
            </Button>
          </Box>
        </form>
        </DialogContent>
      </Dialog>

  );
}
