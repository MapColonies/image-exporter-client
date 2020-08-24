import React, { useState } from 'react';
import { Polygon } from 'geojson';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DrawType } from  '@map-colonies/react-components'; 
import { PolygonSelectionUi } from './polygon-selection-ui';
import { MapWrapper } from './map-wrapper';

const PLACEMENT_SPACING_FACTOR = 1.5;
const WIDTH_SPACING_FACTOR = 80;
const useStyle = makeStyles((theme: Theme) =>
  createStyles({
    map: {
      height: '100%',
      width: '100%',
      position: 'fixed',
    },
    absolute: {
      position: 'absolute',
      zIndex: 1000,
      left: theme.spacing(PLACEMENT_SPACING_FACTOR),
      top: theme.spacing(PLACEMENT_SPACING_FACTOR),
    },
    filtersContainer: {
      display: 'flex',
      padding: theme.spacing(1),
    },
    filtersMargin: {
      marginLeft: theme.spacing(1),
    },
  })
);

export interface MapContainerProps {
  handlePolygonSelected: (polygon: Polygon) => void;
  handlePolygonReset: () => void;
  mapContent?: React.ReactNode;
  filters?: React.ReactNode[];
}

export const MapContainer: React.FC<MapContainerProps> = (
  props
) => {
  const [drawType, setDrawType] = useState<DrawType>();
  const [selectionPolygon, setSelectionPolygon] = useState<Polygon>();
  const classes = useStyle();

  const onPolygonSelection = (polygon: Polygon): void => {
    setSelectionPolygon(polygon);
    setDrawType(undefined);
    props.handlePolygonSelected(polygon);
  };

  const onReset = (): void => {
    setSelectionPolygon(undefined);
    props.handlePolygonReset();
  };

  return (
    <div className={classes.map}>
      <div className={`${classes.absolute}`}>
        <div className={classes.filtersContainer}>
          <PolygonSelectionUi
            onCancelDraw={(): void => setDrawType(undefined)}
            onReset={onReset}
            onStartDraw={setDrawType}
            isSelectionEnabled={drawType !== undefined}
            onPolygonUpdate={onPolygonSelection}
          />
          {props.filters?.map((filter, index) => (
            <div key={index} className={classes.filtersMargin}>
              {filter}
            </div>
          ))}
        </div>
      </div>
      <MapWrapper
        children={props.mapContent}
        onPolygonSelection={onPolygonSelection}
        drawType={drawType}
        selectionPolygon={selectionPolygon}
      />
    </div>
  );
};
