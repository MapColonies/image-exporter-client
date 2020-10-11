import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { FormattedMessage } from 'react-intl';
import { useTheme } from '@map-colonies/react-core';
import './link.cell-renderer.css';
import { IGeoPackage } from '../../../models/geoPackage';

export const LinkRenderer: React.FC<ICellRendererParams> = (
  props
) => {
  const value: string = (props.data as IGeoPackage).link; 
  const theme = useTheme();

  if (!value) {
    return <></>;//''; // not null!
  }
  return (
    <a href={value} className="buttonLink" style={{backgroundColor:theme.primary}}>
      <FormattedMessage id="export-table.link.text" />
    </a>
  );

};
