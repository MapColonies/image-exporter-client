import React, { useState } from 'react';
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
  TextField,
  Button
} from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';
import { BBoxCorner, Corner } from '../bbox/bbox-corner-indicator';
import { BBoxAreaLimit, isBBoxWithinLimit } from '../../../common/helpers/bbox-area';
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
    }

  })
);

interface BBoxCorners {
  bottomLeftLat: number;
  bottomLeftLon: number;
  topRightLat: number;
  topRightLon: number;
}

interface BBoxError {
  bboxArea: string;
}

const validate = (values: BBoxCorners, intl: IntlShape): BBoxError => {
  const errors: BBoxError = { bboxArea: '' };

  try {
    const line = turf.lineString([
      [values.bottomLeftLon, values.bottomLeftLat],
      [values.topRightLon, values.topRightLat],
    ]);
    const polygon = bboxPolygon(bbox(line));
    const isWithinLimit = isBBoxWithinLimit(polygon.geometry);
    if (isWithinLimit !== BBoxAreaLimit.OK) {
      const messageFormat = isWithinLimit === BBoxAreaLimit.TOO_BIG ? 'custom-bbox.form-error.area.large.text' : 'custom-bbox.form-error.area.small.text';
      errors.bboxArea = intl.formatMessage({ id: messageFormat });
    }
  } catch (err) {
    errors.bboxArea = intl.formatMessage({ id: 'custom-bbox.form-error.area.invalid.text' });
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
      topRightLat: 0.00001,
      topRightLon: 0.00001,
    },
    onSubmit: values => {
      const err = validate(values, intl);

      if (!err.bboxArea) {
        const line = turf.lineString([
          [values.bottomLeftLon, values.bottomLeftLat],
          [values.topRightLon, values.topRightLat],
        ]);
        const polygon = bboxPolygon(bbox(line));

        onPolygonUpdate(polygon.geometry);
        handleClose(false);
        setFormErrors({
          bboxArea: ''
        });
      } else {
        setFormErrors(err);
      }

    },
  });

  const [formErrors, setFormErrors] = useState({ bboxArea: '' });

  const handleClose = (isOpened: boolean): void => {
    onSetOpen(isOpened);
  };

  // eslint-disable-next-line
  const checkValidLat = (e: React.ChangeEvent<any>) => {
    const maxMinLatValue = 90;
    const isValidBBOXValue: boolean = innerCheckValidBBOXValue(e, maxMinLatValue);
    const isValidValuePattern: boolean = isValidRegexPattern(e);
    return isValidBBOXValue && isValidValuePattern? formik.handleChange(e) : false;
  };

  // eslint-disable-next-line
  const checkValidLong = (e: React.ChangeEvent<any>) => {
    const maxMinLongValue = 180;
    const isValidBBOXValue: boolean = innerCheckValidBBOXValue(e, maxMinLongValue);
    const isValidValuePattern: boolean = isValidRegexPattern(e);
    return isValidBBOXValue && isValidValuePattern ? formik.handleChange(e) : false;
  };

  const innerCheckValidBBOXValue = (e: React.ChangeEvent<any>, maxMinValue: number): boolean => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const valueString: string = e.target.value as string;
    if (!valueString) {
      return false;
    }
    const splited = valueString.split('.');
    const maxFractionDigits = EXPORTER_CONFIG.EXPORT.MAX_FRACTION_DIGITS;
    const numberOfSplitedNumber = EXPORTER_CONFIG.EXPORT.NUMBER_OF_SPLITED_NUMBER;
    if (splited.length === numberOfSplitedNumber && splited[1].length > maxFractionDigits) {
      return false;
    }
    const value = Number(valueString);
    if (value < -maxMinValue || value > maxMinValue) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line
  const isValidRegexPattern = (e: React.ChangeEvent<any>): boolean => {
    // eslint-disable-next-line
    const FIRST_CHAR_IDX = 0;
    const data: string = (e.nativeEvent as any).data;
    if (!data)
      return true;
  
    const charIdx = data.search(/[0-9.)]+/i);
    return (charIdx === FIRST_CHAR_IDX);
  };

  return (
    <Dialog open={ isOpen } preventOutsideDismiss={ true }>
      <DialogTitle>
        <FormattedMessage id="custom-bbox.dialog.title" />
      </DialogTitle>
      <DialogContent>
        <form onSubmit={ formik.handleSubmit }>
          <Box style={ { display: 'flex', marginBottom: '16px' } }>
            <TextField
              label={ intl.formatMessage({ id: 'custom-bbox.dialog-field.top_right_lat.label' }) }
              id="topRightLat" 
              name="topRightLat"
              type="text"
              onChange={ checkValidLat }
              value={ formik.values.topRightLat }
              className={ classes.spacer }
            />
            <TextField
              label={ intl.formatMessage({ id: 'custom-bbox.dialog-field.top_right_lon.label' }) }
              id="topRightLon"
              name="topRightLon"
              type="text"
              onChange={ checkValidLong }
              value={ formik.values.topRightLon }
              className={ classes.spacer }
            />
            <BBoxCorner corner={ Corner.TOP_RIGHT } />
          </Box>
          <Box style={ { display: 'flex' } }>
            <TextField
              label={ intl.formatMessage({ id: 'custom-bbox.dialog-field.bottom_left_lat.label' }) }
              id="bottomLeftLat"
              name="bottomLeftLat"
              type="number"
              onChange={ checkValidLat }
              value={ formik.values.bottomLeftLat }
              className={ classes.spacer }
            />
            <TextField
              label={ intl.formatMessage({ id: 'custom-bbox.dialog-field.bottom_left_lon.label' }) }
              id="bottomLeftLon"
              name="bottomLeftLon"
              type="number"
              onChange={ checkValidLong }
              value={ formik.values.bottomLeftLon }
              className={ classes.spacer }
            />
            <BBoxCorner corner={ Corner.BOTTOM_LEFT } />
          </Box>
          <Box style={ { display: 'flex', justifyContent: 'flex-end', marginTop: '16px', gap: '16px' } }>
            {
              formErrors.bboxArea ?
                <div id="errorContainer" className={ classes.errorContainer }>
                  { `${ intl.formatMessage({ id: 'general.error.label' }) }: ${ formErrors.bboxArea }` }
                </div> :
                null
            }
            <Button type="button" onClick={ (): void => {
              handleClose(false);
            } }>
              <FormattedMessage id="general.cancel-btn.text" />
            </Button>
            <Button raised type="submit">
              <FormattedMessage id="general.ok-btn.text" />
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>

  );
};
