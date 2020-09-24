import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from '@map-colonies/react-core';
import './link.cell-renderer.css';

export const LinkRenderer: React.FC<any> = (
  props
) => {
  const value = props.data.link; 
  const theme = useTheme();
  const intl = useIntl();

  if (!value) {
    return <></>;//''; // not null!
  }
  return (
    <a href={value} className="buttonLink" style={{backgroundColor:theme.primary}}>
      <FormattedMessage id="export-table.link.text" />
    </a>
  );

};
