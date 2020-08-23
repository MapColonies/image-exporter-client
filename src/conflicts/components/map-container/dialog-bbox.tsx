import React from 'react';
import * as  turf from '@turf/helpers';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import { Polygon } from 'geojson';
import { useFormik } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  DialogButton, 
  TextField } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';

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
        bottom: 0   
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
    spacer:{
      marginRight: '16px'
    }

  })
);

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
  const formik = useFormik({
    initialValues: {
      bottomLeftLat: 0,
      bottomLeftLon: 0,
      topRightLat: 0,
      topRightLon: 0,
    },
    onSubmit: values => {
      // alert(JSON.stringify(values, null, 2));
      // const SAMPLE_POLYGON: Polygon={
      //   type:"Polygon",
      //   coordinates:[[
      //       [34.70371442859832,32.022954156119006],
      //       [35.146463443653914,32.022954156119006],
      //       [35.146463443653914,32.23608887564354],
      //       [34.70371442859832,32.23608887564354],
      //       [34.70371442859832,32.022954156119006]
      //   ]]
      // };

      const line = turf.lineString([
        [values.bottomLeftLat, values.bottomLeftLon],
        [values.topRightLat, values.topRightLon], 
      ]);
      const polygon = bboxPolygon(bbox(line));
      console.log('polygon', polygon.geometry);
    
      onPolygonUpdate(polygon.geometry);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Dialog
        open={isOpen}
        onClose={evt => {
          console.log(evt.detail.action);
          onSetOpen(false);
        }}
        onClosed={evt => console.log(evt.detail.action)}
      >
        <DialogTitle>Define bbox coordinates</DialogTitle>
        <DialogContent>
          <Box style={{display: 'flex', marginBottom: '16px'}}>
            <TextField 
              label="Right Top Lat" 
              id="topRightLat"
              name="topRightLat"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.topRightLat}
              className={classes.spacer}
            />
            <TextField 
              label="Right Top Lon" 
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
              label="Left Bottom Lat" 
              id="bottomLeftLat"
              name="bottomLeftLat"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.bottomLeftLat}
              className={classes.spacer}
            />
            <TextField 
              label="Left Bottom Lon" 
              id="bottomLeftLon"
              name="bottomLeftLon"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.bottomLeftLon}
              className={classes.spacer}
            />
            <div className={`${classes.bbox} ${classes.bboxLeftBottomCorner}`}></div>
          </Box>
        </DialogContent>
        <DialogActions>
          <DialogButton action="close" type="button">Cancel</DialogButton>
          <DialogButton raised action="accept" type="submit" isDefaultAction>
            Ok
          </DialogButton>
        </DialogActions>
      </Dialog>
    </form>

  );
}  