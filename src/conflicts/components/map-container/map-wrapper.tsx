import React from 'react';
import { Geometry } from 'geojson';
import rewind from '@turf/rewind';
import { Polygon } from 'geojson';
import { Map,
  TileLayer,
  VectorSource,
  GeoJSONFeature,
  TileOsm,
  VectorLayer,
  DrawInteraction,
  DrawType
 } from '@map-colonies/react-components';
import './map-wrapper.css';

interface MapWrapperProps {
  drawType?: DrawType;
  selectionPolygon?: Polygon;
  onPolygonSelection: (polygon: Polygon) => void;
}

export const MapWrapper: React.FC<MapWrapperProps> = (props) => {
  const handlePolygonSelected = (geometry: Geometry): void => {
    const rewindedPolygon = rewind(geometry as Polygon);
    props.onPolygonSelection(rewindedPolygon);
  };

  return (
    <Map allowFullScreen={true} showMousePosition={true}>
      <TileLayer>
        <TileOsm />
      </TileLayer>
      {props.selectionPolygon && (
        <VectorLayer>
          <VectorSource>
            <GeoJSONFeature geometry={props.selectionPolygon} />
          </VectorSource>
        </VectorLayer>
      )}
      {props.children}
      {props.drawType !== undefined && (
        <DrawInteraction
          drawType={props.drawType}
          onPolygonSelected={handlePolygonSelected}
        />
      )}
    </Map>
  );
};
