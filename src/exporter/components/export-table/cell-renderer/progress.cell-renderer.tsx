import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { LinearProgress, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import './progress.cell-renderer.css';
import EXPORTER_CONFIG from '../../../../common/config';
import { IExportTaskStatus } from '../../../models/exportTaskStatus';
import { useState } from 'react';


const ONE_HUNDRED = 100;
export const ProgressRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  const [isReversed] = useState<boolean>(EXPORTER_CONFIG.I18N.DEFAULT_LANGUAGE === 'he' ? true : false);
  const value: number = (props.data as IExportTaskStatus).progress; 
  if (!value) {
    return <></>;//''; // not null!
  }
  const getProgressValue = ():number => {
    return value > 1 ? (value / ONE_HUNDRED) : value;
  }

  const getPercentageText = ():string => {
    return value > 1 ? `${value}%` : `${value * ONE_HUNDRED}%`;
  }

  return (
    <Box style={{display: 'flex', height: '40px', alignItems: 'center', direction: 'ltr'}}>
      <Typography use="body1" className={'rendererLabel'}>{getPercentageText()}</Typography>
      <LinearProgress progress={getProgressValue()} reversed={isReversed} />
    </Box>
  );

};
