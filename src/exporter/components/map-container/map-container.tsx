import React, { useState } from 'react';
import { Polygon } from 'geojson';
import { DrawType } from  '@map-colonies/react-components'; 
import { PolygonSelectionUi } from './polygon-selection-ui';
import { MapWrapper } from './map-wrapper';
import './map-container.css';
import { isBBoxWithinLimit } from '../../../common/helpers/bbox-area';

export interface MapContainerProps {
  selectionPolygon: Polygon;
  handlePolygonSelected: (polygon: Polygon) => void;
  handlePolygonReset: () => void;
  handleError: () => void;
  isDrawDisabled: boolean;
  mapContent?: React.ReactNode;
  filters?: React.ReactNode[];
}

export const MapContainer: React.FC<MapContainerProps> = (
  props
) => {
  const [drawType, setDrawType] = useState<DrawType>();

  const onPolygonSelection = (polygon: Polygon): void => {
    if(!isBBoxWithinLimit(polygon)) {
      props.handleError();
    }

    setDrawType(undefined);
    props.handlePolygonSelected(polygon);
  };

  const onReset = (): void => {
    props.handlePolygonReset();
  };

  return (
    <div className="map">
      <div className="filtersPosition">
        <div className="filtersContainer">
          <PolygonSelectionUi
            onCancelDraw={(): void => setDrawType(undefined)}
            onReset={onReset}
            onStartDraw={setDrawType}
            isSelectionEnabled={drawType !== undefined}
            isDrawDisabled={props.isDrawDisabled}
            onPolygonUpdate={onPolygonSelection}
          />
          {props.filters?.map((filter, index) => (
            <div key={index} className="filtersMargin">
              {filter}
            </div>
          ))}
        </div>
      </div>
      <MapWrapper
        children={props.mapContent}
        onPolygonSelection={onPolygonSelection}
        drawType={drawType}
        selectionPolygon={props.selectionPolygon}
      />
    </div>
  );
};
