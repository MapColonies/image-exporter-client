import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { LinearProgress, Typography } from '@map-colonies/react-core';
import { Box } from '@map-colonies/react-components';
import './progress.cell-renderer.css';
import { IGeoPackage } from '../../../models/geoPackage';

const ONE_HUNDRED = 100;
export const ProgressRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  const value: number = (props.data as IGeoPackage).progress; 
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
    <Box style={{display: 'flex', height: '40px', alignItems: 'center'}}>
      <Typography use="body1" className={'rendererLabel'}>{getPercentageText()}</Typography>
      <LinearProgress progress={getProgressValue()} />
    </Box>
  );

};
